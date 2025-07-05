import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface FinancialSummary {
  totalSpent: number;
  categoryBreakdown: { category: string; total: number; percentage: number }[];
  monthlyTrend: { month: string; total: number }[];
  topCategories: { category: string; total: number }[];
}

export async function generateFinancialInsights(
  data: FinancialSummary
): Promise<string> {
  try {
    const prompt = `
    Analyze the following financial data and provide actionable insights and recommendations:

    Total Spent: $${data.totalSpent.toFixed(2)}
    
    Category Breakdown:
    ${data.categoryBreakdown
      .map(
        (cat) =>
          `- ${cat.category}: $${cat.total.toFixed(
            2
          )} (${cat.percentage.toFixed(1)}%)`
      )
      .join("\n")}
    
    Top Spending Categories:
    ${data.topCategories
      .map(
        (cat, idx) => `${idx + 1}. ${cat.category}: $${cat.total.toFixed(2)}`
      )
      .join("\n")}

    Please provide:
    1. Key spending patterns and trends
    2. Areas where spending could be optimized
    3. Specific actionable recommendations
    4. Budget allocation suggestions
    5. Financial health assessment

    Keep the response concise, practical, and easy to understand. Focus on actionable advice.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor AI that provides clear, actionable insights based on spending data. Be concise and practical in your recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return (
      chatCompletion.choices[0]?.message?.content ||
      "Unable to generate insights at this time."
    );
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error("Failed to generate financial insights");
  }
}

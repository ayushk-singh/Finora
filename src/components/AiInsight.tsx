"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AiInsightProps {
  className?: string;
}

function AiInsight({ className }: AiInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const generateInsight = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/insights");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate insights");
      }

      setInsight(data.insight);
      setHasLoaded(true);
    } catch (error) {
      toast.error("Failed to generate AI insights");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate insight on component mount
    generateInsight();
  }, []);

  const formatInsight = (text: string) => {
    // Split by numbers to create sections
    const sections = text.split(/(\d+\.\s)/).filter(Boolean);
    const formatted = [];

    for (let i = 0; i < sections.length; i++) {
      if (sections[i].match(/\d+\.\s/)) {
        // This is a number, combine with next section
        if (i + 1 < sections.length) {
          formatted.push(sections[i] + sections[i + 1]);
          i++; // Skip the next section since we combined it
        }
      } else if (!sections[i].match(/\d+\.\s/) && i === 0) {
        // This is text at the beginning
        formatted.push(sections[i]);
      }
    }

    return formatted.length > 0 ? formatted : [text];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>
          Get personalized insights and recommendations based on your spending
          patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={generateInsight}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading
              ? "Generating..."
              : hasLoaded
              ? "Refresh Insights"
              : "Generate Insights"}
          </Button>
        </div>

        {isLoading && !hasLoaded && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing your financial data...
              </p>
            </div>
          </div>
        )}

        {insight && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {formatInsight(insight).map((section, index) => (
                  <div key={index} className="mb-3">
                    {section.match(/^\d+\./) ? (
                      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border-l-4 border-purple-500">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {section}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {section}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!insight && !isLoading && hasLoaded && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No insights available. Add some transactions to get started!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AiInsight;

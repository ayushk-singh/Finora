import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBudget extends Document {
  category: string;
  amount: number;
  month: string; 
}

const BudgetSchema: Schema<IBudget> = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, 
});

export const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

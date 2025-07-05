import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
}


const TransactionSchema: Schema<ITransaction> = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});


export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  fromAccountId: string;
  toAccountId?: string;
  toIban?: string;
  toRecipient?: string;
  amount: number;
  currency: string;
  type: 'debit' | 'credit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

const TransactionSchema: Schema = new Schema({
  fromAccountId: {
    type: String,
    required: true,
    index: true
  },
  toAccountId: {
    type: String,
    index: true
  },
  toIban: {
    type: String
  },
  toRecipient: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'TND'
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  validatedBy: {
    type: String
  },
  validatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

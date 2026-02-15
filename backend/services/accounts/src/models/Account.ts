import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: string;
  iban: string;
  userId: string;
  balance: number;
  currency: string;
  accountType: string;
  accountHolder: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  iban: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'TND'
  },
  accountType: {
    type: String,
    default: 'Compte Courant'
  },
  accountHolder: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<IAccount>('Account', AccountSchema);

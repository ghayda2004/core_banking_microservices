import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  accountNumber: string;
  iban: string;
  balance: number;
  currency: string; // TND - Tunisian Dinar
  accountHolder: string;
  accountType: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  recipientIban?: string;
  recipientName?: string;
}

export interface TransferRequest {
  fromAccount: string;
  toIban: string;
  recipientName: string;
  amount: number;
  description: string;
  transactionDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) { }

  /**
   * Get account information
   */
  getAccountInfo(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/info`);
  }

  /**
   * Get transaction history
   */
  getTransactions(limit: number = 10): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions?limit=${limit}`);
  }

  /**
   * Transfer money between accounts
   */
  transferMoney(request: TransferRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, request);
  }

  /**
   * Get transaction statistics
   */
  getTransactionStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}

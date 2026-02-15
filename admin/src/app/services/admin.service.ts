import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Account {
  id: string;
  accountNumber: string;
  iban: string;
  userId: string;
  balance: number;
  currency: string;
  accountType: string;
  accountHolder: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  documentType: string;
  documentNumber: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toIban?: string;
  toRecipient?: string;
  amount: number;
  currency: string;
  type: 'debit' | 'credit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

export interface AdminStats {
  totalAccounts: number;
  totalClients: number;
  totalTransactions: number;
  activeAccounts: number;
  blockedAccounts: number;
  totalBalance: number;
  pendingTransactions: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('adminToken'));
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Authentication
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  setToken(token: string) {
    localStorage.setItem('adminToken', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  logout() {
    localStorage.removeItem('adminToken');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Accounts Management
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/admin/accounts`, {
      headers: this.getHeaders()
    });
  }

  blockAccount(accountId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/accounts/${accountId}/status`, 
      { status: 'blocked' },
      { headers: this.getHeaders() }
    );
  }

  unblockAccount(accountId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/accounts/${accountId}/status`, 
      { status: 'active' },
      { headers: this.getHeaders() }
    );
  }

  // Clients Management
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/admin/clients`, {
      headers: this.getHeaders()
    });
  }

  blockClient(clientId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/clients/${clientId}/status`, 
      { status: 'blocked' },
      { headers: this.getHeaders() }
    );
  }

  unblockClient(clientId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/clients/${clientId}/status`, 
      { status: 'active' },
      { headers: this.getHeaders() }
    );
  }

  // Transactions Management
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/admin/transactions`, {
      headers: this.getHeaders()
    });
  }

  getPendingTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/admin/transactions/pending`, {
      headers: this.getHeaders()
    });
  }

  validateTransaction(transactionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/transactions/${transactionId}/validate`, 
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectTransaction(transactionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/transactions/${transactionId}/reject`, 
      {},
      { headers: this.getHeaders() }
    );
  }

  // Microservices Health
  getHealthStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  // Calculate Statistics
  calculateStats(accounts: Account[], clients: Client[], transactions: Transaction[]): AdminStats {
    return {
      totalAccounts: accounts.length,
      totalClients: clients.length,
      totalTransactions: transactions.length,
      activeAccounts: accounts.filter(a => a.status === 'active').length,
      blockedAccounts: accounts.filter(a => a.status === 'blocked').length,
      totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
      pendingTransactions: transactions.filter(t => t.status === 'pending').length
    };
  }
}

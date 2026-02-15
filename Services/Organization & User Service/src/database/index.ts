import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Database Manager for Organization & User Service
 * Handles database initialization, schema creation, and connection management
 */

export class DatabaseManager {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = './data/organization.db') {
    this.dbPath = dbPath;
  }

  /**
   * Initialize database connection and create schema
   */
  async initialize(): Promise<void> {
    // Ensure data directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, async (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log('✅ Connected to SQLite database');
        
        try {
          await this.createSchema();
          console.log('✅ Database schema created/verified');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Create database schema
   */
  private async createSchema(): Promise<void> {
    const statements = [
      // Countries Table
      `CREATE TABLE IF NOT EXISTS countries (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        currency_code TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code)`,
      `CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(is_active)`,

      // Regions Table
      `CREATE TABLE IF NOT EXISTS regions (
        id TEXT PRIMARY KEY,
        country_id TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries(id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_id)`,
      `CREATE INDEX IF NOT EXISTS idx_regions_code ON regions(code)`,
      `CREATE INDEX IF NOT EXISTS idx_regions_active ON regions(is_active)`,

      // Branches Table
      `CREATE TABLE IF NOT EXISTS branches (
        id TEXT PRIMARY KEY,
        region_id TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        phone TEXT,
        email TEXT,
        branch_type TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        opening_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (region_id) REFERENCES regions(id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_branches_region ON branches(region_id)`,
      `CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code)`,
      `CREATE INDEX IF NOT EXISTS idx_branches_type ON branches(branch_type)`,
      `CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active)`,

      // Roles Table
      `CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        level INTEGER NOT NULL,
        is_system_role INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code)`,
      `CREATE INDEX IF NOT EXISTS idx_roles_level ON roles(level)`,

      // Permissions Table
      `CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        role_id TEXT NOT NULL,
        resource TEXT NOT NULL,
        action TEXT NOT NULL,
        scope TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role_id)`,
      `CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource)`,

      // Employees Table
      `CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        employee_code TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        branch_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        manager_id TEXT,
        position TEXT,
        department TEXT,
        employment_type TEXT NOT NULL,
        employment_status TEXT NOT NULL DEFAULT 'Active',
        hire_date TEXT NOT NULL,
        termination_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id),
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (manager_id) REFERENCES employees(id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_branch ON employees(branch_id)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role_id)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status)`,
      `CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department)`,

      // Client Users Table
      `CREATE TABLE IF NOT EXISTS client_users (
        id TEXT PRIMARY KEY,
        user_code TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        date_of_birth TEXT,
        branch_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        kyc_status TEXT NOT NULL DEFAULT 'Pending',
        document_type TEXT,
        document_number TEXT,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        country_id TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        last_login_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id),
        FOREIGN KEY (country_id) REFERENCES countries(id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_code ON client_users(user_code)`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_email ON client_users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_branch ON client_users(branch_id)`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_status ON client_users(status)`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_kyc ON client_users(kyc_status)`,
      `CREATE INDEX IF NOT EXISTS idx_client_users_country ON client_users(country_id)`,

      // Employee Transfer History Table
      `CREATE TABLE IF NOT EXISTS employee_transfer_history (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        from_branch_id TEXT NOT NULL,
        to_branch_id TEXT NOT NULL,
        effective_date TEXT NOT NULL,
        reason TEXT,
        approved_by TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (from_branch_id) REFERENCES branches(id),
        FOREIGN KEY (to_branch_id) REFERENCES branches(id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_transfer_history_employee ON employee_transfer_history(employee_id)`,
      `CREATE INDEX IF NOT EXISTS idx_transfer_history_date ON employee_transfer_history(effective_date)`,

      // Audit Log Table
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        performed_by TEXT NOT NULL,
        changes TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_performer ON audit_logs(performed_by)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp)`
    ];

    // Execute each statement separately
    for (const statement of statements) {
      await this.run(statement);
    }
  }

  /**
   * Execute SQL query
   */
  run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Get single row
   */
  get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  /**
   * Get all rows
   */
  all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  /**
   * Close database connection
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Singleton instance
let dbInstance: DatabaseManager | null = null;

export const getDatabase = (): DatabaseManager => {
  if (!dbInstance) {
    const dbPath = process.env.DATABASE_PATH || './data/organization.db';
    dbInstance = new DatabaseManager(dbPath);
  }
  return dbInstance;
};

export default DatabaseManager;

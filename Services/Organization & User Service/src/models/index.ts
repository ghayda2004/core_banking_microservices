/**
 * Organization & User Service - Data Models
 * 
 * This file contains all TypeScript interfaces and types for the service
 */

// ==================== COUNTRY ====================

export interface Country {
  id: string;
  code: string;                    // ISO 3166-1 alpha-3 (e.g., TUN, FRA, USA)
  name: string;
  currencyCode: string;            // ISO 4217 (e.g., TND, EUR, USD)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCountryRequest {
  code: string;
  name: string;
  currencyCode: string;
}

export interface UpdateCountryRequest {
  name?: string;
  currencyCode?: string;
  isActive?: boolean;
}

// ==================== REGION ====================

export interface Region {
  id: string;
  countryId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegionWithCountry extends Region {
  country: Country;
}

export interface CreateRegionRequest {
  countryId: string;
  code: string;
  name: string;
}

export interface UpdateRegionRequest {
  name?: string;
  isActive?: boolean;
}

// ==================== BRANCH ====================

export interface Branch {
  id: string;
  regionId: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  branchType: BranchType;
  isActive: boolean;
  openingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BranchType = 'Main' | 'Sub-branch' | 'Agency' | 'ATM Center' | 'Digital Branch';

export interface BranchWithDetails extends Branch {
  region: Region;
  country: Country;
  employeeCount?: number;
  clientCount?: number;
}

export interface CreateBranchRequest {
  regionId: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  branchType: BranchType;
  openingDate?: Date;
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  branchType?: BranchType;
  isActive?: boolean;
}

// ==================== ROLE ====================

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  level: number;                   // Hierarchy level (1 = highest, like CEO)
  isSystemRole: boolean;           // Cannot be deleted if true
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  level: number;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  level?: number;
}

// ==================== PERMISSION ====================

export interface Permission {
  id: string;
  roleId: string;
  resource: string;                // e.g., 'accounts', 'transactions', 'users', 'loans'
  action: PermissionAction;
  scope: PermissionScope;
  createdAt: Date;
}

export type PermissionAction = 'read' | 'write' | 'approve' | 'delete' | 'admin';
export type PermissionScope = 'own' | 'branch' | 'region' | 'country' | 'all';

export interface CreatePermissionRequest {
  roleId: string;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export interface AssignPermissionsRequest {
  permissions: Array<{
    resource: string;
    action: PermissionAction;
    scope: PermissionScope;
  }>;
}

// ==================== EMPLOYEE ====================

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  branchId: string;
  roleId: string;
  managerId?: string;              // Self-referencing for hierarchy
  position?: string;
  department?: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  hireDate: Date;
  terminationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Intern';
export type EmploymentStatus = 'Active' | 'Suspended' | 'Terminated' | 'On-Leave' | 'Probation';

export interface EmployeeWithDetails extends Employee {
  branch: Branch;
  role: Role;
  manager?: EmployeeBasic;
  country?: Country;
  region?: Region;
}

export interface EmployeeBasic {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  branchId: string;
  roleId: string;
  managerId?: string;
  position?: string;
  department?: string;
  employmentType: EmploymentType;
  hireDate: Date;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  employmentType?: EmploymentType;
  employmentStatus?: EmploymentStatus;
}

export interface TransferEmployeeRequest {
  newBranchId: string;
  effectiveDate: Date;
  reason?: string;
}

export interface EmployeeHierarchy {
  employee: EmployeeWithDetails;
  manager?: EmployeeWithDetails;
  subordinates: EmployeeWithDetails[];
  subordinateCount: number;
}

// ==================== CLIENT USER ====================

export interface ClientUser {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  branchId: string;                // Home branch
  status: ClientUserStatus;
  kycStatus: KYCStatus;
  documentType?: string;           // CIN, Passport, etc.
  documentNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  countryId: string;
  registrationDate: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientUserStatus = 'Active' | 'Suspended' | 'Blocked' | 'Pending' | 'Inactive';
export type KYCStatus = 'Pending' | 'Verified' | 'Rejected' | 'Incomplete' | 'Expired';

export interface ClientUserWithDetails extends ClientUser {
  branch: Branch;
  country: Country;
  region?: Region;
}

export interface CreateClientUserRequest {
  userCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  branchId: string;
  documentType?: string;
  documentNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  countryId: string;
}

export interface UpdateClientUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface UpdateClientUserStatusRequest {
  status: ClientUserStatus;
  reason?: string;
  updatedBy?: string;
}

export interface UpdateKYCStatusRequest {
  kycStatus: KYCStatus;
  verifiedBy?: string;
  notes?: string;
}

// ==================== ORGANIZATION CHART ====================

export interface OrganizationChart {
  branch: BranchWithDetails;
  manager?: EmployeeWithDetails;
  departments: DepartmentStructure[];
  totalEmployees: number;
}

export interface DepartmentStructure {
  department: string;
  manager?: EmployeeWithDetails;
  employees: EmployeeWithDetails[];
  employeeCount: number;
}

export interface ReportingStructure {
  employee: EmployeeWithDetails;
  directManager?: EmployeeWithDetails;
  managementChain: EmployeeBasic[];      // From direct manager to top
  directReports: EmployeeBasic[];        // Employees reporting to this employee
  indirectReportsCount: number;          // Total subordinates at all levels
}

// ==================== STATISTICS & METRICS ====================

export interface OrganizationMetrics {
  totalCountries: number;
  totalRegions: number;
  totalBranches: number;
  totalEmployees: number;
  totalClientUsers: number;
  activeEmployees: number;
  activeClientUsers: number;
  activeBranches: number;
  employeesByStatus: Record<EmploymentStatus, number>;
  clientsByStatus: Record<ClientUserStatus, number>;
  employeesByBranch: Array<{
    branchId: string;
    branchName: string;
    count: number;
  }>;
}

export interface BranchStatistics {
  branchId: string;
  branchName: string;
  employeeCount: number;
  clientCount: number;
  activeEmployees: number;
  activeClients: number;
  departmentCounts: Record<string, number>;
  avgEmployeeTenure: number;         // In months
}

// ==================== QUERY FILTERS ====================

export interface EmployeeFilter {
  branchId?: string;
  roleId?: string;
  department?: string;
  employmentStatus?: EmploymentStatus;
  managerId?: string;
  search?: string;                   // Search by name or email
}

export interface ClientUserFilter {
  branchId?: string;
  status?: ClientUserStatus;
  kycStatus?: KYCStatus;
  countryId?: string;
  search?: string;
}

export interface BranchFilter {
  regionId?: string;
  countryId?: string;
  branchType?: BranchType;
  isActive?: boolean;
}

// ==================== AUDIT & HISTORY ====================

export interface AuditLog {
  id: string;
  entityType: string;               // 'employee', 'branch', 'role', etc.
  entityId: string;
  action: string;                   // 'create', 'update', 'delete', 'transfer'
  performedBy: string;              // Employee ID who performed the action
  changes?: any;                    // JSON object of what changed
  timestamp: Date;
}

export interface EmployeeTransferHistory {
  id: string;
  employeeId: string;
  fromBranchId: string;
  toBranchId: string;
  effectiveDate: Date;
  reason?: string;
  approvedBy?: string;
  createdAt: Date;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  version: string;
  timestamp: Date;
  database: 'connected' | 'disconnected';
  dependencies?: Record<string, string>;
}

// ==================== VALIDATION RULES ====================

export const ValidationRules = {
  employee: {
    employeeCodePattern: /^EMP-\d{4,6}$/,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^\+?[\d\s\-()]+$/,
  },
  user: {
    userCodePattern: /^USR-\d{6,8}$/,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^\+?[\d\s\-()]+$/,
  },
  branch: {
    codePattern: /^BR-[A-Z0-9\-]+$/,
  },
  region: {
    codePattern: /^RG-[A-Z0-9\-]+$/,
  },
  country: {
    codePattern: /^[A-Z]{3}$/,        // ISO 3166-1 alpha-3
  },
};

// ==================== PREDEFINED SYSTEM ROLES ====================

export const SystemRoles = {
  SYSTEM_ADMIN: {
    code: 'SYSTEM_ADMIN',
    name: 'System Administrator',
    description: 'Full system access and control',
    level: 1,
  },
  CEO: {
    code: 'CEO',
    name: 'Chief Executive Officer',
    description: 'Top executive with full organizational authority',
    level: 1,
  },
  REGIONAL_MANAGER: {
    code: 'REGIONAL_MANAGER',
    name: 'Regional Manager',
    description: 'Manages multiple branches in a region',
    level: 2,
  },
  BRANCH_MANAGER: {
    code: 'BRANCH_MANAGER',
    name: 'Branch Manager',
    description: 'Manages branch operations and staff',
    level: 3,
  },
  OPERATIONS_MANAGER: {
    code: 'OPERATIONS_MANAGER',
    name: 'Operations Manager',
    description: 'Oversees daily operations at branch level',
    level: 4,
  },
  CUSTOMER_SERVICE_MANAGER: {
    code: 'CS_MANAGER',
    name: 'Customer Service Manager',
    description: 'Manages customer service team',
    level: 4,
  },
  LOAN_OFFICER: {
    code: 'LOAN_OFFICER',
    name: 'Loan Officer',
    description: 'Handles loan applications and approvals',
    level: 5,
  },
  TELLER: {
    code: 'TELLER',
    name: 'Bank Teller',
    description: 'Handles customer transactions',
    level: 6,
  },
  CUSTOMER_SERVICE_REP: {
    code: 'CSR',
    name: 'Customer Service Representative',
    description: 'Assists customers with inquiries',
    level: 6,
  },
  COMPLIANCE_OFFICER: {
    code: 'COMPLIANCE_OFFICER',
    name: 'Compliance Officer',
    description: 'Ensures regulatory compliance',
    level: 4,
  },
  AUDITOR: {
    code: 'AUDITOR',
    name: 'Internal Auditor',
    description: 'Conducts internal audits',
    level: 3,
  },
  HR_MANAGER: {
    code: 'HR_MANAGER',
    name: 'HR Manager',
    description: 'Manages human resources',
    level: 3,
  },
};

// ==================== PREDEFINED PERMISSIONS ====================

export const SystemPermissions = {
  ACCOUNTS: {
    READ_ALL: { resource: 'accounts', action: 'read' as PermissionAction, scope: 'all' as PermissionScope },
    READ_BRANCH: { resource: 'accounts', action: 'read' as PermissionAction, scope: 'branch' as PermissionScope },
    WRITE_BRANCH: { resource: 'accounts', action: 'write' as PermissionAction, scope: 'branch' as PermissionScope },
    APPROVE_BRANCH: { resource: 'accounts', action: 'approve' as PermissionAction, scope: 'branch' as PermissionScope },
  },
  TRANSACTIONS: {
    READ_ALL: { resource: 'transactions', action: 'read' as PermissionAction, scope: 'all' as PermissionScope },
    READ_BRANCH: { resource: 'transactions', action: 'read' as PermissionAction, scope: 'branch' as PermissionScope },
    WRITE_BRANCH: { resource: 'transactions', action: 'write' as PermissionAction, scope: 'branch' as PermissionScope },
    APPROVE_BRANCH: { resource: 'transactions', action: 'approve' as PermissionAction, scope: 'branch' as PermissionScope },
  },
  CUSTOMERS: {
    READ_ALL: { resource: 'customers', action: 'read' as PermissionAction, scope: 'all' as PermissionScope },
    READ_BRANCH: { resource: 'customers', action: 'read' as PermissionAction, scope: 'branch' as PermissionScope },
    WRITE_BRANCH: { resource: 'customers', action: 'write' as PermissionAction, scope: 'branch' as PermissionScope },
  },
  EMPLOYEES: {
    READ_ALL: { resource: 'employees', action: 'read' as PermissionAction, scope: 'all' as PermissionScope },
    READ_REGION: { resource: 'employees', action: 'read' as PermissionAction, scope: 'region' as PermissionScope },
    READ_BRANCH: { resource: 'employees', action: 'read' as PermissionAction, scope: 'branch' as PermissionScope },
    WRITE_ALL: { resource: 'employees', action: 'write' as PermissionAction, scope: 'all' as PermissionScope },
    WRITE_BRANCH: { resource: 'employees', action: 'write' as PermissionAction, scope: 'branch' as PermissionScope },
  },
  ORGANIZATION: {
    ADMIN_ALL: { resource: 'organization', action: 'admin' as PermissionAction, scope: 'all' as PermissionScope },
    READ_ALL: { resource: 'organization', action: 'read' as PermissionAction, scope: 'all' as PermissionScope },
    WRITE_ALL: { resource: 'organization', action: 'write' as PermissionAction, scope: 'all' as PermissionScope },
  },
};

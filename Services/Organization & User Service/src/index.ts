import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { getDatabase } from './database';
import {
  Country, Region, Branch, Role, Permission, Employee, ClientUser,
  CreateCountryRequest, CreateRegionRequest, CreateBranchRequest,
  CreateRoleRequest, CreateEmployeeRequest, CreateClientUserRequest,
  AssignPermissionsRequest, TransferEmployeeRequest,
  UpdateClientUserStatusRequest, UpdateKYCStatusRequest,
  HealthCheckResponse, OrganizationMetrics,
  SystemRoles, SystemPermissions
} from './models';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database instance
const db = getDatabase();

// ============ AUTHENTICATION MIDDLEWARE ============

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token invalide' });
  }
};

const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin' && req.user.role !== 'banker') {
    return res.status(403).json({ success: false, error: 'Accès réservé aux administrateurs' });
  }
  next();
};

// ============ COUNTRY ROUTES ============

// Get all countries
app.get('/api/organization/countries', authMiddleware, async (req: Request, res: Response) => {
  try {
    const countries = await db.all<Country>(
      'SELECT * FROM countries ORDER BY name'
    );
    res.json({ success: true, data: countries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get country by ID
app.get('/api/organization/countries/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const country = await db.get<Country>(
      'SELECT * FROM countries WHERE id = ?',
      [req.params.id]
    );
    
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    
    res.json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create country
app.post('/api/organization/countries', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { code, name, currencyCode }: CreateCountryRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO countries (id, code, name, currency_code, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [id, code.toUpperCase(), name, currencyCode.toUpperCase(), now, now]
    );
    
    const country = await db.get<Country>('SELECT * FROM countries WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update country
app.put('/api/organization/countries/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, currencyCode, isActive } = req.body;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (currencyCode) {
      updates.push('currency_code = ?');
      params.push(currencyCode.toUpperCase());
    }
    if (typeof isActive === 'boolean') {
      updates.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(req.params.id);
    
    await db.run(
      `UPDATE countries SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    const country = await db.get<Country>('SELECT * FROM countries WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ REGION ROUTES ============

// Get all regions
app.get('/api/organization/regions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { countryId } = req.query;
    
    let sql = `
      SELECT r.*, c.name as country_name, c.code as country_code
      FROM regions r
      LEFT JOIN countries c ON r.country_id = c.id
    `;
    const params: any[] = [];
    
    if (countryId) {
      sql += ' WHERE r.country_id = ?';
      params.push(countryId);
    }
    
    sql += ' ORDER BY r.name';
    
    const regions = await db.all<any>(sql, params);
    res.json({ success: true, data: regions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create region
app.post('/api/organization/regions', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { countryId, code, name }: CreateRegionRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO regions (id, country_id, code, name, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [id, countryId, code, name, now, now]
    );
    
    const region = await db.get<Region>('SELECT * FROM regions WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: region });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ BRANCH ROUTES ============

// Get all branches
app.get('/api/organization/branches', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { regionId, countryId } = req.query;
    
    let sql = `
      SELECT b.*, r.name as region_name, c.name as country_name
      FROM branches b
      LEFT JOIN regions r ON b.region_id = r.id
      LEFT JOIN countries c ON r.country_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (regionId) {
      sql += ' AND b.region_id = ?';
      params.push(regionId);
    }
    if (countryId) {
      sql += ' AND r.country_id = ?';
      params.push(countryId);
    }
    
    sql += ' ORDER BY b.name';
    
    const branches = await db.all<any>(sql, params);
    res.json({ success: true, data: branches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get branch by ID
app.get('/api/organization/branches/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const branch = await db.get<any>(
      `SELECT b.*, r.name as region_name, r.code as region_code, 
              c.name as country_name, c.code as country_code
       FROM branches b
       LEFT JOIN regions r ON b.region_id = r.id
       LEFT JOIN countries c ON r.country_id = c.id
       WHERE b.id = ?`,
      [req.params.id]
    );
    
    if (!branch) {
      return res.status(404).json({ success: false, error: 'Branch not found' });
    }
    
    // Get employee count
    const empCount = await db.get<any>(
      'SELECT COUNT(*) as count FROM employees WHERE branch_id = ? AND employment_status = "Active"',
      [req.params.id]
    );
    
    // Get client count
    const clientCount = await db.get<any>(
      'SELECT COUNT(*) as count FROM client_users WHERE branch_id = ? AND status = "Active"',
      [req.params.id]
    );
    
    branch.employeeCount = empCount?.count || 0;
    branch.clientCount = clientCount?.count || 0;
    
    res.json({ success: true, data: branch });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create branch
app.post('/api/organization/branches', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const data: CreateBranchRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO branches (id, region_id, code, name, address, city, postal_code, 
                             phone, email, branch_type, is_active, opening_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [id, data.regionId, data.code, data.name, data.address, data.city, data.postalCode,
       data.phone, data.email, data.branchType, data.openingDate, now, now]
    );
    
    const branch = await db.get<Branch>('SELECT * FROM branches WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: branch });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update branch
app.put('/api/organization/branches/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, address, city, postalCode, phone, email, branchType, isActive } = req.body;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address);
    }
    if (city) {
      updates.push('city = ?');
      params.push(city);
    }
    if (postalCode) {
      updates.push('postal_code = ?');
      params.push(postalCode);
    }
    if (phone) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (branchType) {
      updates.push('branch_type = ?');
      params.push(branchType);
    }
    if (typeof isActive === 'boolean') {
      updates.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(req.params.id);
    
    await db.run(
      `UPDATE branches SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    const branch = await db.get<Branch>('SELECT * FROM branches WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: branch });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ ROLE ROUTES ============

// Get all roles
app.get('/api/organization/roles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const roles = await db.all<Role>(
      'SELECT * FROM roles ORDER BY level, name'
    );
    
    // Get permissions for each role
    for (const role of roles) {
      const permissions = await db.all<Permission>(
        'SELECT * FROM permissions WHERE role_id = ?',
        [role.id]
      );
      (role as any).permissions = permissions;
    }
    
    res.json({ success: true, data: roles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create role
app.post('/api/organization/roles', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { code, name, description, level }: CreateRoleRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO roles (id, code, name, description, level, is_system_role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      [id, code, name, description, level, now, now]
    );
    
    const role = await db.get<Role>('SELECT * FROM roles WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign permissions to role
app.post('/api/organization/roles/:id/permissions', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { permissions }: AssignPermissionsRequest = req.body;
    const roleId = req.params.id;
    
    // Delete existing permissions
    await db.run('DELETE FROM permissions WHERE role_id = ?', [roleId]);
    
    // Add new permissions
    for (const perm of permissions) {
      const id = uuid();
      await db.run(
        `INSERT INTO permissions (id, role_id, resource, action, scope, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, roleId, perm.resource, perm.action, perm.scope, new Date().toISOString()]
      );
    }
    
    const updatedPermissions = await db.all<Permission>(
      'SELECT * FROM permissions WHERE role_id = ?',
      [roleId]
    );
    
    res.json({ success: true, data: updatedPermissions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ EMPLOYEE ROUTES ============

// Get all employees
app.get('/api/organization/employees', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { branchId, roleId, department, status, search } = req.query;
    
    let sql = `
      SELECT e.*, b.name as branch_name, r.name as role_name,
             m.first_name || ' ' || m.last_name as manager_name
      FROM employees e
      LEFT JOIN branches b ON e.branch_id = b.id
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (branchId) {
      sql += ' AND e.branch_id = ?';
      params.push(branchId);
    }
    if (roleId) {
      sql += ' AND e.role_id = ?';
      params.push(roleId);
    }
    if (department) {
      sql += ' AND e.department = ?';
      params.push(department);
    }
    if (status) {
      sql += ' AND e.employment_status = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ' ORDER BY e.last_name, e.first_name';
    
    const employees = await db.all<any>(sql, params);
    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get employee by ID
app.get('/api/organization/employees/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employee = await db.get<any>(
      `SELECT e.*, b.name as branch_name, b.code as branch_code,
              r.name as role_name, r.code as role_code, r.level as role_level,
              m.first_name || ' ' || m.last_name as manager_name,
              m.employee_code as manager_code, m.email as manager_email
       FROM employees e
       LEFT JOIN branches b ON e.branch_id = b.id
       LEFT JOIN roles r ON e.role_id = r.id
       LEFT JOIN employees m ON e.manager_id = m.id
       WHERE e.id = ?`,
      [req.params.id]
    );
    
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create employee
app.post('/api/organization/employees', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const data: CreateEmployeeRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO employees (id, employee_code, first_name, last_name, email, phone,
                              branch_id, role_id, manager_id, position, department,
                              employment_type, employment_status, hire_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, ?)`,
      [id, data.employeeCode, data.firstName, data.lastName, data.email, data.phone,
       data.branchId, data.roleId, data.managerId, data.position, data.department,
       data.employmentType, data.hireDate, now, now]
    );
    
    const employee = await db.get<Employee>('SELECT * FROM employees WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update employee
app.put('/api/organization/employees/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, position, department, employmentType, employmentStatus } = req.body;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (firstName) {
      updates.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName) {
      updates.push('last_name = ?');
      params.push(lastName);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (position !== undefined) {
      updates.push('position = ?');
      params.push(position);
    }
    if (department !== undefined) {
      updates.push('department = ?');
      params.push(department);
    }
    if (employmentType) {
      updates.push('employment_type = ?');
      params.push(employmentType);
    }
    if (employmentStatus) {
      updates.push('employment_status = ?');
      params.push(employmentStatus);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(req.params.id);
    
    await db.run(
      `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    const employee = await db.get<Employee>('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Transfer employee
app.post('/api/organization/employees/:id/transfer', authMiddleware, adminMiddleware, async (req: any, res: Response) => {
  try {
    const { newBranchId, effectiveDate, reason }: TransferEmployeeRequest = req.body;
    const employeeId = req.params.id;
    
    // Get current branch
    const employee = await db.get<Employee>('SELECT * FROM employees WHERE id = ?', [employeeId]);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    const oldBranchId = employee.branchId;
    
    // Update employee branch
    await db.run(
      'UPDATE employees SET branch_id = ?, updated_at = ? WHERE id = ?',
      [newBranchId, new Date().toISOString(), employeeId]
    );
    
    // Record transfer history
    const historyId = uuid();
    await db.run(
      `INSERT INTO employee_transfer_history (id, employee_id, from_branch_id, to_branch_id, 
                                               effective_date, reason, approved_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [historyId, employeeId, oldBranchId, newBranchId, effectiveDate, reason, 
       req.user.userId, new Date().toISOString()]
    );
    
    const updatedEmployee = await db.get<Employee>('SELECT * FROM employees WHERE id = ?', [employeeId]);
    res.json({ 
      success: true, 
      data: updatedEmployee,
      message: 'Employee transferred successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get employee hierarchy
app.get('/api/organization/employees/:id/hierarchy', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;
    
    // Get employee
    const employee = await db.get<any>(
      `SELECT e.*, b.name as branch_name, r.name as role_name
       FROM employees e
       LEFT JOIN branches b ON e.branch_id = b.id
       LEFT JOIN roles r ON e.role_id = r.id
       WHERE e.id = ?`,
      [employeeId]
    );
    
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    // Get manager
    let manager = null;
    if (employee.manager_id) {
      manager = await db.get<any>(
        `SELECT e.*, b.name as branch_name, r.name as role_name
         FROM employees e
         LEFT JOIN branches b ON e.branch_id = b.id
         LEFT JOIN roles r ON e.role_id = r.id
         WHERE e.id = ?`,
        [employee.manager_id]
      );
    }
    
    // Get subordinates
    const subordinates = await db.all<any>(
      `SELECT e.*, b.name as branch_name, r.name as role_name
       FROM employees e
       LEFT JOIN branches b ON e.branch_id = b.id
       LEFT JOIN roles r ON e.role_id = r.id
       WHERE e.manager_id = ? AND e.employment_status = 'Active'`,
      [employeeId]
    );
    
    res.json({
      success: true,
      data: {
        employee,
        manager,
        subordinates,
        subordinateCount: subordinates.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CLIENT USER ROUTES ============

// Get all client users
app.get('/api/organization/users', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { branchId, status, kycStatus, search } = req.query;
    
    let sql = `
      SELECT u.*, b.name as branch_name, c.name as country_name
      FROM client_users u
      LEFT JOIN branches b ON u.branch_id = b.id
      LEFT JOIN countries c ON u.country_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (branchId) {
      sql += ' AND u.branch_id = ?';
      params.push(branchId);
    }
    if (status) {
      sql += ' AND u.status = ?';
      params.push(status);
    }
    if (kycStatus) {
      sql += ' AND u.kyc_status = ?';
      params.push(kycStatus);
    }
    if (search) {
      sql += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ' ORDER BY u.created_at DESC';
    
    const users = await db.all<any>(sql, params);
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get client user by ID
app.get('/api/organization/users/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await db.get<any>(
      `SELECT u.*, b.name as branch_name, b.code as branch_code,
              c.name as country_name, c.code as country_code
       FROM client_users u
       LEFT JOIN branches b ON u.branch_id = b.id
       LEFT JOIN countries c ON u.country_id = c.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create client user
app.post('/api/organization/users', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data: CreateClientUserRequest = req.body;
    
    const id = uuid();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO client_users (id, user_code, first_name, last_name, email, phone,
                                  date_of_birth, branch_id, status, kyc_status, document_type,
                                  document_number, address, city, postal_code, country_id,
                                  registration_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.userCode, data.firstName, data.lastName, data.email, data.phone,
       data.dateOfBirth, data.branchId, data.documentType, data.documentNumber,
       data.address, data.city, data.postalCode, data.countryId, now, now, now]
    );
    
    const user = await db.get<ClientUser>('SELECT * FROM client_users WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update client user status
app.patch('/api/organization/users/:id/status', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, reason }: UpdateClientUserStatusRequest = req.body;
    
    await db.run(
      'UPDATE client_users SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date().toISOString(), req.params.id]
    );
    
    const user = await db.get<ClientUser>('SELECT * FROM client_users WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: user, message: `User status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update KYC status
app.patch('/api/organization/users/:id/kyc', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { kycStatus, verifiedBy, notes }: UpdateKYCStatusRequest = req.body;
    
    await db.run(
      'UPDATE client_users SET kyc_status = ?, updated_at = ? WHERE id = ?',
      [kycStatus, new Date().toISOString(), req.params.id]
    );
    
    const user = await db.get<ClientUser>('SELECT * FROM client_users WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: user, message: `KYC status updated to ${kycStatus}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ ORGANIZATION METRICS ============

app.get('/api/organization/metrics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const totalCountries = await db.get<any>('SELECT COUNT(*) as count FROM countries');
    const totalRegions = await db.get<any>('SELECT COUNT(*) as count FROM regions');
    const totalBranches = await db.get<any>('SELECT COUNT(*) as count FROM branches');
    const totalEmployees = await db.get<any>('SELECT COUNT(*) as count FROM employees');
    const totalClientUsers = await db.get<any>('SELECT COUNT(*) as count FROM client_users');
    const activeEmployees = await db.get<any>(
      'SELECT COUNT(*) as count FROM employees WHERE employment_status = "Active"'
    );
    const activeClientUsers = await db.get<any>(
      'SELECT COUNT(*) as count FROM client_users WHERE status = "Active"'
    );
    const activeBranches = await db.get<any>(
      'SELECT COUNT(*) as count FROM branches WHERE is_active = 1'
    );
    
    const metrics: OrganizationMetrics = {
      totalCountries: totalCountries?.count || 0,
      totalRegions: totalRegions?.count || 0,
      totalBranches: totalBranches?.count || 0,
      totalEmployees: totalEmployees?.count || 0,
      totalClientUsers: totalClientUsers?.count || 0,
      activeEmployees: activeEmployees?.count || 0,
      activeClientUsers: activeClientUsers?.count || 0,
      activeBranches: activeBranches?.count || 0,
      employeesByStatus: {} as any,
      clientsByStatus: {} as any,
      employeesByBranch: []
    };
    
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/organization/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await db.get('SELECT 1');
    
    const response: HealthCheckResponse = {
      status: 'healthy',
      service: 'Organization & User Service',
      version: '1.0.0',
      timestamp: new Date(),
      database: 'connected',
      dependencies: {
        iam: 'not-implemented'
      }
    };
    
    res.json(response);
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'Organization & User Service',
      version: '1.0.0',
      timestamp: new Date(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// ============ SEED DATA (Development Only) ============

async function seedDatabase() {
  try {
    // Check if data already exists
    const countryCount = await db.get<any>('SELECT COUNT(*) as count FROM countries');
    if (countryCount && countryCount.count > 0) {
      console.log('✅ Database already seeded');
      return;
    }
    
    console.log('🌱 Seeding database with initial data...');
    
    // Create Tunisia
    const tunisiaId = uuid();
    await db.run(
      `INSERT INTO countries (id, code, name, currency_code, is_active, created_at, updated_at)
       VALUES (?, 'TUN', 'Tunisia', 'TND', 1, ?, ?)`,
      [tunisiaId, new Date().toISOString(), new Date().toISOString()]
    );
    
    // Create Tunis Region
    const tunisRegionId = uuid();
    await db.run(
      `INSERT INTO regions (id, country_id, code, name, is_active, created_at, updated_at)
       VALUES (?, ?, 'RG-TUNIS', 'Tunis Centre', 1, ?, ?)`,
      [tunisRegionId, tunisiaId, new Date().toISOString(), new Date().toISOString()]
    );
    
    // Create Main Branch
    const mainBranchId = uuid();
    await db.run(
      `INSERT INTO branches (id, region_id, code, name, address, city, postal_code, 
                             phone, email, branch_type, is_active, opening_date, created_at, updated_at)
       VALUES (?, ?, 'BR-TUNIS-001', 'Tunis Main Branch', 'Avenue Habib Bourguiba', 
               'Tunis', '1000', '+216 71 123 456', 'tunis.main@bank.com', 'Main', 1, ?, ?, ?)`,
      [mainBranchId, tunisRegionId, '2020-01-01', new Date().toISOString(), new Date().toISOString()]
    );
    
    // Create System Roles
    for (const [key, roleData] of Object.entries(SystemRoles)) {
      const roleId = uuid();
      await db.run(
        `INSERT INTO roles (id, code, name, description, level, is_system_role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        [roleId, roleData.code, roleData.name, roleData.description, roleData.level,
         new Date().toISOString(), new Date().toISOString()]
      );
      
      // Add permissions based on role
      if (roleData.code === 'SYSTEM_ADMIN') {
        const permId = uuid();
        await db.run(
          `INSERT INTO permissions (id, role_id, resource, action, scope, created_at)
           VALUES (?, ?, 'organization', 'admin', 'all', ?)`,
          [permId, roleId, new Date().toISOString()]
        );
      }
    }
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// ============ START SERVER ============

const startServer = async () => {
  try {
    // Initialize database
    await db.initialize();
    
    // Seed initial data
    await seedDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         ORGANIZATION & USER SERVICE                        ║
║                  v1.0.0                                    ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 Health Check: http://localhost:${PORT}/api/organization/health
📊 Metrics: http://localhost:${PORT}/api/organization/metrics

Features:
- Bank Structure Management (Countries, Regions, Branches)
- Employee Management
- Role & Permission System
- Digital Banking Users
- Internal Hierarchy

Database: SQLite (${process.env.DATABASE_PATH || './data/organization.db'})
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

# Quick Start Guide - 3D Manager Dashboard

## 🚀 Getting Started

### 1. Database Setup
```bash
mysql -u root -p
# Enter your MySQL password
mysql> source database.sql
```

Or:
```bash
mysql -u root -p < database.sql
```

### 2. Start Backend Server
```bash
npm run server
```
Backend runs on `http://localhost:3000`

### 3. Start Frontend (in another terminal)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📋 What's Working

### ✅ Fully Integrated Pages
- **Login/Register** - JWT authentication with role-based access
- **Dashboard** - Real-time statistics from database
- **Entradas (Entries)** - XML invoice import, product creation
- **Saídas (Exits)** - Product exits tracking
- **Histórico (History)** - Complete audit trail
- **Customers** - Customer management with delete functionality

### ⚙️ Backend API Endpoints (All Working)
- `/api/auth/*` - Authentication
- `/api/customers/*` - Customer CRUD
- `/api/products/*` - Product/Inventory CRUD
- `/api/entries/*` - Entry operations
- `/api/exits/*` - Exit operations
- `/api/deliveries/*` - Delivery routes & trucks
- `/api/users/*` - User management
- `/api/dashboard/*` - Dashboard stats
- `/api/history/*` - Audit trail

## 🔧 Configuration

### Database Connection
File: `/server/config/database.js`
```javascript
{
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: '3d_manager',
  port: '3306'
}
```

### API Base URL
File: `/src/services/api.ts`
```typescript
const API_URL = 'http://localhost:3000/api';
```

## 👥 User Roles

1. **Admin** - Full system access
2. **Manager** - Manage operations
3. **Operator** - Basic operations

## 📊 Database Tables

### Core Tables
- `users` - Dashboard users (admin, manager, operator)
- `customers` - Customer information
- `products` - Product inventory
- `entries` - Cattle/meat entries (XML imports)
- `entry_products` - Products in each entry
- `exits` - Product exits/sales
- `history` - Audit trail

### Delivery Tables
- `delivery_trucks` - Fleet management
- `delivery_routes` - Delivery planning
- `delivery_route_stops` - Route stops
- `delivery_items` - Items per stop

## 🎯 Testing the System

### 1. Create a Test User
```sql
INSERT INTO users (name, email, password, role, status)
VALUES ('Admin User', 'admin@example.com', '$2a$10$..hashed..', 'admin', 'active');
```
Or register through the UI.

### 2. Add Test Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Customer",
    "document": "12345678900",
    "email": "test@example.com",
    "phone": "(51) 99999-9999",
    "address": "Rua Teste, 123",
    "city": "Porto Alegre",
    "state": "RS"
  }'
```

### 3. Import XML Invoice
Use the Entradas page to upload an XML file.

### 4. View Dashboard Stats
Navigate to Dashboard to see real-time statistics.

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend validates credentials
3. JWT token issued with user role
4. Token stored in localStorage
5. All API requests include token in Authorization header
6. Backend middleware validates token on protected routes

## 📝 API Request Example

```typescript
// Example: Fetch customers
const response = await fetch('http://localhost:3000/api/customers', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const customers = await response.json();
```

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check port 3000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check CORS is enabled in `/server/index.js`
- Verify API_URL in `/src/services/api.ts`

### Database connection errors
- Update credentials in `/server/config/database.js`
- Ensure MySQL user has proper permissions

### Authentication errors
- Clear localStorage: `localStorage.clear()`
- Re-login to get fresh token
- Check token hasn't expired (24h default)

## 📱 Pages Navigation

```
/login          - Login page
/register       - User registration
/dashboard      - System overview
/entries        - Cattle invoices (XML import)
/exits          - Product exits/sales
/customers      - Customer management
/inventory      - Product inventory
/deliveries     - Delivery routes
/users          - User management
/history        - Audit trail
/settings       - System settings
```

## 🎨 UI Components

All pages use reusable components from `/src/components/common/`:
- `<Button>` - Styled buttons with variants
- `<Card>` - Container component
- `<Table>` - Data table with sorting
- `<SearchBar>` - Search input
- `<PageHeader>` - Page title/actions
- `<StatCard>` - Statistics display

## 🚧 Remaining Integration Tasks

To complete the integration:

1. **Update Inventory Page**
   ```typescript
   // In /src/pages/Inventory/Inventory.tsx
   import { fetchInventory } from '../../services/inventoryService';
   const data = await fetchInventory();
   ```

2. **Update Deliveries Page**
   ```typescript
   // In /src/pages/Deliveries/Deliveries.tsx
   import { fetchDeliveries } from '../../services/deliveryService';
   const data = await fetchDeliveries();
   ```

3. **Update Users Page**
   ```typescript
   // In /src/pages/Users/Users.tsx
   import { fetchUsers } from '../../services/userService';
   const data = await fetchUsers();
   ```

4. **Add Create/Edit Modals**
   - Copy pattern from existing pages
   - Use services for API calls

## 📦 Production Deployment

1. Build frontend: `npm run build`
2. Serve static files from `/dist`
3. Update API_URL for production
4. Use environment variables for secrets
5. Enable HTTPS
6. Configure MySQL for production

## 🎉 Success!

Your full-stack cattle/meat management dashboard is now integrated and operational!

For questions or issues, refer to:
- `INTEGRATION_SUMMARY.md` - Detailed technical documentation
- `DASHBOARD_STRUCTURE.md` - Project architecture

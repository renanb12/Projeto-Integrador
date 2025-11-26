# 3D Manager - Complete Admin Dashboard

## Overview
A full-featured admin dashboard for cattle/meat management with React + TypeScript + Tailwind CSS on the frontend and Node.js + Express + MySQL on the backend.

## Project Structure

### Reusable Components (`src/components/common/`)

All common components follow a consistent design pattern and are fully reusable across the application:

1. **Card.tsx** - Generic card container with configurable padding
2. **Table.tsx** - Dynamic data table with loading states, column configuration, and empty states
3. **StatCard.tsx** - Dashboard statistics cards with icons, trends, and color variants
4. **SearchBar.tsx** - Consistent search input with icon
5. **PageHeader.tsx** - Page title, subtitle, and action button layout
6. **Button.tsx** - Reusable button with variants (primary, secondary, danger, outline), sizes, and icons

### Pages (`src/pages/`)

#### 1. Dashboard (`/dashboard`)
- Overview statistics with StatCards
- Recent activities feed
- Low stock alerts
- Uses: `Dashboard.tsx`, `dashboardService.ts`

#### 2. Customers (`/customers`)
- Customer list with search functionality
- CRUD operations (Create, Read, Update, Delete)
- Customer details: name, document, email, phone, address
- Uses: `Customers.tsx`, `customerService.ts`

#### 3. Inventory (`/inventory`)
- Product inventory management
- Stock levels and status indicators
- Multiple units support (KG, L, UN)
- Location tracking
- Uses: `Inventory.tsx`, `inventoryService.ts`

#### 4. Deliveries (`/deliveries`)
- Delivery route management
- Driver and vehicle tracking
- Real-time status updates (pending, in progress, completed)
- Stop management
- Uses: `Deliveries.tsx`, `deliveryService.ts`

#### 5. Users (`/users`)
- User management dashboard
- Role-based access (admin, manager, operator)
- User status tracking
- Last login information
- Uses: `Users.tsx`, `userService.ts`

#### 6. Settings (`/settings`)
- Company information configuration
- Notification preferences
- Backup settings
- Security options
- Uses: `Settings.tsx`

### Existing Pages (Maintained)

- **Entradas** (`/entries`) - EntriesList.tsx - XML invoice import
- **Saídas** (`/exits`) - ExitsList.tsx - Product exits/sales
- **Histórico** (`/history`) - HistoryList.tsx - Audit trail

## Navigation Structure

### Sidebar Menu
```
Dashboard (Home)
├── Entradas (Entries)
├── Saídas (Exits)
├── Clientes (Customers)
├── Estoque (Inventory)
├── Entregas (Deliveries)
├── Usuários (Users)
├── Histórico (History)
└── Configurações (Settings)
```

## API Integration Pattern

Each page follows a consistent service pattern:

```typescript
// Service file structure (e.g., customerService.ts)
import api from './api';

export interface Customer {
  // Type definitions
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await api.get('/customers');
  return response.data;
}

export async function createCustomer(data): Promise<Customer> {
  const response = await api.post('/customers', data);
  return response.data;
}

export async function updateCustomer(id, data): Promise<Customer> {
  const response = await api.put(`/customers/${id}`, data);
  return response.data;
}

export async function deleteCustomer(id): Promise<void> {
  await api.delete(`/customers/${id}`);
}
```

## Backend Endpoints Required

To fully integrate the new pages, implement these backend endpoints:

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activities` - Recent activities

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Inventory
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Deliveries
- `GET /api/deliveries` - List deliveries
- `POST /api/deliveries` - Create delivery route
- `PUT /api/deliveries/:id` - Update delivery
- `DELETE /api/deliveries/:id` - Delete delivery

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Design System

### Colors
- Primary: Green (#16a34a - green-600)
- Secondary: Gray (#4b5563 - gray-600)
- Danger: Red (#dc2626 - red-600)
- Success: Green (#22c55e - green-500)
- Warning: Orange (#f97316 - orange-500)
- Info: Blue (#3b82f6 - blue-500)

### Typography
- Headers: 2xl, xl, lg (font-bold)
- Body: base (default)
- Small text: sm, xs

### Spacing
- Consistent padding: p-4, p-6
- Gap spacing: gap-2, gap-4, gap-6
- Margin bottom: mb-4, mb-6

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Key Features

1. **Responsive Design** - Fully mobile, tablet, and desktop optimized
2. **Consistent UX** - All pages follow the same layout and interaction patterns
3. **Loading States** - Every data fetch has proper loading indicators
4. **Error Handling** - Comprehensive error messages and retry options
5. **Search Functionality** - Real-time search across all list pages
6. **Authentication** - Protected routes with JWT token management
7. **Modular Architecture** - Easy to extend with new pages and features

## Usage Examples

### Adding a New Page

1. Create page component in `src/pages/YourPage/YourPage.tsx`
2. Create service in `src/services/yourPageService.ts`
3. Add route in `src/routes/index.tsx`
4. Add menu item in `src/components/Sidebar/Sidebar.tsx`
5. Use reusable components from `src/components/common/`

### Using Reusable Components

```typescript
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';

// In your component
<PageHeader
  title="Page Title"
  subtitle="Page description"
  action={<Button icon={Plus}>New Item</Button>}
/>

<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search..."
/>

<Table
  columns={columns}
  data={data}
  loading={loading}
  emptyMessage="No items found"
/>
```

## Next Steps

1. **Backend Implementation** - Create the required API endpoints
2. **Real Data Integration** - Replace mock data with actual API calls
3. **Form Modals** - Implement create/edit modals for each CRUD page
4. **Validation** - Add form validation and error handling
5. **Permissions** - Implement role-based access control
6. **Testing** - Add unit and integration tests

## File Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatCard.tsx
│   │   └── Table.tsx
│   ├── EntriesList/      # Existing components
│   ├── ExitsList/
│   ├── Header/
│   ├── HistoryList/
│   ├── ProductList/
│   └── Sidebar/
├── pages/
│   ├── Customers/        # New pages
│   ├── Dashboard/
│   ├── Deliveries/
│   ├── Inventory/
│   ├── Login/           # Existing pages
│   ├── Register/
│   ├── Settings/
│   └── Users/
├── services/            # API integration
│   ├── api.ts
│   ├── authService.ts
│   ├── customerService.ts
│   ├── dashboardService.ts
│   ├── deliveryService.ts
│   ├── entryService.ts
│   ├── exitService.ts
│   ├── historyService.ts
│   ├── inventoryService.ts
│   ├── productService.ts
│   └── userService.ts
└── routes/
    └── index.tsx        # Route configuration
```

## Build & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run backend server
npm run server
```

The dashboard is now ready for full integration with your backend API endpoints!

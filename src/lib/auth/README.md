# Authentication & Role-Based Access Control

Simple authentication system with two dummy test accounts.

## Test Accounts

- **Client/Bride**: `bride@example.com` / `password` → redirects to `/client`
- **Franchisee/Admin**: `franchisee@example.com` / `password` → redirects to `/admin`

## Overview

The system supports two user roles:
- **`client`** (Bride/Couple) - Redirects to `/client` after login
- **`franchisee`** (Admin) - Redirects to `/admin` after login

## Usage Examples

### 1. Login with Role-Based Redirection

The login action automatically redirects users based on their role:

```typescript
// src/routes/login/index.tsx
export const useLoginAction = routeAction$(async (data, requestEvent) => {
  // Authenticate user (check database, verify password, etc.)
  const user = await authenticateUser(email, password);
  
  // Set session
  setUserSession(requestEvent, user);
  
  // Redirect based on role
  const redirectPath = user.role === 'franchisee' ? '/admin' : '/client';
  throw requestEvent.redirect(302, redirectPath);
});
```

### 2. Protect Routes - Require Authentication

Use `requireAuth` to ensure a user is logged in:

```typescript
// src/routes/client/index.tsx
import { routeLoader$ } from '@builder.io/qwik-city';
import { requireAuth } from '~/lib/auth/session';

export const useClientLoader = routeLoader$(async (requestEvent) => {
  // This will redirect to /login if not authenticated
  const user = await requireAuth(requestEvent);
  
  // Only authenticated users reach this point
  return {
    user,
    // ... other data
  };
});
```

### 3. Protect Routes - Require Specific Role

Use `requireRole` to ensure a user has a specific role:

```typescript
// src/routes/admin/index.tsx
import { routeLoader$ } from '@builder.io/qwik-city';
import { requireRole } from '~/lib/auth/session';

export const useAdminLoader = routeLoader$(async (requestEvent) => {
  // This will redirect to /login if not authenticated
  // OR redirect to /client if user is not a franchisee
  const user = await requireRole(requestEvent, 'franchisee');
  
  // Only franchisees reach this point
  return {
    user,
    // ... admin data
  };
});
```

### 4. Check User Role in Component

Get the current user and check their role:

```typescript
// src/routes/some-page/index.tsx
import { routeLoader$ } from '@builder.io/qwik-city';
import { getCurrentUser, hasRole } from '~/lib/auth/session';

export const usePageLoader = routeLoader$(async (requestEvent) => {
  const user = await getCurrentUser(requestEvent);
  const isFranchisee = await hasRole(requestEvent, 'franchisee');
  
  return {
    user,
    isFranchisee,
    // ... other data
  };
});
```

### 5. Logout

Clear the session on logout:

```typescript
// src/routes/logout/index.tsx
import { routeAction$ } from '@builder.io/qwik-city';
import { clearUserSession } from '~/lib/auth/session';

export const useLogoutAction = routeAction$(async (data, requestEvent) => {
  clearUserSession(requestEvent);
  throw requestEvent.redirect(302, '/login');
});
```

## Implementation Notes

### In Production

When implementing actual authentication, you'll need to:

1. **Database Lookup**: Replace mock authentication with actual database queries
   ```typescript
   // Example
   const userRecord = await db.users.findByEmail(email);
   if (!userRecord || !await verifyPassword(password, userRecord.passwordHash)) {
     throw new Error('Invalid credentials');
   }
   ```

2. **Password Hashing**: Use bcrypt or similar for password hashing
   ```typescript
   import bcrypt from 'bcrypt';
   const isValid = await bcrypt.compare(password, userRecord.passwordHash);
   ```

3. **Session Security**: Consider using JWT tokens or session IDs stored in database
   ```typescript
   // Instead of storing full user object in cookie, store session ID
   const sessionId = generateSessionId();
   await db.sessions.create({ sessionId, userId: user.id });
   requestEvent.cookie.set(SESSION_COOKIE_NAME, sessionId, { ... });
   ```

4. **Role Assignment**: Determine role from database
   ```typescript
   const userRole: UserRole = userRecord.role; // From database
   ```

## Session Management

Sessions are stored in HTTP-only cookies for security. The session cookie:
- Is HTTP-only (not accessible via JavaScript)
- Is secure (HTTPS only in production)
- Expires after 7 days
- Uses SameSite: 'lax' for CSRF protection

## Type Safety

All user types are defined in `~/lib/types/index.ts`:

```typescript
export type UserRole = 'client' | 'franchisee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  clientId?: string;      // For clients
  franchiseeId?: string;   // For franchisees
}
```


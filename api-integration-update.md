# API Integration Update Summary

## Overview
Updated the frontend API configuration to integrate with the actual "Shop Tool Nro" backend service based on the provided Postman collection.

## Updated Files

### 1. API Configuration (`src/lib/api/config.ts`)
- **Updated API_ENDPOINTS** to match the actual backend endpoints from Postman collection
- **Authentication endpoints**:
  - `/api/v1/auth/login` - Login with email/password
  - `/api/v1/auth/register` - User registration  
  - `/api/v1/auth/me` - Get/update current user profile
  - `/api/v1/auth/change-password` - Change password
  - `/api/v1/auth/forgot-password` - Request password reset
  - `/api/v1/auth/refresh-tokens` - Refresh authentication tokens

- **User management endpoints** (admin functions):
  - `/api/v1/users` - Create/list users
  - `/api/v1/users/{id}` - Update/delete user
  - `/api/v1/users/{id}/lock` - Lock user account
  - `/api/v1/users/{id}/unlock` - Unlock user account
  - `/api/v1/users/{id}/balance` - Update user balance
  - `/api/v1/users/{id}/reset-password` - Reset user password

- **Tools endpoints**:
  - `/api/v1/tools` - List tools (public view)
  - `/api/v1/tools/{id}` - Get/update/delete specific tool
  - `/api/v1/tools/admin` - Admin view of tools
  - `/api/v1/tools/{id}/active` - Activate tool
  - `/api/v1/tools/{id}/pause` - Pause/deactivate tool

- **File management endpoints**:
  - `/api/v1/files/upload/single` - Upload single file
  - `/api/v1/files/upload/multiple` - Upload multiple files
  - `/api/v1/files/static/{resource}/{filename}` - Get file URL
  - `/api/v1/files/{id}` - Delete single file
  - `/api/v1/files/delete-multiple` - Delete multiple files

### 2. Authentication Service (`src/lib/api/services/auth.service.ts`)
- **Removed** the `logout()` method (no logout endpoint in backend)
- **Updated** endpoint references to use new configuration:
  - `getCurrentUser()` → uses `/api/v1/auth/me`
  - `updateProfile()` → uses `/api/v1/auth/me` (PUT)
  - `refreshToken()` → uses `/api/v1/auth/refresh-tokens`
  - `requestPasswordReset()` → uses `/api/v1/auth/forgot-password`

### 3. New Service: User Management (`src/lib/api/services/user.service.ts`)
Created comprehensive user management service for admin functions:
- `createUser()` - Create new user
- `getUsers()` - List users with filtering/pagination
- `updateUser()` - Update user details
- `lockUser()` / `unlockUser()` - Account management
- `deleteUser()` - Remove user
- `updateUserBalance()` - Manage user balance
- `resetUserPassword()` - Admin password reset

### 4. New Service: Tools Management (`src/lib/api/services/tool.service.ts`)
Created tools service matching backend structure:
- `getTools()` - Public tool listing
- `getToolById()` - Get specific tool details
- `getToolsAdmin()` - Admin view of tools
- `createTool()` - Create new tool with plans/images
- `updateTool()` - Update tool information
- `activateTool()` / `pauseTool()` - Tool status management
- `deleteTool()` - Remove tool

### 5. New Service: File Management (`src/lib/api/services/file.service.ts`)
Created file handling service:
- `uploadSingle()` - Upload single file with resource type
- `uploadMultiple()` - Upload multiple files
- `getFileUrl()` - Generate file URLs for display
- `deleteFile()` - Delete single file
- `deleteMultipleFiles()` - Bulk file deletion

### 6. Updated Type Definitions (`src/lib/api/types.ts`)
Added new interfaces for backend integration:
- `CreateUserRequest` - User creation data
- `UpdateUserRequest` - User update data  
- `UpdateBalanceRequest` - Balance modification data
- `ResetPasswordRequest` - Password reset data
- `UserFilters` - User listing filters

### 7. Updated Service Index (`src/lib/api/services/index.ts`)
- Updated to export the new services
- Simplified to focus on core backend-integrated services
- Removed conditional exports that were causing TypeScript errors

## Backend Data Structures

Based on the Postman collection, the backend expects these data structures:

### Authentication
```json
// Login Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Register Request  
{
  "fullname": "Full Name",
  "email": "user@example.com", 
  "password": "password123"
}
```

### Tool Creation
```json
{
  "code": "TOOL001",
  "name": "Tool Name",
  "description": "Tool description",
  "demo": "https://demo-url.com",
  "linkDownload": "https://download-url.com",
  "images": ["file_id_1", "file_id_2"],
  "plans": [
    {
      "name": "1 Month",
      "price": 10000,
      "duration": 1
    },
    {
      "name": "Permanent", 
      "price": 60000,
      "duration": -1
    }
  ]
}
```

### User Management
```json
// Create User
{
  "fullname": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

// Update Balance
{
  "amount": 50000,
  "operation": 1,  // 1 for add, -1 for subtract
  "reason": "Top-up via bank transfer"
}
```

## Authentication Flow

The backend uses Bearer token authentication:
1. Login with email/password → receives `accessToken` and `refreshToken`
2. All subsequent requests include `Authorization: Bearer {accessToken}` header
3. When token expires, use refresh endpoint with `refreshToken` to get new tokens
4. The frontend automatically handles token management through the API client

## File Upload Process

For file uploads (tool images, etc.):
1. Upload files using `/api/v1/files/upload/single` or `/upload/multiple`
2. Specify `resource` type (e.g., "tool") 
3. Backend returns file ID and metadata
4. Use file IDs when creating/updating tools
5. Access files via `/api/v1/files/static/{resource}/{filename}`

## Next Steps

1. **Test API Integration**: Try logging in and making API calls to verify connectivity
2. **Update UI Components**: Modify existing components to use the new service methods
3. **Handle Authentication**: Ensure the auth flow works with the backend login/refresh endpoints
4. **File Upload Integration**: Update file upload components to use the new file service
5. **Error Handling**: Test error scenarios and ensure proper error messages display

The API services are now fully aligned with your backend implementation. The application should be able to successfully communicate with your "Shop Tool Nro" API once you update the base URL in your environment variables to point to your actual backend server.

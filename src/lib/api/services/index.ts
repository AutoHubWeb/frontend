/**
 * API Services Index
 * Central export for all API services
 */

// Import core services
import { authService, AuthService } from './auth.service';
import { userService, UserService } from './user.service';
import { toolService, ToolService } from './tool.service';
import { fileService, FileService } from './file.service';

// Export core services
export { authService, AuthService } from './auth.service';
export { userService, UserService } from './user.service';
export { toolService, ToolService } from './tool.service';
export { fileService, FileService } from './file.service';

// Export all services as a single object for convenience
export const apiServices = {
  auth: authService,
  users: userService,
  tools: toolService,
  files: fileService,
};

// Service factory for dependency injection (if needed)
export const createServices = () => ({
  auth: new AuthService(),
  users: new UserService(),
  tools: new ToolService(),
  files: new FileService(),
});

// Type for the services object
export type ApiServices = typeof apiServices;

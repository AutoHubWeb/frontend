/**
 * API Services Index
 * Central export for all API services
 */

// Import services
import { authService, AuthService } from './auth.service';
import { toolsService, ToolsService } from './tools.service';
import { purchasesService, PurchasesService } from './purchases.service';
import { paymentsService, PaymentsService } from './payments.service';
import { discountCodesService, DiscountCodesService } from './discount-codes.service';
import { adminService, AdminService } from './admin.service';

// Export services
export { authService, AuthService } from './auth.service';
export { toolsService, ToolsService } from './tools.service';
export { purchasesService, PurchasesService } from './purchases.service';
export { paymentsService, PaymentsService } from './payments.service';
export { discountCodesService, DiscountCodesService } from './discount-codes.service';
export { adminService, AdminService } from './admin.service';

// Export all services as a single object for convenience
export const apiServices = {
  auth: authService,
  tools: toolsService,
  purchases: purchasesService,
  payments: paymentsService,
  discountCodes: discountCodesService,
  admin: adminService,
};

// Service factory for dependency injection (if needed)
export const createServices = () => ({
  auth: new AuthService(),
  tools: new ToolsService(),
  purchases: new PurchasesService(),
  payments: new PaymentsService(),
  discountCodes: new DiscountCodesService(),
  admin: new AdminService(),
});

// Type for the services object
export type ApiServices = typeof apiServices;

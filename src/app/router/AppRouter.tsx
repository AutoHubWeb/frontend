/**
 * App Router
 * Centralized routing configuration
 */

import { Switch, Route } from 'wouter';
import { useAuth } from '@/features/auth';

// App pages
import NotFound from '@/app/pages/not-found';

// Feature pages
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import Home from '@/features/home/Home';
import Tools from '@/features/tools/pages/Tools';
import ToolDetails from '@/features/tools/pages/ToolDetails';
import PurchasedTools from '@/features/tools/pages/PurchasedTools';
import Deposit from '@/features/payments/pages/Deposit';
import History from '@/features/payments/pages/History';
import Checkout from '@/features/payments/pages/Checkout';
import AdminPanel from '@/features/admin/pages/AdminPanel';
import Statistics from '@/features/admin/pages/Statistics';
import Profile from '@/features/profile/pages/Profile';

export function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Home} />
      <Route path="/tools" component={Tools} />
      <Route path="/tools/:id" component={ToolDetails} />
      <Route path="/statistics" component={Statistics} />
      
      {/* Protected Routes */}
      {isAuthenticated && (
        <>
          <Route path="/purchased-tools" component={PurchasedTools} />
          <Route path="/deposit" component={Deposit} />
          <Route path="/history" component={History} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin/:section" component={AdminPanel} />
          <Route path="/checkout" component={Checkout} />
        </>
      )}
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

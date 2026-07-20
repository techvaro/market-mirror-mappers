import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Components
import { Shell } from './components/shell';
import NotFound from '@/pages/not-found';
import { AuthProvider, useAuth } from './hooks/use-auth';

// Pages
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import Dashboard from './pages/dashboard';
import Tasks from './pages/tasks';
import TaskDetail from './pages/task-detail';
import RegisterVendor from './pages/register-vendor';
import MapShop from './pages/map-shop';
import Verification from './pages/verification';
import NearbyVendors from './pages/nearby-vendors';
import Messages from './pages/messages';
import Notifications from './pages/notifications';
import Reports from './pages/reports';
import Analytics from './pages/analytics';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Help from './pages/help';
import CompletedTasks from './pages/completed-tasks';
import RejectedSubmissions from './pages/rejected-submissions';

const queryClient = new QueryClient();

function ProtectedRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        
        <Route path="/tasks/completed" component={CompletedTasks} />
        <Route path="/tasks/rejected" component={RejectedSubmissions} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/tasks/:id" component={TaskDetail} />
        
        <Route path="/register-vendor" component={RegisterVendor} />
        <Route path="/map-shop" component={MapShop} />
        <Route path="/verification" component={Verification} />
        <Route path="/nearby-vendors" component={NearbyVendors} />
        
        <Route path="/messages" component={Messages} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/reports" component={Reports} />
        <Route path="/analytics" component={Analytics} />
        
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/help" component={Help} />
        
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="*" component={ProtectedRouter} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
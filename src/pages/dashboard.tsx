import React from 'react';
import { useTasks, useProfile, useVendors } from '../hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  MapPin, 
  UserPlus, 
  TrendingUp, 
  AlertCircle,
  Map as MapIcon,
  Play
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: vendors, isLoading: vendorsLoading } = useVendors();

  if (profileLoading || tasksLoading || vendorsLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const pendingTasks = tasks?.filter(t => t.status === 'pending' || t.status === 'in_progress') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const rejectedTasks = tasks?.filter(t => t.status === 'rejected') || [];

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 bg-primary text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <MapPin className="h-64 w-64 -mt-10 -mr-10" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Welcome back, {profile?.name.split(' ')[0]}!</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              You have {pendingTasks.length} pending assignments in the {profile?.region} region today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="bg-primary-foreground/10 p-4 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
                <div className="text-3xl font-bold font-heading">{tasks?.length || 0}</div>
                <div className="text-xs text-primary-foreground/80 uppercase tracking-wider mt-1">Total Assigned</div>
              </div>
              <div className="bg-primary-foreground/10 p-4 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
                <div className="text-3xl font-bold font-heading">{completedTasks.length}</div>
                <div className="text-xs text-primary-foreground/80 uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div className="bg-primary-foreground/10 p-4 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
                <div className="text-3xl font-bold font-heading text-accent">{pendingTasks.length}</div>
                <div className="text-xs text-primary-foreground/80 uppercase tracking-wider mt-1">Pending</div>
              </div>
              <div className="bg-primary-foreground/10 p-4 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
                <div className="text-3xl font-bold font-heading text-destructive-foreground">{rejectedTasks.length}</div>
                <div className="text-xs text-primary-foreground/80 uppercase tracking-wider mt-1">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Score</CardTitle>
            <CardDescription>Based on speed and accuracy</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${profile?.performanceScore || 0}, 100`}
                  className="text-accent"
                />
              </svg>
              <div className="absolute text-3xl font-bold font-heading text-foreground">
                {profile?.performanceScore}<span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div className="mt-4 w-full flex justify-between text-sm text-muted-foreground px-4">
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> 98% Approval</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-blue-500" /> 14m / task</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/register-vendor" className="block">
            <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-primary/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <UserPlus className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm">Register Vendor</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/map-shop" className="block">
            <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-primary/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm">Map Shop Location</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/nearby-vendors" className="block">
            <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-primary/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <MapIcon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm">Nearby Vendors</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tasks" className="block">
            <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-primary/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm">View All Tasks</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Assignments */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Today's Priority Assignments</CardTitle>
              <CardDescription>Complete these first</CardDescription>
            </div>
            <Link href="/tasks" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 mt-2">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-destructive' : 
                    task.priority === 'medium' ? 'bg-accent' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{task.vendorName} • {task.market}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" asChild variant={task.status === 'in_progress' ? 'default' : 'outline'}>
                    <Link href={`/tasks/${task.id}`}>
                      {task.status === 'in_progress' ? 'Resume' : 'Start'}
                    </Link>
                  </Button>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mb-2 opacity-50" />
                  <p>All caught up for today!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Required (Rejected/Fixes) */}
        <Card className="flex flex-col border-destructive/20 shadow-sm">
          <CardHeader className="pb-2 bg-destructive/5 border-b border-destructive/10 rounded-t-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Action Required</CardTitle>
            </div>
            <CardDescription>Submissions needing corrections</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <div className="space-y-4">
              {rejectedTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{task.vendorName}</h4>
                    <p className="text-xs text-destructive mt-1 font-medium">{task.description}</p>
                  </div>
                  <Button size="sm" variant="destructive" asChild>
                    <Link href={`/tasks/${task.id}`}>Fix Now</Link>
                  </Button>
                </div>
              ))}
              {rejectedTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No rejected submissions. Great job!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

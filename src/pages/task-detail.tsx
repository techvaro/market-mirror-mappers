import React from 'react';
import { useRoute, Link } from 'wouter';
import { useTask, useUpdateTaskStatus } from '../hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  UserPlus, 
  Camera, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TaskDetail() {
  const [, params] = useRoute('/tasks/:id');
  const id = params?.id || '';
  const { data: task, isLoading } = useTask(id);
  const updateStatus = useUpdateTaskStatus();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  const handleStartTask = () => {
    updateStatus.mutate({ id: task.id, status: 'in_progress' }, {
      onSuccess: () => {
        toast({
          title: "Task Started",
          description: "Time tracking has begun.",
        });
      }
    });
  };

  const isRegistrationTask = task.title.toLowerCase().includes('register') || task.title.toLowerCase().includes('registration');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tasks"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">{task.title}</h1>
          <p className="text-muted-foreground mt-1">Task ID: {task.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.status === 'rejected' && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Rejection Reason</h4>
                    <p className="mt-1">{task.description}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Vendor Name</span>
                  <p className="font-medium text-lg">{task.vendorName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Market Location</span>
                  <p className="font-medium text-lg flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-accent" />
                    {task.market}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(task.dueDate), 'PPP p')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div>
                    <Badge variant="outline" className="capitalize">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {isRegistrationTask ? <UserPlus className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{isRegistrationTask ? 'Collect Business Info' : 'Update Photos'}</h4>
                    <p className="text-sm text-muted-foreground">Gather necessary details from the vendor.</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-muted-foreground opacity-30" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <div className="p-2 rounded-full bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Map GPS Location</h4>
                    <p className="text-sm text-muted-foreground">Drop a pin exactly at the shop entrance.</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-muted-foreground opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="sticky top-20 border-primary shadow-md">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-heading font-semibold">Ready to start?</h3>
                <p className="text-sm text-muted-foreground mt-2">Ensure you are physically at the market location before starting.</p>
              </div>

              {task.status === 'pending' ? (
                <Button className="w-full h-12 text-lg" onClick={handleStartTask}>
                  Start Task
                </Button>
              ) : task.status === 'in_progress' || task.status === 'rejected' ? (
                <div className="space-y-3">
                  <Button className="w-full h-12 text-lg" asChild>
                    <Link href={isRegistrationTask ? `/register-vendor?taskId=${task.id}` : `/map-shop?taskId=${task.id}`}>
                      Continue Workflow
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => {
                     updateStatus.mutate({ id: task.id, status: 'completed' }, {
                        onSuccess: () => {
                          toast({ title: "Marked as completed" });
                        }
                     });
                  }}>
                    Mark as Done manually
                  </Button>
                </div>
              ) : (
                <div className="text-center p-4 bg-emerald-500/10 rounded-lg text-emerald-600 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Task Completed
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

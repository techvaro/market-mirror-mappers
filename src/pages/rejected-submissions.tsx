import React from 'react';
import { useTasks } from '../hooks/use-data';
import { useLocation, Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, Calendar, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function RejectedSubmissions() {
  const { data: tasks, isLoading } = useTasks();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const rejected = (tasks?.filter(t => t.status === 'rejected') || []).sort((a, b) =>
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  const handleEditResubmit = (taskId: string) => {
    toast({
      title: 'Opening workflow',
      description: 'Continue your submission and re-submit for review.',
    });
    setLocation(`/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Rejected Submissions</h1>
        <p className="text-muted-foreground mt-1">Review the reasons for rejection and resubmit corrected work.</p>
      </div>

      {rejected.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <AlertCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No rejected submissions. Great job!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rejected.map((task) => (
            <Card key={task.id} className="border-destructive/20 bg-destructive/5" data-testid={`card-rejected-task-${task.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-full bg-destructive/10 text-destructive flex-shrink-0">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.vendorName}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3 ml-0 sm:ml-12">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {task.market}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Rejected {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>

                {task.description && (
                  <div className="mt-4 ml-0 sm:ml-12 p-3 rounded-lg bg-card border border-destructive/20">
                    <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Reason for Rejection</h4>
                    <p className="text-sm text-foreground">{task.description}</p>
                  </div>
                )}

                {task.corrections && task.corrections.length > 0 && (
                  <div className="mt-3 ml-0 sm:ml-12">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Required Corrections</h4>
                    <ul className="space-y-1">
                      {task.corrections.map((item, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end mt-4 ml-0 sm:ml-12">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEditResubmit(task.id)}
                    data-testid={`button-edit-resubmit-${task.id}`}
                  >
                    <PenLine className="h-4 w-4 mr-2" /> Edit &amp; Resubmit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

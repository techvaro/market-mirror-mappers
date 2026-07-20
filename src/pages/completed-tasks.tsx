import React, { useState } from 'react';
import { useTasks } from '../hooks/use-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, MapPin, Calendar, Download, Eye, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '../types';

export default function CompletedTasks() {
  const { data: tasks, isLoading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const completed = (tasks?.filter(t => t.status === 'completed') || []).sort((a, b) =>
    new Date(b.completedDate || b.dueDate).getTime() - new Date(a.completedDate || a.dueDate).getTime()
  );

  const handleDownloadReport = (task: Task) => {
    toast({
      title: 'Report Ready',
      description: `A submission report for "${task.title}" has been generated (prototype simulation).`,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Completed Tasks</h1>
        <p className="text-muted-foreground mt-1">A record of everything you've finished and submitted.</p>
      </div>

      {completed.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <CheckCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No completed tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((task) => (
            <Card key={task.id} className="hover-elevate transition-colors border-border" data-testid={`card-completed-task-${task.id}`}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
                    <Badge className="bg-emerald-500 text-white">Approved</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{task.vendorName}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {task.market}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Completed {format(new Date(task.completedDate || task.dueDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)} data-testid={`button-view-submission-${task.id}`}>
                    <Eye className="h-4 w-4 mr-2" /> View Submission
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(task)} data-testid={`button-download-report-${task.id}`}>
                    <Download className="h-4 w-4 mr-2" /> Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="rounded-[14px]" data-testid="dialog-view-submission">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-heading">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600" /> {selectedTask.title}
                </DialogTitle>
                <DialogDescription>Submission summary (prototype view)</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium text-foreground">{selectedTask.vendorName}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Market</span>
                  <span className="font-medium text-foreground">{selectedTask.market}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Assigned</span>
                  <span className="font-medium text-foreground">{format(new Date(selectedTask.assignedDate), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(selectedTask.completedDate || selectedTask.dueDate), 'PPP')}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

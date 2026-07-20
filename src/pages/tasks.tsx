import React, { useMemo, useState } from 'react';
import { useTasks } from '../hooks/use-data';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, AlertCircle, Clock, CheckCircle, MapPin, Calendar, ArrowRight, X, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOrder = 'due-asc' | 'due-desc';

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'rejected'>('all');
  const [priorityFilters, setPriorityFilters] = useState<string[]>(['high', 'medium', 'low']);
  const [sortOrder, setSortOrder] = useState<SortOrder>('due-asc');

  const togglePriority = (priority: string) => {
    setPriorityFilters((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  const activeAdvancedFilterCount = (priorityFilters.length < 3 ? 1 : 0) + (sortOrder !== 'due-asc' ? 1 : 0);

  const filteredTasks = useMemo(() => {
    const result = tasks?.filter(task => {
      const query = search.trim().toLowerCase();
      const matchesSearch = query === '' ||
        task.title.toLowerCase().includes(query) ||
        task.vendorName.toLowerCase().includes(query) ||
        task.market.toLowerCase().includes(query);
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesPriority = priorityFilters.includes(task.priority);

      // Don't show completed tasks in the main assigned tasks view
      return matchesSearch && matchesFilter && matchesPriority && task.status !== 'completed';
    }) || [];

    return [...result].sort((a, b) => {
      const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sortOrder === 'due-asc' ? diff : -diff;
    });
  }, [tasks, search, filter, priorityFilters, sortOrder]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground border-destructive';
      case 'medium': return 'bg-accent text-accent-foreground border-accent';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-accent" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Assigned Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and execute your daily assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 pr-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-task-search"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                data-testid="button-clear-search"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative" data-testid="button-open-filters">
                <Filter className="h-4 w-4" />
                {activeAdvancedFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                    {activeAdvancedFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" data-testid="menu-task-filters">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={priorityFilters.includes('high')}
                onCheckedChange={() => togglePriority('high')}
                data-testid="checkbox-priority-high"
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilters.includes('medium')}
                onCheckedChange={() => togglePriority('medium')}
                data-testid="checkbox-priority-medium"
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilters.includes('low')}
                onCheckedChange={() => togglePriority('low')}
                data-testid="checkbox-priority-low"
              >
                Low
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" /> Sort by due date
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                <DropdownMenuRadioItem value="due-asc" data-testid="radio-sort-due-asc">Soonest first</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="due-desc" data-testid="radio-sort-due-desc">Latest first</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          All Active
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('pending')}
          className="rounded-full"
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'in_progress' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('in_progress')}
          className="rounded-full"
        >
          In Progress
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'destructive' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('rejected')}
          className="rounded-full"
        >
          Requires Fix
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold font-heading">No tasks found</h3>
            <p className="text-muted-foreground mt-2">You've cleared your queue based on these filters.</p>
          </div>
        ) : (
          filteredTasks?.map((task) => (
            <Card key={task.id} className={`hover-elevate transition-all border-l-4 ${
              task.priority === 'high' ? 'border-l-destructive' : 
              task.priority === 'medium' ? 'border-l-accent' : 'border-l-blue-500'
            }`}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
                  
                  <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
                    <div className="flex items-start justify-between sm:justify-start sm:gap-4 w-full">
                      <h3 className="text-lg font-semibold font-heading truncate leading-tight">
                        {task.title}
                      </h3>
                      <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        {task.vendorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {task.market}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Due {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    {task.status === 'rejected' && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive font-medium flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{task.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="hidden sm:flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm font-medium capitalize tracking-wider text-muted-foreground">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <Button asChild variant={task.status === 'in_progress' ? 'default' : task.status === 'rejected' ? 'destructive' : 'outline'} className="ml-auto sm:ml-0">
                      <Link href={`/tasks/${task.id}`}>
                        {task.status === 'in_progress' ? 'Resume' : task.status === 'rejected' ? 'Fix Now' : 'Start Task'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

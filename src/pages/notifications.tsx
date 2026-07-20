import { useNotifications, useMarkNotificationRead } from '../hooks/use-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertCircle, FileText, Settings, ShieldAlert, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();

  if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'approval': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rejection': return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <Settings className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Updates on your assignments and submissions.</p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="h-4 w-4 mr-2" /> Mark All Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications?.map((notif) => (
          <Card 
            key={notif.id} 
            className={`border-border transition-colors ${!notif.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
          >
            <CardContent className="p-4 sm:p-5 flex items-start gap-4">
              <div className={`p-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-semibold text-sm truncate ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${!notif.read ? 'text-foreground/90 font-medium' : 'text-muted-foreground'}`}>
                  {notif.message}
                </p>
                {!notif.read && (
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => markAsRead.mutate(notif.id)}
                    >
                      Mark as read
                    </Button>
                  </div>
                )}
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
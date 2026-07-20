import React, { useState } from 'react';
import { useVendors, useUpdateVendorStatus } from '../hooks/use-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, MapPin, Calendar, ExternalLink, CheckCircle, XCircle, Clock, Phone, Mail, Hash, User } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Vendor } from '../types';

function VendorReviewDialog({ vendor, open, onOpenChange }: { vendor: Vendor | null; open: boolean; onOpenChange: (open: boolean) => void; }) {
  const [notes, setNotes] = useState('');
  const updateStatus = useUpdateVendorStatus();
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) setNotes('');
  }, [open, vendor?.id]);

  if (!vendor) return null;

  const handleDecision = (status: 'approved' | 'rejected') => {
    updateStatus.mutate({ id: vendor.id, status, notes: notes.trim() || undefined }, {
      onSuccess: () => {
        toast({
          title: status === 'approved' ? 'Vendor Approved' : 'Vendor Rejected',
          description: `${vendor.businessName} has been ${status}.`,
        });
        onOpenChange(false);
      }
    });
  };

  const handleRequestCorrection = () => {
    if (!notes.trim()) {
      toast({
        title: 'Add a note first',
        description: 'Describe what needs to be corrected before sending it back.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Correction Requested',
      description: `${vendor.businessName} will be notified to fix: "${notes.trim()}"`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[14px]" data-testid="dialog-review-details">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{vendor.businessName}</DialogTitle>
          <DialogDescription>{vendor.category} • Submitted {format(new Date(vendor.createdAt), 'PPP')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="w-full h-36 bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground/30">
            <Store className="h-12 w-12" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.ownerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.email || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.registrationNumber || vendor.taxId || 'No registration/tax ID on file'}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.market} — Shop {vendor.shopNumber}{vendor.location?.streetName ? `, ${vendor.location.streetName}` : ''}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{vendor.operatingHours || 'Operating hours not provided'}</span>
            </div>
          </div>

          {vendor.description && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Description</span>
              <p className="text-sm text-foreground mt-1">{vendor.description}</p>
            </div>
          )}

          <div>
            <Label htmlFor="verification-notes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Verification Notes
            </Label>
            <Textarea
              id="verification-notes"
              placeholder="Add notes for this decision, or describe what needs correcting..."
              className="mt-1.5 rounded-[14px]"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="textarea-verification-notes"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleRequestCorrection}
            data-testid="button-request-correction"
          >
            Request Correction
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => handleDecision('rejected')}
            disabled={updateStatus.isPending}
            data-testid="button-reject-vendor"
          >
            Reject
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => handleDecision('approved')}
            disabled={updateStatus.isPending}
            data-testid="button-approve-vendor"
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Verification() {
  const { data: vendors, isLoading } = useVendors();
  const [reviewVendor, setReviewVendor] = useState<Vendor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const pending = vendors?.filter(v => v.status === 'pending') || [];
  const approved = vendors?.filter(v => v.status === 'approved') || [];
  const rejected = vendors?.filter(v => v.status === 'rejected') || [];

  const openReview = (vendor: Vendor) => {
    setReviewVendor(vendor);
    setDialogOpen(true);
  };

  const VendorCard = ({ vendor }: { vendor: any }) => (
    <Card className="hover-elevate transition-colors border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-40 h-32 sm:h-auto bg-muted border-r border-border relative flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <Store className="h-12 w-12" />
          </div>
        </div>
        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold font-heading truncate">{vendor.businessName}</h3>
                <p className="text-sm text-muted-foreground truncate">{vendor.category} • {vendor.ownerName}</p>
              </div>
              <Badge variant={
                vendor.status === 'approved' ? 'default' : 
                vendor.status === 'rejected' ? 'destructive' : 'outline'
              } className={vendor.status === 'approved' ? 'bg-emerald-500' : ''}>
                {vendor.status}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground mt-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {vendor.market} ({vendor.shopNumber})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Submitted {format(new Date(vendor.createdAt), 'MMM d')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => openReview(vendor)}
              data-testid={`button-review-details-${vendor.id}`}
            >
              Review Details <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Vendor Verification</h1>
        <p className="text-muted-foreground mt-1">Review and track submission statuses.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4 hidden sm:block" /> Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 hidden sm:block" /> Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4 hidden sm:block" /> Rejected
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="pending" className="space-y-4 m-0">
            {pending.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">No pending verifications.</p>
              </div>
            ) : (
              pending.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4 m-0">
            {approved.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">No approved vendors.</p>
              </div>
            ) : (
              approved.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4 m-0">
            {rejected.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">No rejected vendors.</p>
              </div>
            ) : (
              rejected.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)
            )}
          </TabsContent>
        </div>
      </Tabs>

      <VendorReviewDialog vendor={reviewVendor} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

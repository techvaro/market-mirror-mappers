import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, ClipboardEdit } from 'lucide-react';

interface MapperApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

const ID_TYPES = [
  'National ID Card (NIN)',
  "Driver's License",
  'International Passport',
  "Voter's Card",
];

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  state: '',
  lga: '',
  yearsOfExperience: '',
  idType: '',
  statement: '',
};

export function MapperApplicationDialog({ open, onOpenChange }: MapperApplicationDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.state &&
    form.lga.trim() &&
    form.idType &&
    form.statement.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    // Prototype only: simulate a review submission with local state, no backend call.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setForm(EMPTY_FORM);
        setIsSubmitted(false);
        setIsSubmitting(false);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-[14px]" data-testid="dialog-mapper-application">
        {isSubmitted ? (
          <div className="flex flex-col items-center text-center gap-4 py-6" data-testid="section-application-success">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-foreground">Application Submitted</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your application has been submitted successfully. Our team will review your
                application. You will receive an email notifying you whether your application has
                been approved or rejected.
              </p>
            </div>
            <Button
              className="mt-2 rounded-[14px]"
              onClick={() => handleClose(false)}
              data-testid="button-application-done"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <ClipboardEdit className="h-5 w-5 text-primary" />
                <DialogTitle className="font-heading">Mapper Application</DialogTitle>
              </div>
              <DialogDescription>
                Tell us about yourself. This prototype application is not sent anywhere — it's
                simulated for demonstration purposes only.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="app-full-name">Full Name</Label>
                <Input
                  id="app-full-name"
                  placeholder="e.g. Ada Obi"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  data-testid="input-application-full-name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="app-email">Email Address</Label>
                  <Input
                    id="app-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    data-testid="input-application-email"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="app-phone">Phone Number</Label>
                  <Input
                    id="app-phone"
                    type="tel"
                    placeholder="e.g. +234 801 234 5678"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    data-testid="input-application-phone"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="app-address">Residential Address</Label>
                <Input
                  id="app-address"
                  placeholder="Street, city"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  data-testid="input-application-address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="app-state">State</Label>
                  <Select value={form.state} onValueChange={(v) => update('state', v)}>
                    <SelectTrigger id="app-state" data-testid="select-application-state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="app-lga">Local Government Area</Label>
                  <Input
                    id="app-lga"
                    placeholder="e.g. Ikeja"
                    value={form.lga}
                    onChange={(e) => update('lga', e.target.value)}
                    data-testid="input-application-lga"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="app-experience">Years of Experience (optional)</Label>
                  <Input
                    id="app-experience"
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={form.yearsOfExperience}
                    onChange={(e) => update('yearsOfExperience', e.target.value)}
                    data-testid="input-application-experience"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="app-id-type">Means of Identification</Label>
                  <Select value={form.idType} onValueChange={(v) => update('idType', v)}>
                    <SelectTrigger id="app-id-type" data-testid="select-application-id-type">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="app-statement">Why do you want to become a mapper?</Label>
                <Textarea
                  id="app-statement"
                  placeholder="Share a short statement..."
                  rows={4}
                  value={form.statement}
                  onChange={(e) => update('statement', e.target.value)}
                  data-testid="input-application-statement"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-[14px]"
                disabled={!isValid || isSubmitting}
                data-testid="button-submit-application"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

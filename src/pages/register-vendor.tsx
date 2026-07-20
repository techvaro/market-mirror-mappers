import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Target, LocateFixed, WifiOff, Camera, Upload, CheckCircle, Info, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateVendor } from '../hooks/use-data';
import { useLocation } from 'wouter';

const STEPS = ['Business Info', 'Location', 'Photos', 'Details', 'Review'];

export default function RegisterVendor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const createVendor = useCreateVendor();
  const [, setLocation] = useLocation();

  // Mock form state
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    category: '',
    market: 'Central Market',
    shopNumber: '',
    lat: 0,
    lng: 0,
    accuracy: 0,
  });

  const [photos, setPhotos] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo(0,0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved locally.",
      });
    }, 800);
  };

  const handleSubmit = () => {
    createVendor.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Registration Submitted",
          description: "Sent for admin approval.",
        });
        setLocation('/dashboard');
      }
    });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-border -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        ></div>
        
        {STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
              index < currentStep ? 'bg-primary border-primary text-primary-foreground' :
              index === currentStep ? 'bg-card border-primary text-primary' :
              'bg-card border-border text-muted-foreground'
            }`}>
              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Register New Vendor</h1>
          <p className="text-muted-foreground text-sm mt-1">Capture business details, location, and photos.</p>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1"><WifiOff className="h-3 w-3"/> Saving draft...</span>}
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>Save Draft</Button>
        </div>
      </div>

      {renderStepIndicator()}

      <Card className="shadow-lg border-border">
        <CardContent className="p-6 sm:p-8">
          
          {/* STEP 1: BUSINESS INFO */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-heading font-semibold border-b pb-2">Business Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. Fresh Mart" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input id="ownerName" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="e.g. +1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Business Category *</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category...</option>
                    <option value="groceries">Groceries & Produce</option>
                    <option value="apparel">Apparel & Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="services">Services</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="market">Market Location *</Label>
                  <Input id="market" value={formData.market} onChange={e => setFormData({...formData, market: e.target.value})} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="desc">Business Description (Optional)</Label>
                  <Textarea id="desc" placeholder="Brief description of products/services..." className="resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-heading font-semibold border-b pb-2 flex justify-between items-center">
                Shop Location Mapping
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GPS Signal: Good</Badge>
              </h2>
              
              <div className="bg-muted rounded-xl h-64 border border-border relative overflow-hidden flex items-center justify-center">
                {/* Mock Map Canvas */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/30 rounded-full animate-ping"></div>
                    <MapPin className="h-12 w-12 text-accent relative z-10 -mt-6 drop-shadow-md" />
                  </div>
                  <span className="bg-card text-foreground text-xs font-bold px-2 py-1 rounded shadow-sm mt-2">
                    Drag pin to adjust
                  </span>
                </div>
                <Button size="icon" className="absolute bottom-4 right-4 rounded-full shadow-lg bg-card text-foreground hover:bg-muted" variant="outline">
                  <LocateFixed className="h-5 w-5 text-primary" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg border border-border">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Latitude</Label>
                  <div className="font-mono text-sm mt-1">40.7127837</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Longitude</Label>
                  <div className="font-mono text-sm mt-1">-74.0059413</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Accuracy</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[92%]"></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-600">±3m</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopNum">Shop Number / Block *</Label>
                <Input id="shopNum" value={formData.shopNumber} onChange={e => setFormData({...formData, shopNumber: e.target.value})} placeholder="e.g. Block C, Shop 42" />
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-heading font-semibold border-b pb-2">Shop Photos</h2>
              <div className="bg-accent/10 text-accent p-3 rounded-md flex items-start gap-2 text-sm border border-accent/20">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Take clear photos in good lighting. These will be reviewed by admin for approval.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'front', label: 'Front View', req: true },
                  { id: 'inside', label: 'Inside Shop', req: true },
                  { id: 'signboard', label: 'Signboard', req: true },
                  { id: 'products', label: 'Products Display', req: false },
                  { id: 'license', label: 'Business License', req: false },
                ].map(photo => (
                  <div key={photo.id} className="border border-border rounded-lg overflow-hidden bg-card flex flex-col">
                    <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                      <span className="font-medium text-sm">{photo.label} {photo.req && <span className="text-destructive">*</span>}</span>
                      {photos[photo.id] && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <div className="h-32 bg-muted/10 flex items-center justify-center relative">
                      {photos[photo.id] ? (
                         <div className="absolute inset-0 bg-primary/5 flex items-center justify-center flex-col gap-2">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Image captured</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => {
                              const newPhotos = {...photos};
                              delete newPhotos[photo.id];
                              setPhotos(newPhotos);
                            }}>Retake</Button>
                         </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8" onClick={() => setPhotos({...photos, [photo.id]: 'mock-url'})}>
                            <Camera className="h-4 w-4 mr-2" /> Capture
                          </Button>
                          <Button variant="outline" size="sm" className="h-8" onClick={() => setPhotos({...photos, [photo.id]: 'mock-url'})}>
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-heading font-semibold border-b pb-2">Additional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Operating Hours</Label>
                  <Input placeholder="e.g. Mon-Sat, 9AM - 6PM" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Employees</Label>
                  <Input type="number" placeholder="e.g. 3" />
                </div>
                <div className="space-y-2">
                  <Label>Business Registration Number (Optional)</Label>
                  <Input placeholder="Registration # if applicable" />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID (Optional)</Label>
                  <Input placeholder="Tax ID if applicable" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Accessibility & Notes</Label>
                  <Textarea placeholder="Any notes on reaching the shop, landmarks nearby..." className="resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-heading font-semibold border-b pb-2">Review & Submit</h2>
              
              <div className="bg-muted p-4 rounded-lg border border-border space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Info</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{formData.businessName || 'Not provided'}</span>
                    <span className="text-muted-foreground">Owner:</span> <span className="font-medium text-foreground">{formData.ownerName || 'Not provided'}</span>
                    <span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground">{formData.phoneNumber || 'Not provided'}</span>
                    <span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground capitalize">{formData.category || 'Not provided'}</span>
                  </div>
                </div>
                <div className="h-px bg-border w-full"></div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Market:</span> <span className="font-medium text-foreground">{formData.market || 'Not provided'}</span>
                    <span className="text-muted-foreground">Shop Num:</span> <span className="font-medium text-foreground">{formData.shopNumber || 'Not provided'}</span>
                    <span className="text-muted-foreground">GPS:</span> <span className="font-mono text-xs mt-0.5 text-foreground">40.7127, -74.0059</span>
                  </div>
                </div>
                <div className="h-px bg-border w-full"></div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Photos</h4>
                  <div className="flex gap-2">
                    <Badge variant={photos['front'] ? 'default' : 'destructive'}>Front</Badge>
                    <Badge variant={photos['inside'] ? 'default' : 'destructive'}>Inside</Badge>
                    <Badge variant={photos['signboard'] ? 'default' : 'destructive'}>Signboard</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Action Buttons Fixed to Bottom on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 sm:static sm:bg-transparent sm:border-none sm:shadow-none sm:p-0 sm:mt-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none" 
            onClick={handleBack}
            disabled={currentStep === 0 || createVendor.isPending}
          >
            Back
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button className="flex-[2] sm:flex-1" onClick={handleNext}>
              Continue to {STEPS[currentStep + 1]}
            </Button>
          ) : (
            <Button 
              className="flex-[2] sm:flex-1" 
              onClick={handleSubmit}
              disabled={createVendor.isPending}
            >
              {createVendor.isPending ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

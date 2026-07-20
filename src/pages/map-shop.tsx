import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, LocateFixed, Search, Crosshair, Navigation, Building2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MapShop() {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [address, setAddress] = useState('');

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setHasLocation(true);
      toast({
        title: "Location Acquired",
        description: "GPS accuracy is within 4 meters.",
      });
    }, 1500);
  };

  const handleConfirm = () => {
    toast({
      title: "Location Saved",
      description: "Coordinates mapped successfully.",
    });
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Map Shop Location</h1>
        <p className="text-muted-foreground mt-1">Pinpoint exact vendor locations in the market.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Map Area */}
        <Card className="lg:col-span-2 overflow-hidden border-border flex flex-col h-[500px] lg:h-auto">
          <div className="relative flex-1 bg-[#e5e3df]">
            {/* Fake Map Background */}
            <div className="absolute inset-0 opacity-40" style={{ 
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
              backgroundSize: '100px 100px' 
            }}></div>
            
            {/* Map Roads Simulation */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-1/3 w-full h-8 bg-white/60 -rotate-6 transform origin-left"></div>
               <div className="absolute left-1/2 h-full w-6 bg-white/60 rotate-12 transform origin-top"></div>
            </div>

            {/* Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <Crosshair className="h-8 w-8 text-primary/50 absolute -top-4 -left-4" strokeWidth={1} />
                <MapPin className="h-10 w-10 text-accent absolute -top-10 -left-5 drop-shadow-lg z-10" />
                {hasLocation && (
                  <div className="absolute w-32 h-32 bg-accent/20 rounded-full -top-16 -left-16 animate-ping opacity-50"></div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
              <div className="flex-1 bg-card rounded-md shadow-md flex items-center px-3 border border-border">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input 
                  type="text" 
                  placeholder="Search address or market..." 
                  className="w-full h-10 bg-transparent border-none outline-none text-sm"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-10">
              <Button size="icon" className="rounded-full shadow-lg bg-card text-foreground hover:bg-muted h-12 w-12" variant="outline" onClick={handleLocateMe}>
                <LocateFixed className={`h-6 w-6 ${isLocating ? 'animate-spin text-muted-foreground' : hasLocation ? 'text-emerald-500' : 'text-primary'}`} />
              </Button>
            </div>
            
            {hasLocation && (
              <div className="absolute bottom-6 left-4 bg-card/90 backdrop-blur text-card-foreground text-xs px-3 py-1.5 rounded shadow border border-border z-10 font-mono">
                GPS: 3 signal satellites
              </div>
            )}
          </div>
        </Card>

        {/* Details Panel */}
        <Card className="h-fit">
          <CardContent className="p-6 space-y-6">
            
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Coordinates</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">LATITUDE</div>
                  <div className="font-mono font-medium">{hasLocation ? '40.712783' : '—'}</div>
                </div>
                <div className="bg-muted p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">LONGITUDE</div>
                  <div className="font-mono font-medium">{hasLocation ? '-74.005941' : '—'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Accuracy</span>
                </div>
                {hasLocation ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">± 4 meters</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Unknown</span>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="block">Market Block / Section *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="block" className="pl-9" placeholder="e.g. Section B" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Nearby Landmark</Label>
                <Input id="landmark" placeholder="e.g. Opposite main gate" />
              </div>
            </div>

            <Button 
              className="w-full h-12 text-base font-semibold" 
              disabled={!hasLocation}
              onClick={handleConfirm}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Location
            </Button>
            {!hasLocation && (
              <p className="text-xs text-center text-muted-foreground">Tap the locate button on the map first.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

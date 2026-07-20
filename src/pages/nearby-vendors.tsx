import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Map as MapIcon, Search, SlidersHorizontal, User } from 'lucide-react';
import { useVendors } from '../hooks/use-data';
import { Badge } from '@/components/ui/badge';

export default function NearbyVendors() {
  const { data: vendors, isLoading } = useVendors();
  const [radius, setRadius] = useState('5');

  if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Nearby Vendors</h1>
          <p className="text-muted-foreground text-sm">Discover registered shops around your location.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border rounded-md px-3 py-1.5 flex items-center text-sm shadow-sm">
            <span className="text-muted-foreground mr-2">Radius:</span>
            <select 
              className="bg-transparent font-medium outline-none text-foreground"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            >
              <option value="1">1 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        {/* Map View */}
        <Card className="lg:col-span-2 border-border overflow-hidden relative shadow-md flex flex-col h-[400px] lg:h-auto">
           <div className="absolute inset-0 bg-[#f0ede6]">
              {/* Grid pattern for fake map */}
              <div className="absolute inset-0 opacity-30" style={{ 
                backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
              }}></div>
              
              {/* Mapper Location */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md z-20 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
              </div>

              {/* Vendor Pins */}
              {vendors?.map((v, i) => (
                <div 
                  key={v.id} 
                  className="absolute z-10 cursor-pointer group"
                  style={{
                    top: `${40 + (i * 15)}%`,
                    left: `${30 + (i * 20)}%`
                  }}
                >
                  <MapPin className={`h-8 w-8 -mt-8 -ml-4 drop-shadow-md transition-transform group-hover:scale-110 ${
                    v.status === 'approved' ? 'text-emerald-500' : 'text-accent'
                  }`} />
                  
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-card p-2 rounded shadow-lg border border-border text-center z-50">
                    <p className="font-bold text-xs truncate">{v.businessName}</p>
                    <p className="text-[10px] text-muted-foreground">{v.category}</p>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="absolute top-4 left-4 right-4 max-w-sm">
             <div className="bg-card rounded-md shadow-lg flex items-center px-3 border border-border">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input 
                  type="text" 
                  placeholder="Search map..." 
                  className="w-full h-10 bg-transparent border-none outline-none text-sm"
                />
             </div>
           </div>
        </Card>

        {/* List View */}
        <Card className="flex flex-col border-border shadow-md overflow-hidden h-[300px] lg:h-auto">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-heading font-semibold">Vendors in Area ({vendors?.length || 0})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {vendors?.map(vendor => (
              <div key={vendor.id} className="p-3 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{vendor.businessName}</h4>
                  <span className="text-xs text-muted-foreground font-mono">1.2km</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <User className="h-3 w-3" /> {vendor.ownerName}
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px]">
                    {vendor.category}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-primary">
                    <Navigation className="h-3 w-3 mr-1" /> Nav
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
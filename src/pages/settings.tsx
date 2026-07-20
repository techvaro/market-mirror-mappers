import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Map, Image as ImageIcon, Moon, Globe, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [offlineMode, setOfflineMode] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure app preferences for field work.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Connectivity & Sync</CardTitle>
          </div>
          <CardDescription>Manage how data is saved and uploaded in the field.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Offline Mode</Label>
              <p className="text-sm text-muted-foreground">Save data locally when network is poor.</p>
            </div>
            <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Auto-Sync on WiFi Only</Label>
              <p className="text-sm text-muted-foreground">Prevent background uploads on cellular data.</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-accent" />
            <CardTitle>Location & GPS</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Required GPS Accuracy</Label>
            <p className="text-sm text-muted-foreground mb-3">Minimum accuracy required to drop a vendor pin.</p>
            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="high">High (± 5 meters)</option>
              <option value="medium">Medium (± 15 meters)</option>
              <option value="low">Low (± 50 meters)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-500" />
            <CardTitle>Media & Uploads</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Photo Compression</Label>
            <p className="text-sm text-muted-foreground mb-3">Balance between image quality and upload speed.</p>
            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="balanced">Balanced (Recommended)</option>
              <option value="high">High Quality (Slower upload)</option>
              <option value="fast">Fast Upload (Lower quality)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Save original photos</Label>
              <p className="text-sm text-muted-foreground">Keep a copy in your device gallery.</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for new assignments.</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Approval Alerts</Label>
              <p className="text-sm text-muted-foreground">Notify when a submission is approved or rejected.</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
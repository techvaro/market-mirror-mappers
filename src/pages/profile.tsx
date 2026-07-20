import { useProfile } from '../hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, Phone, MapPin, Shield, Key } from 'lucide-react';

export default function Profile() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Mapper Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <Card className="md:col-span-1 border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                <AvatarImage src={profile?.avatarUrl} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-heading">
                  {profile?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform opacity-0 group-hover:opacity-100">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-heading font-bold">{profile?.name}</h2>
            <p className="text-muted-foreground text-sm font-medium mb-4">{profile?.employeeId}</p>
            
            <div className="w-full bg-muted rounded-lg p-3 space-y-3 text-sm text-left">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 text-accent" />
                <span className="text-foreground font-medium">{profile?.region}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                <span className="text-foreground font-medium">Field Agent Level 2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={profile?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eid">Employee ID</Label>
                  <Input id="eid" defaultValue={profile?.employeeId} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={profile?.email} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" defaultValue={profile?.phone} className="pl-9" />
                  </div>
                </div>
              </div>
              <Button className="mt-2">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Change Password</h4>
                    <p className="text-xs text-muted-foreground mt-1">Update your account password regularly.</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
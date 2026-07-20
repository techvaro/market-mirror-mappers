import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Book, HelpCircle, Phone, MessageSquare } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="text-center py-10 bg-primary rounded-xl text-primary-foreground">
        <h1 className="text-3xl font-heading font-bold mb-4">How can we help?</h1>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search guides and FAQs..." 
            className="pl-10 h-12 text-base bg-background text-foreground border-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Book className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Training Materials</h3>
              <p className="text-sm text-muted-foreground">Learn how to capture the best shop photos and ensure accurate GPS pins.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-accent/10 text-accent rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">FAQs</h3>
              <p className="text-sm text-muted-foreground">Find answers to common issues like offline syncing and rejection fixes.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border mt-8">
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Call Dispatch</h4>
                  <p className="text-sm text-primary">+1 (800) 555-0199</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Live Chat</h4>
                  <p className="text-sm text-primary">Available 8am - 6pm</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-l border-border pl-0 md:pl-8">
              <h4 className="font-semibold text-sm">Submit a Ticket</h4>
              <Input placeholder="Subject" />
              <Textarea placeholder="Describe your issue..." className="resize-none h-24" />
              <Button className="w-full">Send Message</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
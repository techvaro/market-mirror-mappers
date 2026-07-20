import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Download, FileText, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Your ${type} report is being generated and will download shortly.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate performance and coverage reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button onClick={() => handleExport('Excel')}>
            <Download className="h-4 w-4 mr-2" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="font-heading font-semibold text-lg">Daily Summary</h3>
            <p className="text-xs text-primary-foreground/80 mt-1">Today's activities</p>
            <div className="mt-4 text-3xl font-bold">12</div>
            <p className="text-xs mt-1">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-accent text-accent-foreground border-none">
          <CardContent className="p-6 text-center">
            <FileBarChart className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="font-heading font-semibold text-lg">Weekly Report</h3>
            <p className="text-xs text-accent-foreground/80 mt-1">This week's progress</p>
            <div className="mt-4 text-3xl font-bold">45</div>
            <p className="text-xs mt-1">Shops Mapped</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-600 text-white border-none">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="font-heading font-semibold text-lg">Monthly Overview</h3>
            <p className="text-xs text-emerald-100 mt-1">Current month metrics</p>
            <div className="mt-4 text-3xl font-bold">94%</div>
            <p className="text-xs mt-1">Approval Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'October Performance Review', date: 'Nov 1, 2023', size: '2.4 MB' },
              { name: 'Weekly Coverage: Downtown', date: 'Oct 28, 2023', size: '1.1 MB' },
              { name: 'Rejected Submissions Analysis', date: 'Oct 25, 2023', size: '0.8 MB' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{report.name}</h4>
                    <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
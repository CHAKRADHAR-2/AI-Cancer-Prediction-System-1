
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export function FollowUpRecommendation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Follow-up</CardTitle>
        <CardDescription>
          Routine health maintenance recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <h4 className="font-semibold">Next Check-up</h4>
            <p className="text-2xl font-bold text-green-600">12 months</p>
            <p className="text-sm text-muted-foreground">Annual wellness visit</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <h4 className="font-semibold">Visit Type</h4>
            <p className="text-lg font-semibold">Routine Screening</p>
            <p className="text-sm text-muted-foreground">General health assessment</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <h4 className="font-semibold">Urgency</h4>
            <Badge variant="secondary" className="text-lg">
              <CheckCircle className="h-4 w-4 mr-1" />
              Low
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

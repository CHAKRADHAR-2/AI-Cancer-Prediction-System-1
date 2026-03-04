import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, User, Clock, X, CheckCircle } from 'lucide-react';
import { AppointmentService, ScheduledAppointment } from '@/services/appointmentService';
import { useToast } from '@/hooks/use-toast';

export function AppointmentViewer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { toast } = useToast();

  const searchAppointments = (): void => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to view appointments",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const userAppointments = AppointmentService.getAppointmentsByPhone(phoneNumber);
    setAppointments(userAppointments);
    setLoading(false);

    if (userAppointments.length === 0) {
      toast({
        title: "No Appointments Found",
        description: "No appointments found for this phone number",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Appointments Found",
        description: `Found ${userAppointments.length} appointment(s)`,
      });
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setCancelling(appointmentId);
    try {
      const success = await AppointmentService.cancelAppointment(appointmentId);
      if (success) {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
          )
        );
        toast({
          title: "Appointment Cancelled",
          description: "Your appointment has been cancelled successfully. You will receive a confirmation email shortly.",
        });
      }
    } catch (error) {
      toast({
        title: "Cancellation Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string): void => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): void => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          View My Appointments
        </CardTitle>
        <CardDescription>
          Enter your phone number to view your scheduled appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Search Section */}
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={searchAppointments}
              disabled={loading}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Your Appointments ({appointments.length})</h4>
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{appointment.patientName}</span>
                        <Badge className={getStatusColor(appointment.status)} variant="outline">
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cancer Type: {appointment.cancerType}
                      </div>
                    </div>
                    {appointment.status === 'scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelAppointment(appointment.id)}
                        disabled={cancelling === appointment.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        {cancelling === appointment.id ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date: {formatDate(appointment.preferredDate)}</span>
                      </div>
                      {appointment.preferredTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Time: {appointment.preferredTime}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone: {appointment.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {appointment.doctorType && (
                        <div>
                          <span className="font-medium">Doctor Type:</span> {appointment.doctorType}
                        </div>
                      )}
                      {appointment.hospitalName && (
                        <div>
                          <span className="font-medium">Hospital:</span> {appointment.hospitalName}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Scheduled: {new Date(appointment.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </div>
                  )}

                  {appointment.status === 'scheduled' && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      You will receive a confirmation call within 24 hours.
                    </div>
                  )}

                  {appointment.status === 'cancelled' && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <X className="h-4 w-4 inline mr-1" />
                      This appointment has been cancelled. You should have received a cancellation confirmation email.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {appointments.length === 0 && phoneNumber && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No appointments found for this phone number.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

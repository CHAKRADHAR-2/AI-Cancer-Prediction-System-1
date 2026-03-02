import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, Eye } from 'lucide-react';
import { AppointmentRecommendation } from '@/types/healthcare';
import { AppointmentService } from '@/services/appointmentService';
import { AppointmentViewer } from '@/components/AppointmentViewer';
import { useToast } from '@/hooks/use-toast';

interface AppointmentSchedulerProps {
  recommendation: AppointmentRecommendation;
  cancerStage: 'I' | 'II' | 'III' | 'IV';
  cancerType?: string;
}

export function AppointmentScheduler({ recommendation, cancerStage, cancerType = 'General Cancer' }: AppointmentSchedulerProps) {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    doctorType: '',
    notes: ''
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [scheduledAppointment, setScheduledAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const doctorTypes = [
    'Medical Oncologist',
    'Surgical Oncologist', 
    'Radiation Oncologist',
    'Hematologist',
    'Palliative Care Specialist',
    'General Practitioner'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (field: string, value: string): void => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleAppointment = async () => {
    if (!appointmentData.patientName || !appointmentData.phone || !appointmentData.preferredDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Phone, and Preferred Date)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting appointment scheduling process...');
      
      // Save appointment using the service
      const savedAppointment = await AppointmentService.saveAppointment({
        ...appointmentData,
        cancerType: cancerType
      });

      console.log('Appointment scheduled successfully:', savedAppointment);
      
      setScheduledAppointment(savedAppointment);
      setIsScheduled(true);
      
      toast({
        title: "Appointment Scheduled Successfully!",
        description: appointmentData.email 
          ? `Your appointment has been scheduled for ${appointmentData.preferredDate}. A confirmation email has been sent to ${appointmentData.email}.`
          : `Your appointment has been scheduled for ${appointmentData.preferredDate}.`,
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string): void => {
    switch (urgency) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMinDate = (): void => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = (): void => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    return maxDate.toISOString().split('T')[0];
  };

  if (showViewer) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setShowViewer(false)}
          variant="outline"
          className="gap-2"
        >
          ← Back to Scheduler
        </Button>
        <AppointmentViewer />
      </div>
    );
  }

  if (isScheduled && scheduledAppointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Appointment Scheduled Successfully
          </CardTitle>
          <CardDescription>
            Your appointment has been scheduled. You will receive a confirmation shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Appointment Details:</h4>
            <div className="space-y-2 text-sm text-green-700">
              <p><strong>Appointment ID:</strong> {scheduledAppointment.id}</p>
              <p><strong>Patient:</strong> {scheduledAppointment.patientName}</p>
              <p><strong>Date:</strong> {scheduledAppointment.preferredDate}</p>
              <p><strong>Time:</strong> {scheduledAppointment.preferredTime || 'To be confirmed'}</p>
              <p><strong>Doctor Type:</strong> {scheduledAppointment.doctorType || 'To be assigned'}</p>
              <p><strong>Contact:</strong> {scheduledAppointment.phone}</p>
              <p><strong>Cancer Type:</strong> {scheduledAppointment.cancerType}</p>
              {scheduledAppointment.email && <p><strong>Email:</strong> {scheduledAppointment.email}</p>}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You will receive a confirmation call within 24 hours</li>
              <li>• Bring all relevant medical records and test reports</li>
              <li>• Arrive 15 minutes early for registration</li>
              <li>• Prepare a list of current medications</li>
              <li>• Save your Appointment ID: <strong>{scheduledAppointment.id}</strong></li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setIsScheduled(false)}
              variant="outline"
              className="flex-1"
            >
              Schedule Another Appointment
            </Button>
            <Button 
              onClick={() => setShowViewer(true)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              View All Appointments
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule Medical Appointment
        </CardTitle>
        <CardDescription>
          Based on your cancer stage ({cancerStage}), we recommend scheduling appointments {recommendation.frequency.toLowerCase()}
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Button 
            onClick={() => setShowViewer(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View My Appointments
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Recommendation Summary */}
        <div className={`border rounded-lg p-4 ${getUrgencyColor(recommendation.urgency)}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Recommended Schedule</h4>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-current bg-opacity-20">
              {recommendation.urgency} Priority
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>Frequency:</strong> {recommendation.frequency}</p>
            <p><strong>Next Visit:</strong> {recommendation.nextVisit}</p>
            <p><strong>Visit Type:</strong> {recommendation.visitType}</p>
          </div>
        </div>

        {/* Appointment Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                placeholder="Enter full name"
                value={appointmentData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={appointmentData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={appointmentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorType">Preferred Doctor Type</Label>
              <Select onValueChange={(value) => handleInputChange('doctorType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor type" />
                </SelectTrigger>
                <SelectContent>
                  {doctorTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input
                id="preferredDate"
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                value={appointmentData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific concerns, symptoms, or requirements..."
              value={appointmentData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Important Information:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Appointments are subject to doctor availability</li>
            <li>• You will receive confirmation within 24-48 hours</li>
            <li>• Please bring all relevant medical documents</li>
            <li>• Cancellation should be done 24 hours in advance</li>
            <li>• Save your phone number to view appointments later</li>
          </ul>
        </div>

        <Button 
          onClick={handleScheduleAppointment}
          className="w-full gap-2"
          size="lg"
        >
          <Clock className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </CardContent>
    </Card>
  );
}

import { supabase } from '@/integrations/supabase/client';

export interface ScheduledAppointment {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime?: string;
  doctorType?: string;
  notes?: string;
  cancerType: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  createdAt: string;
  hospitalName?: string;
  doctorName?: string;
  hospitalId?: string;
  doctorId?: string;
}

export class AppointmentService {
  private static STORAGE_KEY = 'scheduled_appointments';

  static async saveAppointment(appointment: Omit<ScheduledAppointment, 'id' | 'createdAt' | 'status'>): Promise<ScheduledAppointment> {
    const newAppointment: ScheduledAppointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    // Save to localStorage
    const existingAppointments = this.getAppointments();
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAppointments));
    
    // Send confirmation email if email is provided
    if (newAppointment.email) {
      try {
        console.log('Attempting to send confirmation email to:', newAppointment.email);
        await this.sendConfirmationEmail(newAppointment);
        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't fail the appointment creation if email fails
      }
    } else {
      console.log('No email provided, skipping email confirmation');
    }
    
    console.log('Appointment saved:', newAppointment);
    return newAppointment;
  }

  private static async sendConfirmationEmail(appointment: ScheduledAppointment): Promise<void> {
    console.log('Preparing email data for appointment:', appointment.id);
    
    const emailData = {
      patientName: appointment.patientName,
      email: appointment.email,
      phone: appointment.phone,
      appointmentDate: appointment.preferredDate,
      appointmentTime: appointment.preferredTime,
      doctorName: appointment.doctorName,
      hospitalName: appointment.hospitalName,
      cancerType: appointment.cancerType,
      appointmentId: appointment.id
    };

    console.log('Calling Supabase edge function with data:', emailData);

    const { data, error } = await supabase.functions.invoke('send-appointment-confirmation', {
      body: emailData
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    console.log('Email function response:', data);
    return data;
  }

  private static async sendCancellationEmail(appointment: ScheduledAppointment): Promise<void> {
    const emailData = {
      patientName: appointment.patientName,
      email: appointment.email,
      phone: appointment.phone,
      appointmentDate: appointment.preferredDate,
      appointmentTime: appointment.preferredTime,
      doctorName: appointment.doctorName,
      hospitalName: appointment.hospitalName,
      cancerType: appointment.cancerType,
      appointmentId: appointment.id
    };

    const { data, error } = await supabase.functions.invoke('send-appointment-cancellation', {
      body: emailData
    });

    if (error) {
      throw new Error(`Failed to send cancellation email: ${error.message}`);
    }

    return data;
  }

  static getAppointments(): ScheduledAppointment[] {
    try {
      const appointments = localStorage.getItem(this.STORAGE_KEY);
      return appointments ? JSON.parse(appointments) : [];
    } catch (error) {
      console.error('Error loading appointments:', error);
      return [];
    }
  }

  static getAppointmentsByPhone(phone: string): ScheduledAppointment[] {
    const allAppointments = this.getAppointments();
    return allAppointments.filter(apt => apt.phone === phone);
  }

  static updateAppointmentStatus(appointmentId: string, status: ScheduledAppointment['status']): boolean {
    const appointments = this.getAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      appointments[appointmentIndex].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
      return true;
    }
    
    return false;
  }

  static async cancelAppointment(appointmentId: string): Promise<boolean> {
    const appointments = this.getAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      const appointment = appointments[appointmentIndex];
      
      // Update status to cancelled
      appointments[appointmentIndex].status = 'cancelled';
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
      
      // Send cancellation email if email is provided
      if (appointment.email) {
        try {
          await this.sendCancellationEmail(appointment);
          console.log('Cancellation email sent successfully');
        } catch (error) {
          console.error('Failed to send cancellation email:', error);
          // Don't fail the cancellation if email fails
        }
      }
      
      return true;
    }
    
    return false;
  }
}

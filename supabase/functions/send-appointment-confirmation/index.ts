
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentConfirmationRequest {
  patientName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime?: string;
  doctorName?: string;
  hospitalName?: string;
  cancerType: string;
  appointmentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appointmentData: AppointmentConfirmationRequest = await req.json();
    
    console.log("Sending appointment confirmation email to:", appointmentData.email);

    const emailResponse = await resend.emails.send({
      from: "AI Cancer Prediction System <noreply@yourdomain.com>", // Replace yourdomain.com with your verified domain
      to: [appointmentData.email],
      subject: "Appointment Confirmation - AI Cancer Prediction System",
      html: generateAppointmentConfirmationEmail(appointmentData),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateAppointmentConfirmationEmail(data: AppointmentConfirmationRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .important-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 Appointment Confirmed</h1>
                <p>AI Cancer Prediction System</p>
            </div>
            
            <div class="content">
                <p>Dear <strong>${data.patientName}</strong>,</p>
                
                <p>Your appointment has been successfully scheduled. Please find the details below:</p>
                
                <div class="appointment-details">
                    <h3 style="margin-top: 0; color: #667eea;">📋 Appointment Details</h3>
                    
                    <div class="detail-row">
                        <span class="label">Appointment ID:</span>
                        <span class="value">${data.appointmentId}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Patient Name:</span>
                        <span class="value">${data.patientName}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Phone Number:</span>
                        <span class="value">${data.phone}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span class="value">${new Date(data.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                    </div>
                    
                    ${data.appointmentTime ? `
                    <div class="detail-row">
                        <span class="label">Time:</span>
                        <span class="value">${data.appointmentTime}</span>
                    </div>
                    ` : ''}
                    
                    ${data.hospitalName ? `
                    <div class="detail-row">
                        <span class="label">Hospital:</span>
                        <span class="value">${data.hospitalName}</span>
                    </div>
                    ` : ''}
                    
                    ${data.doctorName ? `
                    <div class="detail-row">
                        <span class="label">Doctor:</span>
                        <span class="value">${data.doctorName}</span>
                    </div>
                    ` : ''}
                    
                    <div class="detail-row">
                        <span class="label">Specialization:</span>
                        <span class="value">${data.cancerType} Specialist</span>
                    </div>
                </div>
                
                <div class="important-note">
                    <h4 style="margin-top: 0;">⚠️ Important Reminders:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Please arrive 15 minutes before your scheduled appointment time</li>
                        <li>Bring a valid government-issued photo ID</li>
                        <li>Carry all your previous medical records and reports</li>
                        <li>Bring your current medication list</li>
                        <li>If you need to reschedule, please contact the hospital at least 24 hours in advance</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p><strong>Need to make changes?</strong></p>
                    <p>Contact the hospital directly or call our support team.</p>
                </div>
                
                <div class="footer">
                    <p><strong>AI Cancer Prediction System</strong></p>
                    <p>This is an automated confirmation email. Please do not reply to this email.</p>
                    <p>For any queries, please contact the respective hospital directly.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        <em>Disclaimer: This system provides AI-based predictions for educational purposes. 
                        Always consult with qualified healthcare professionals for medical decisions.</em>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(handler);

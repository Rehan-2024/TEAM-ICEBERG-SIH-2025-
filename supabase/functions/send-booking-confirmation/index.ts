// supabase/functions/send-booking-confirmation/index.ts
import { corsHeaders } from '../_shared/cors.ts'

// Get your Twilio credentials from Supabase Secrets
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { appointment_details, contact_phone } = await req.json()
    if (!contact_phone) throw new Error("Contact phone is required.")
    if (!appointment_details) throw new Error("Appointment details are required.")
    
    // --- THIS IS THE FIX ---
    // Automatically format the phone number to E.164 for India
    let formattedPhoneNumber = contact_phone.trim();
    if (!formattedPhoneNumber.startsWith('+')) {
      if (formattedPhoneNumber.length === 10) {
        formattedPhoneNumber = `+91${formattedPhoneNumber}`;
      } else {
        // Handle cases where the number might already have 91 but no +
        formattedPhoneNumber = `+${formattedPhoneNumber}`;
      }
    }
    
    // Format the confirmation message
    const smsMessage = `Namaste! Your Ayusutra booking for ${appointment_details.therapy_name} on ${new Date(appointment_details.appointment_date).toLocaleDateString('en-IN')} is confirmed. We look forward to seeing you.`;
    
    // Prepare the request to Twilio's API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: { 
        'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`), 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      // Use the newly formatted phone number
      body: new URLSearchParams({ To: formattedPhoneNumber, From: twilioPhoneNumber, Body: smsMessage }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Twilio SMS Error: ${errorBody}`);
    }

    return new Response(JSON.stringify({ message: 'SMS Confirmation sent!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    })
  }
})


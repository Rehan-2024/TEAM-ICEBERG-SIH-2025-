// File: supabase/functions/get-booked-slots/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the doctor_id and selected_date from the request
    const { doctor_id, selected_date } = await req.json()
    if (!doctor_id || !selected_date) {
      throw new Error("Doctor ID and selected date are required.")
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Calculate the start and end of the selected day
    const startDate = new Date(selected_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(selected_date);
    endDate.setHours(23, 59, 59, 999);

    // Query the appointments table
    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select('appointment_date')
      .eq('doctor_id', doctor_id)
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())

    if (error) throw error

    // Extract just the time part (e.g., "09:00") from each appointment
    const bookedSlots = appointments.map(appt => {
      const date = new Date(appt.appointment_date);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    return new Response(JSON.stringify({ bookedSlots }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
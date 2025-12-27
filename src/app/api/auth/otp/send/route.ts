import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'Email service is not configured. Please contact administrator or set RESEND_API_KEY.' 
      }, { status: 500 });
    }

    // Rate limiting: Check if an OTP was sent in the last 60 seconds
    const { data: lastOtp } = await supabaseAdmin
      .from('user_otps')
      .select('created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastOtp) {
      const lastSent = new Date(lastOtp.created_at).getTime();
      const now = Date.now();
      if (now - lastSent < 60 * 1000) {
        return NextResponse.json({ 
          error: 'Please wait 60 seconds before requesting another code.' 
        }, { status: 429 });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    const { error: dbError } = await supabaseAdmin
      .from('user_otps')
      .insert([
        { email, code: otp, expires_at: expiresAt.toISOString() }
      ]);

    if (dbError) throw dbError;

    // Send via Resend
    const { data, error: mailError } = await resend.emails.send({
      from: 'Five + One <auth@updates.fiveplusone.vn>',
      to: [email],
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="font-size: 16px; color: #666; text-align: center;">Your verification code is:</p>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
            This code will expire in 10 minutes. If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    if (mailError) {
      console.error('Resend Error:', mailError);
      // Fallback: If Resend fails because of domain not verified, try sending from resend.dev
      const { error: fallbackError } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
      });
      if (fallbackError) throw fallbackError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

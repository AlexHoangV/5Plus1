import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // 1. Verify OTP from our database
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('user_otps')
      .select('*')
      .eq('email', email)
      .eq('code', otp)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // 2. OTP is valid, generate a Supabase Magic Link to sign the user in
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${new URL(request.url).origin}/auth/callback`,
      }
    });

    if (authError) throw authError;

    // 3. Delete the used OTP
    await supabaseAdmin.from('user_otps').delete().eq('id', otpData.id);

    // 4. Return the magic link to the frontend
    return NextResponse.json({ 
      success: true, 
      action_link: authData.properties.action_link 
    });
  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase connection failed',
      },
      { status: 500 }
    );
  }
}

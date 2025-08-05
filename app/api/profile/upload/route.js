import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuid } from 'uuid';

export async function POST(req) {
  const form = await req.formData();
  const file = form.get('file');
  const userId = form.get('userId');   // pass this from client

  if (!file || !userId) {
    return NextResponse.json({ error: 'file and userId required' }, { status: 400 });
  }

  const filename = `${uuid()}.pdf`;
  const { error } = await supabase.storage
    .from('resumes')
    .upload(filename, file, { contentType: 'application/pdf' });

  if (error) return NextResponse.json({ error }, { status: 500 });

  /* kick off parsing (next step) */
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/parse`, {
    method: 'POST',
    body: JSON.stringify({ userId, filename }),
    headers: { 'Content-Type': 'application/json' },
  });

  return NextResponse.json({ path: filename });
} 
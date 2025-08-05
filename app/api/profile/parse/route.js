import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// tell pdfjs where the worker lives
GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${require('pdfjs-dist/package.json').version}/build/pdf.worker.js`;

export async function POST(req) {
  const { userId, filename } = await req.json();

  // 1. download the PDF to tmp
  const { data: signed } = supabaseAdmin.storage.from('resumes').getPublicUrl(filename, {
    expiresIn: 60,
  });
  const pdfArrayBuffer = await fetch(signed.publicUrl).then(r => r.arrayBuffer());

  // 2. extract text
  const pdf = await getDocument({ data: pdfArrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const { items } = await page.getTextContent();
    text += items.map((it) => it.str).join(' ') + '\n';
  }

  // 3. naive section split (improve later)
  const resumeJson = { raw: text };

  // 4. upsert into profiles
  await supabaseAdmin.from('profiles')
    .update({ resume_json: resumeJson, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return NextResponse.json({ ok: true });
} 
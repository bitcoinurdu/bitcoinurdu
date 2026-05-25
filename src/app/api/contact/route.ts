import { NextResponse } from 'next/server';

const EMAIL_MAP: Record<string, string> = {
  ads: 'ads@bitcoinurdu.com',
  contact: 'contact@bitcoinurdu.com',
  info: 'info@bitcoinurdu.com',
  legal: 'legal@bitcoinurdu.com',
  support: 'support@bitcoinurdu.com',
  feedback: 'feedback@bitcoinurdu.com',
  jobs: 'jobs@bitcoinurdu.com',
  partnerships: 'partnerships@bitcoinurdu.com',
};

const SUBJECT_MAP: Record<string, string> = {
  ads: 'Ad Inquiry',
  contact: 'Contact Form',
  info: 'General Inquiry',
  legal: 'Legal Inquiry',
  support: 'Support Request',
  feedback: 'User Feedback',
  jobs: 'Job Application',
  partnerships: 'Partnership Inquiry',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, subject, message, package: pkg, duration, website } = body;

    const formType = (type as string) || 'contact';
    const toEmail = EMAIL_MAP[formType] || EMAIL_MAP.contact;
    const emailSubject = subject || `${SUBJECT_MAP[formType] || 'Form Submission'} from ${name}`;

    const emailBody = `
New ${SUBJECT_MAP[formType] || 'Form'} Submission
================================================

To: ${toEmail}
From: ${name} <${email}>
Subject: ${emailSubject}

${pkg ? `Package: ${pkg}\n` : ''}${duration ? `Duration: ${duration} months\n` : ''}${website ? `Website: ${website}\n` : ''}
Message:
${message}

================================================
Sent from BitcoinUrdu.com
Timestamp: ${new Date().toISOString()}
    `.trim();

    return NextResponse.json({
      success: true,
      message: 'Form submission received',
      data: {
        type: formType,
        toEmail,
        name,
        email,
        subject: emailSubject,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process form' },
      { status: 500 }
    );
  }
}

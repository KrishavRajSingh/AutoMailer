import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1 } from 'googleapis/build/src/apis/gmail';
import dotenv from 'dotenv';
import { Base64 } from 'js-base64';

dotenv.config();

const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
  };
  
const oAuth2Client = new OAuth2Client(
credentials.client_id,
credentials.client_secret,
credentials.redirect_uri
);
export const getGoogleAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
  });
};

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code);
  
  oAuth2Client.setCredentials(tokens);
  return tokens;
};

export const fetchEmails = async (): Promise<gmail_v1.Schema$Message[]> => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread', maxResults: 5});
  return res.data.messages || [];
};

export const getEmailContent = async (messageId: string ): Promise<{subject: string, from: string, body: string}> => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const res = await gmail.users.messages.get({ userId: 'me', id: messageId });
  // const snippet = res.data.snippet || '';
  const payload = res.data.payload || {};
  const headers = payload.headers || [];
  const fromHeader = headers.find((header) => header.name === 'From');
  // const from = fromHeader && fromHeader.value ? parseSenderName(fromHeader.value) : '';
  const subjectHeader = headers.find((header: any) => header.name === 'Subject');
  const subject = subjectHeader && subjectHeader.value ? subjectHeader.value : '';
  const body = getBody(payload);

  return {
    subject: subject,
    from: fromHeader?.value || '',
    body: body,
  };
};

function getBody(payload: gmail_v1.Schema$MessagePart): string {
  let body = '';
  
  const parts = payload.parts || [];
  
  if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  } else {
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        break;
      }
    }
  }
  
  if (!body) {
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        break;
      }
    }
  }

  return body;
}

export const sendEmail = async ({ to, subject, body }: { to: string, subject: string, body: string })  => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  if (!to) {
    console.error('Recipient address is required');
    return;
  }
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    `${body}`
  ].join('\n');

    const encodedMessage = Base64.encodeURI(raw);

        console.log('ab toh bheja gya', to);
        
        try {
          await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
              raw: encodedMessage,
            }
          });
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }
};
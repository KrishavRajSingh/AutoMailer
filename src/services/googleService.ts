import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1 } from 'googleapis/build/src/apis/gmail';
import dotenv from 'dotenv';

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
  const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
  return res.data.messages || [];
};

export const getEmailContent = async (messageId: string ): Promise<string> => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const res = await gmail.users.messages.get({ userId: 'me', id: messageId });
  return res.data.snippet || '';
};

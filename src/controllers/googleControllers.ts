import express from 'express';
import { getGoogleAuthUrl, getGoogleTokens } from '../services/googleService';

export const googleAuthRouter = express.Router();

// Endpoint to initiate OAuth flow
googleAuthRouter.get('/', (req, res) => {
  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl);
});

// Callback endpoint for Google OAuth
googleAuthRouter.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).send('Invalid authorization code');
  }

  try {
    const tokens = await getGoogleTokens(code);
    // Optionally, save tokens to database or session
    res.redirect('/email');
  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    res.status(500).send('Failed to obtain tokens');
  }
});

export default googleAuthRouter;


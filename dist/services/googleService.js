"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.getEmailContent = exports.fetchEmails = exports.getGoogleTokens = exports.getGoogleAuthUrl = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
const js_base64_1 = require("js-base64");
dotenv_1.default.config();
const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
};
const oAuth2Client = new google_auth_library_1.OAuth2Client(credentials.client_id, credentials.client_secret, credentials.redirect_uri);
const getGoogleAuthUrl = () => {
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
    });
};
exports.getGoogleAuthUrl = getGoogleAuthUrl;
const getGoogleTokens = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokens } = yield oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
});
exports.getGoogleTokens = getGoogleTokens;
const fetchEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
    const res = yield gmail.users.messages.list({ userId: 'me', q: 'is:unread', maxResults: 5 });
    return res.data.messages || [];
});
exports.fetchEmails = fetchEmails;
const getEmailContent = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
    const res = yield gmail.users.messages.get({ userId: 'me', id: messageId });
    // const snippet = res.data.snippet || '';
    const payload = res.data.payload || {};
    const headers = payload.headers || [];
    const fromHeader = headers.find((header) => header.name === 'From');
    // const from = fromHeader && fromHeader.value ? parseSenderName(fromHeader.value) : '';
    const subjectHeader = headers.find((header) => header.name === 'Subject');
    const subject = subjectHeader && subjectHeader.value ? subjectHeader.value : '';
    const body = getBody(payload);
    return {
        subject: subject,
        from: (fromHeader === null || fromHeader === void 0 ? void 0 : fromHeader.value) || '',
        body: body,
    };
});
exports.getEmailContent = getEmailContent;
function getBody(payload) {
    let body = '';
    const parts = payload.parts || [];
    if (payload.body && payload.body.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }
    else {
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
function parseSenderName(fromHeader) {
    // Extract sender's name from the "From" header
    const match = fromHeader.match(/"([^"]+)"/);
    return match ? match[1] : fromHeader.split('<')[0].trim(); // Extracted name without surrounding quotes or use the email itself
}
const sendEmail = ({ to, subject, body }) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
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
    const encodedMessage = js_base64_1.Base64.encodeURI(raw);
    console.log('ab toh bheja gya', to);
    try {
        yield gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            }
        });
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.sendEmail = sendEmail;

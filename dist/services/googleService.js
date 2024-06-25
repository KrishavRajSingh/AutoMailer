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
exports.getEmailContent = exports.fetchEmails = exports.getGoogleTokens = exports.getGoogleAuthUrl = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
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
    const res = yield gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
    return res.data.messages || [];
});
exports.fetchEmails = fetchEmails;
const getEmailContent = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
    const res = yield gmail.users.messages.get({ userId: 'me', id: messageId });
    return res.data.snippet || '';
});
exports.getEmailContent = getEmailContent;

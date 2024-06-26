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
exports.googleAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const googleService_1 = require("../services/googleService");
exports.googleAuthRouter = express_1.default.Router();
// Endpoint to initiate OAuth flow
exports.googleAuthRouter.get('/', (req, res) => {
    const authUrl = (0, googleService_1.getGoogleAuthUrl)();
    res.redirect(authUrl);
});
// Callback endpoint for Google OAuth
exports.googleAuthRouter.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
        return res.status(400).send('Invalid authorization code');
    }
    try {
        const tokens = yield (0, googleService_1.getGoogleTokens)(code);
        // Optionally, save tokens to database or session
        res.redirect('/email');
    }
    catch (err) {
        console.error('Error exchanging code for tokens:', err);
        res.status(500).send('Failed to obtain tokens');
    }
}));
exports.default = exports.googleAuthRouter;
// https://accounts.google.com/signin/oauth/v2/consentsummary?authuser=0&part=AJi8hAMxs4tdUTQRYxsJExKtzD9xb4WH2Y0MSx5tGUEa8Kn4Zv5mI12pymKC4j7f2h7mX3jr4cd4jTMWjo5WF6gVF5BM7ohPh_-yQC8paFrwNbJG2lMmQOymVXRoWAxO57J6DLAJXMUvvOzphynNmSuFvJSgWtls5RplDtp4cqRpvky-vOtG2Xse0okzR01B4yppU6xPCCaHqi7LAeM3bhXSebLAuzf7S0RpbRdE7jhECTYN7f-AxZPbSyZZNzjP9iWejosxMan3G5frYOTjvCX8c9MhbKQsxqzJATH6Ktj9yFlsQx0QjpB8FD7-O3cL8aFIkLsVWQv876wQa7PSHE5UpBtC805ZNyCLbLxErcDy-UMnOhqvbIuvSRA73VGH4_vK6ga8m3RBbaQsZHfzdd_BTgHBn9nh1ZGE_ISyQEkRdD6fiwdKPXfZdS5FUeYFFQKfX7mnvaU7OY8oaUunxy5_0jXdi36jFw&flowName=GeneralOAuthFlow&as=S-1291649990%3A1719333151519117&client_id=660951601495-kir7jpi1ciup60528l0bet3a4itt9lt8.apps.googleusercontent.com&pli=1&rapt=AEjHL4OWzs-8DFFm_C9CySpp6x_rObGJWM-q8k89Uoqmz2LnxvNgCcKjmyUQPfWkziwUzzYypq6pEOVAN_WNYZooHTJQa4dIZw

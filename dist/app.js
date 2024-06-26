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
const express_1 = __importDefault(require("express"));
const googleControllers_1 = __importDefault(require("./controllers/googleControllers"));
const googleService_1 = require("./services/googleService");
const emailQueue_1 = require("./queues/emailQueue");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth/google', googleControllers_1.default);
app.get('/', (req, res) => {
    res.send('Email Automation Tool API');
});
app.get('/email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emails = yield (0, googleService_1.fetchEmails)();
    // emails.forEach(async(email)=>{
    //     if(email.id)
    //     console.log(await getEmailContent(email.id))})
    console.log(emails);
    (0, emailQueue_1.processQueue)();
    res.send(`Auth successful! You can now use this account. ${emails}`);
}));
// emailQueue.add('fetchEmails', {}, {repeat: {every: 60000}});
app.listen(3000, () => {
    console.log('sun rha hun mai');
});

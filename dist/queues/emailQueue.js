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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQueue = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const googleService_1 = require("../services/googleService");
const geminiService_1 = require("../services/geminiService");
const connection = {
    host: '127.0.0.1',
    port: 6379
};
exports.emailQueue = new bullmq_1.Queue('emailQueue', { connection });
exports.emailQueue.drain();
exports.emailQueue.add('fetchEmails', {}, { repeat: { every: 60000 } });
// emailQueue.process('fetchEmails', async (job) => {
//     const emails = await fetchEmails();
//     for (const email of emails) {
//         emailQueue.add('processEmail', { messageId: email.id });
//     }
// })
const processQueue = () => {
    new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
        // This is where the processing logic happens
        if (job.name === 'fetchEmails') {
            const emails = yield (0, googleService_1.fetchEmails)();
            if (emails) {
                for (const email of emails) {
                    if (email.id) {
                        exports.emailQueue.add('processEmail', { messageId: email.id });
                    }
                }
            }
        }
        else if (job.name === 'processEmail') {
            const { messageId } = job.data;
            const emailContent = yield (0, googleService_1.getEmailContent)(messageId);
            // console.log(emailContent);
            const { label, response } = yield (0, geminiService_1.analyseEmailContent)(emailContent);
            console.log('msttt', label, response);
            if (['Interested', 'More information'].includes(label)) {
                yield (0, googleService_1.sendEmail)({
                    to: emailContent.from,
                    subject: `Re: ${emailContent.subject}`,
                    body: response
                });
            }
        }
    }), { connection });
};
exports.processQueue = processQueue;

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
const bullmq_1 = require("bullmq");
const emailQueue = new bullmq_1.Queue('emailQueue');
emailQueue.add('fetchEmails', {}, { repeat: { every: 60000 } });
// emailQueue.process('fetchEmails', async (job) => {
//     const emails = await fetchEmails();
//     for (const email of emails) {
//         emailQueue.add('processEmail', { messageId: email.id });
//     }
// })
new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    // This is where the processing logic happens
    console.log(job, 'job');
}));

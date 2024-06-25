import { Queue, Worker } from 'bullmq';
import { fetchEmails } from "../services/googleService";

export const emailQueue = new Queue('emailQueue');

emailQueue.add('fetchEmails', {}, {repeat: {every: 60000}});

// emailQueue.process('fetchEmails', async (job) => {
//     const emails = await fetchEmails();
//     for (const email of emails) {
//         emailQueue.add('processEmail', { messageId: email.id });
//     }
// })

export const processEmailQueue = () => {
    new Worker('emailQueue', async job => {
      // This is where the processing logic happens
      console.log(job, 'job');
    });
  };
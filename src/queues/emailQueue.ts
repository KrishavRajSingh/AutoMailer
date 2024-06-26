import { Queue, Worker } from 'bullmq';
import { fetchEmails, getEmailContent, sendEmail } from "../services/googleService";
import { analyseEmailContent, generateReply } from '../services/geminiService';


const connection = {
  host: '127.0.0.1',
  port: 6379
}
export const emailQueue = new Queue('emailQueue', {connection});
emailQueue.drain();
emailQueue.add('fetchEmails', {}, {repeat: {every: 60000}});
// emailQueue.process('fetchEmails', async (job) => {
//     const emails = await fetchEmails();
//     for (const email of emails) {
//         emailQueue.add('processEmail', { messageId: email.id });
//     }
// })



export const processQueue = () => {
    new Worker('emailQueue', async job => {
      // This is where the processing logic happens
      if(job.name === 'fetchEmails'){
        const emails = await fetchEmails();
        if(emails){
          for(const email of emails){
            if(email.id){
              emailQueue.add('processEmail', {messageId: email.id});
            }
          }
        }
      } else if (job.name === 'processEmail') {
        const { messageId } = job.data;
        const emailContent = await getEmailContent(messageId);
        // console.log(emailContent);
        
        const {label, response} = await analyseEmailContent(emailContent);
        console.log('msttt', label, response);
        if(['Interested', 'More information'].includes(label)){
          await sendEmail({
            to: emailContent.from,
            subject: `Re: ${emailContent.subject}`,
            body: response
          });
        }
      }
    }, { connection });
}

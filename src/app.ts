import express from 'express';
import googleAuthRouter from './controllers/googleControllers';
import { fetchEmails, getEmailContent } from './services/googleService';
// import { processEmailQueue } from './queues/emailQueue';

const app = express();
app.use(express.json());

app.use('/auth/google', googleAuthRouter);

app.get('/', (req, res) => {
    res.send('Email Automation Tool API');
});
app.get('/email', async (req, res) => {
    const emails = await fetchEmails();
    emails.forEach(async(email)=>{
        if(email.id)
        console.log(await getEmailContent(email.id))})
    res.send(emails);
})
// processEmailQueue();

app.listen(3000, () => {
    console.log('sun rha hun mai');
})
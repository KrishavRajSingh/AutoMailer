import express from 'express';
import googleAuthRouter from './controllers/googleControllers';
import { processQueue } from './queues/emailQueue';

const app = express();
app.use(express.json());

app.use('/auth/google', googleAuthRouter);

app.get('/', (req, res) => {
    res.send('Email Automation Tool API');
});
app.get('/email', async (req, res) => {
    
    processQueue();
    res.send(`Auth successful! You can now use this account.`);
})
// emailQueue.add('fetchEmails', {}, {repeat: {every: 60000}});

app.listen(3000, () => {
    console.log('started listening, go to http://localhost:3000/auth/google');
})
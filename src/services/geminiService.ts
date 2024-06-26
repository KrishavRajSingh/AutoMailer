import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI('AIzaSyC_z71ggJH3pfVJ4JqBVrSIuoa2DceOJFE' || '');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const context = `Introducing ReachInbox - A revolutionary AI-driven platform transforming cold outreach. It's an all-in-one
solution for businesses to effortlessly find, enrich, and engage high-intent leads using multi-channel outreach
across Twitter, LinkedIn, email, and phone. Just a single prompt sets ReachInbox in motion, prospecting and
verifying leads, crafting personalized sequences, and alerting businesses to responsive prospects. Imagine an
AI-powered growth team, ceaselessly generating top-tier leads. ReachInbox is not just a tool; it's your growth
partner.
One of the most important aspects of ReachInbox is its ability to enhance and manage large scale cold email
marketing campaigns. Cold emailing can be a challenging endeavor, but with Reachinbox, it doesn't have to be.
Our intuitive platform provides everything you need to launch successful cold email campaigns, from
customizable templates and A/B testing to real-time analytics and performance tracking.`;

export async function analyseEmailContent(emailContent: {subject: string, from: string, body: string}): Promise<{label: string, response: string}> {
    try {
        
        const result = await model.generateContent(`
            ${context}    
            Categorizing the email based on the content and assign a label as follows -
                Interested- if the email shows interest or is related to our product,
                Not Interested- if the email does not show interest in our product,
                More information
            and suggest an appropriate response based on the content of the email. For example -
            a. If the email mentions they are interested to know more, your reply should ask them if they
            are willing to hop on to a demo call by suggesting a time.
            
            This mails are to be directly send to our clients, so make sure there are no variables. You can use ReachInbox Team as sender.
            subject: ${emailContent.subject}
            body: ${emailContent.body}
            from: ${emailContent.from}
            You must send response in this json format {label, response} and don't use new line in response
        `)
        const responseText = await result.response.text();
        const jsonResponseMatch = responseText.match(/\{.*\}/s);
        if (!jsonResponseMatch) {
            throw new Error('Invalid JSON response');
        }

        const jsonResponse = jsonResponseMatch[0];
        console.log(jsonResponse);
        
        const parsedResponse = JSON.parse(jsonResponse);
        
        const { label, response } = parsedResponse;

        return { label, response };
    } catch (error) {
      console.error('Error analyzing email context:', error);
      throw error;
    }
}

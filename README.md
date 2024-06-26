# AutoMailer
AutoEmail is an Express.js application designed to automate email handling using OAuth authentication for Google and Microsoft Outlook. This application allows users to authenticate via Google, read unread emails, analyze email content using gemini, and send automated responses based on the content of the emails.

# Features
- OAuth authentication with Google and Microsoft Outlook.
- Fetch unread emails.
- Analyze email content, categorize it and generate respponse using gemini.
- Send automated email responses based on the email content.
- Mark emails as read after responding.

# Installation
Clone the repo
```
git clone https://github.com/KrishavRajSingh/AutoMailer.git
```
Install dependencies
```
cd AutoMailer
npm i
```
Copy the contents from .env.example and paste in .env file in the root directory 
```
cp .env.example .env
```

Add your Google credentials:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GEMINI_API_KEY=your-gemini-api-key
```
Start redis server on port 6379
```
docker run -itd -p 6379:6379 redis
```

Start the server and go to http://localhost:3000/auth/google
```
npm run start
```

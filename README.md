# AutoMailer
AutoEmail is an Express.js application designed to automate email handling using OAuth authentication for Google. This application allows users to authenticate via Google, read unread emails, analyze email content using Gemini, and send automated responses based on the content of the emails.



https://github.com/user-attachments/assets/8dbb3cfa-e43c-45f3-8282-27cb0c095b7a



# Features
- OAuth authentication with Google.
- Fetch unread emails.
- Analyze email content, categorize it and generate responses using Gemini.
- Send automated email responses based on the email content.
- Mark emails as read after responding.
- Job queue management using BullMQ.
  
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
Copy the contents from the .env.example and paste into the .env file
```
cp .env.example .env
```

Add your Google credentials:
Start the Redis server on port 6379
```
docker run -itd -p 6379:6379 redis
```

Start the server and go to http://localhost:3000/auth/google
```
npm run start
```

# Dependencies
- Express.js
- BullMQ
- Redis
- Gemini API

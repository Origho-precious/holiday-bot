## Holiday bot
An app that sends holiday notices every friday for public holidays that fall between monday and friday the coming week.

## How to run this locally
- You need to create a `.env` file with below values:
```
PORT=
NODE_ENV=
MONGODB_URI=

GOOGLE_CALENDAR_API_KEY=

MAILTRAP_TOKEN=
MAILTRAP_SENDER_EMAIL=
MAILTRAP_API_ENDPOINT=

SLACK_VERIFICATION_TOKEN=
SLACK_TOKEN=
```

This app uses [mailtrap.io](https://mailtrap.io/) for sending email notices and also has a slack bot for sending notices to the channels it's connected to. 


NOTE: For now it is scoped to only send notices for Nigerian public holidays and I will be extending it to have worldwide coverage soon but you can change it to your desired country by updating the country region in `src/constants/index.ts`.

I will properly document this after making more progress on the build. For now it just send notices via email to recipients I specify and to a slack channel I connected it to. 

Also feel free to ask question by creating an issue, I'll reply as soon as possible.

const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  '14241987749-phshea2pknoi1vsji2a2t8kingu4n14e.apps.googleusercontent.com',
  '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',
  'http://localhost:5000'  
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('Your refresh token is:', token.refresh_token);
  });
});

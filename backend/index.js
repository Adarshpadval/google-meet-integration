const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// REST API route to create a Google Meet session
app.post('/api/create-session', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: 'Google Meet Session',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      conferenceData: {
        createRequest: {
          requestId: 'random-string-' + Math.random().toString(36).substring(7),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    res.status(200).json({ meetLink });
  } catch (error) {
    console.error('Error creating Google Meet session:', error);
    res.status(500).json({ error: 'Failed to create Google Meet session' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

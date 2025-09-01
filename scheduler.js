require('dotenv').config();
const cron = require('node-cron');
const { poolPromise } = require('./utils/db');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const moment = require('moment');
const axios = require('axios');

// SMS API
const smsUrl = 'http://login.heightsconsultancy.com/API/WebSMS/Http/v1.0a/index.php';

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or other SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio Client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendReminders = async () => {
  try {
    const pool = await poolPromise;
    const today = moment();
    const thirtyDaysLater = today.clone().add(30, 'days').format('YYYY-MM-DD');
    const fifteenDaysAfter = today.clone().subtract(15, 'days').format('YYYY-MM-DD');

    const query = `
      SELECT h.*, u.email, u.phone, c.title
      FROM Hearings h
      JOIN Cases c ON h.caseId = c.id
      JOIN Users u ON c.userId = u.id
      WHERE
        h.notificationDays IS NOT NULL AND
        CAST(h.hearingDate AS DATE) = CAST(DATEADD(DAY, h.notificationDays * -1, GETDATE()) AS DATE)
    `;

    const result = await pool.request()
      .input('thirtyDaysLater', thirtyDaysLater)
      .input('fifteenDaysAfter', fifteenDaysAfter)
      .query(query);

    for (let row of result.recordset) {
      const message = `Reminder: Your hearing for case "${row.title}" is scheduled on ${moment(row.hearingDate).format('YYYY-MM-DD')}.\nDetails: ${row.description ?? 'No description'}`;

      // Send WhatsApp via StarSMS
      const encodedMsg = encodeURIComponent(message);
      const url = `http://wapp.starsmsindia.com/wapp/api/send?apikey=${process.env.STAR_SMS_API_KEY}&mobile=${row.phone}&msg=${encodedMsg}`;
      await axios.get(url);

      // Send Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: row.email,
        subject: 'Case Reminder',
        text: message
      });

      // Send SMS via Twilio (optional)
      // await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE,
      //   to: row.phone
      // });

      // Send SMS via Fast2SMS (optional)
      /*
      const smsData = {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: row.phone
      };

      await axios.post('https://www.fast2sms.com/dev/bulkV2', smsData, {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      */

      console.log(`Reminder sent to ${row.email} / ${row.phone}`);
    }
  } catch (error) {
    console.error('Reminder Error:', error.message);
  }
};

// Run every day at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('Running daily case reminder job at 9 AM...');
  sendReminders();
});

import nodemailer from 'nodemailer';

async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'support@maybechange.com', // generated ethereal user
      pass: 'DF3DC08CDB0B7BCE51AFE463A34498F26E6F', // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"FineAI Support 👻" <support@maybechange.com>', // sender address
    to: 'dungok195@gmail.com', // list of receivers
    subject: 'Test Verify email code', // Subject line
    html: "<b>Test?</b>  <a href='{unsubscribe}'>Huy dk</a>", // html body
  });

  console.log('Message sent: %s', info);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);

export default () => ({
  port: parseInt(process.env.HTTP_HOST, 10) || 3000,
  mongodb_url: process.env.MONGODB_URL,
  rabbitmq_url: process.env.RABBITMQ_URL,
  jwt: {
    access_token: {
      private_key: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY.replace(
        /\\n/g,
        '\n',
      ),
      public_key: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY.replace(/\\n/g, '\n'),
    },
    refresh_token: {
      private_key: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY.replace(
        /\\n/g,
        '\n',
      ),
      public_key: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY.replace(
        /\\n/g,
        '\n',
      ),
    },
    verify_code: {
      private_key: Buffer.from(
        process.env.VERIFY_CODE_PRIVATE_KEY,
        'base64',
      ).toString('ascii'),
      public_key: Buffer.from(
        process.env.VERIFY_CODE_PUBLIC_KEY,
        'base64',
      ).toString('ascii'),
    },
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    sender_verify_email: process.env.SENDER_VERIFY_EMAIL,
    sender_verify_email_name: process.env.SENDER_VERIFY_EMAIL_NAME,
  },
});

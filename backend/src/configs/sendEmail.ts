import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import "dotenv/config.js";
import AuthDAO from '../services/authDAO';
import { User } from "@prisma/client";
import { createResetPasswordJWT } from './JWTpassport.js';
// import { GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'

const clientId = process.env.CLIENT_ID ?? "";
const clientSecret = process.env.CLIENT_SECRET ?? "";
const redirect_url = "http://localhost:3001/api/v1/auth/oauth2callback"//"https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirect_url
)

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_GOOGLE
})

let accessToken: {
    token: string;
    expiry_date: number;
};

// const getAccessToken = async () => {
//     if (!accessToken || Date.now() > accessToken.expiry_date - 60000) {
//         try {
//             const newToken: GetAccessTokenResponse = await oAuth2Client.getAccessToken();
//             if (newToken.token && newToken.res) {
//                 accessToken = {
//                     token: newToken.token,
//                     expiry_date: newToken.res.data.expiry_date! // assert not falsey
//                 };
//             } else {
//                 throw new Error('Failed to get access token from oAuth');
//             }
//         } catch (error) {
//             console.error(`Error refreshing access token ${error}`);
//             throw new Error(`Error refreshing access token`);
//         }
//     }
//     return accessToken.token;
// }

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER_EMAIL!,
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            refreshToken: process.env.REFRESH_TOKEN_GOOGLE!,
            accessToken: process.env.ACCESS_TOKEN_GOOGLE!,
        }
    });

    transporter.on('token', (token) => {
        console.log("A new access token was generated");
        console.log("User: %s", token.user);
        console.log("Access Token: %s", token.accessToken);
        console.log("Expires: %s", new Date(token.expires));
    });

    return transporter;
}

export const sendPasswordResetEmail = async (recipientEmail: string, user: User): Promise<void> => {
    try {
      const transporter = await createTransporter();
      const JWT: string = createResetPasswordJWT(user);
      const resetLink = process.env.FRONTEND_URL + `reset_password?token=${JWT}`; // This JWT does not have "bearer" in front!
      const mailOptions = {
        from: process.env.USER_EMAIL!,
        to: recipientEmail,
        subject: 'Adventus Password Reset Request',
        text: `You requested a password reset. Click the link (valid for 10 minutes) to reset your password: ${resetLink}`,
        html: `<p>You requested a password reset. Click the link (valid for 10 minutes) to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending email', error);
    }
  };
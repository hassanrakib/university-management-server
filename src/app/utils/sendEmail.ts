import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
        auth: {
            user: config.mail_to_send_from,
            pass: config.mail_app_password,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: 'Rakib Hassan<mailrakibhassan@gmail.com>', // sender address
        to, // list of receivers
        subject: 'Reset Password', // Subject line
        text: 'Reset your password within 10 minutes!', // plain text body
        html, // html body
    });
};

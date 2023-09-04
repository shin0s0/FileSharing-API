import nodemailer from "nodemailer";

export const sendMail = async ({from ,to ,subject, text, html})=>{

    let transporter = nodemailer.createTransport({
        service: process.env.SMTP_HOST ,
        auth: { user: process.env.EMAIL, 
               pass:process.env.PASSWORD,},
        secure:true,
    });

    let info = await transporter.sendMail({
        from: ` ShareSnap <${from}>`,
        to,
        subject,
        text,
        html
    })
}
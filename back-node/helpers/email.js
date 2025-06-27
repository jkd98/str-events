import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    //console.log(datos);
    const { email, name, token } = datos;
    const domainn = 'EventStar.com'

    const subject = `Confirma tu Cuenta en ${domainn}`;
    const text = `Confirma tu Cuenta en ${domainn} ahora:`;
    const reff = process.env.E_FRONT;
    const html = `
        <></>
        <p>Hola ${name}, comprueba tu cuenta en ${domainn}</p>
        <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${reff}/#/users/confirm/${token}" >Confirmar Cuenta</a> </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};

const emailOlvidePass = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    //console.log(datos);
    const { email, name, token } = datos;
    const domainn = 'EventStar.com'


    const subject = `Reestablece tu password en ${domainn}`;
    const text = `Reestablece tu password en ${domainn} ahora:`;
    //const reff = process.env.E_BACKEND_URL;
    const reff = process.env.E_FRONT;
    const html = `
        <></>
        <p>Hola ${name}, haz solicitado cambiar tu password en ${domainn}</p>
        <p>Sigue el siguiente enlace para generar un password nuevo:
        <a href="${reff}/#/shared/msg-gnrl/${token}" >Reestablecer Password</a> </p>
        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};

const emailCodigoVerificacion = async ({ email, name, otp }) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const domainn = 'EventStar.com'


    const subject = `Código de Verificación (2FA)`;
    const text = `Hola ${name}, tu código de verificación es: ${otp}`;
    //const reff = process.env.E_BACKEND_URL;
    const html = `
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu código de verificación es: <strong>${otp}</strong></p>
        <p>Este código expirará en 5 minutos.</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};


export {
    emailRegistro,
    emailOlvidePass,
    emailCodigoVerificacion
}
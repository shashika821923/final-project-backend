const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7bf946ee9d6b6e",
      pass: "b7a8c83bb36a40"
    }
  });

exports.sendAllEmails = async (emailList, subject, text) => {
    
    try {
        // Iterate over each email address in the list
        for (let i = 0; i < emailList.length; i++) {
          const email = emailList[i].email;
    
          // Create email options
          const mailOptions = {
            from: 'shashikasedirisingha@gmail.com', // Sender address
            to: email, // Recipient address
            subject: subject, // Subject line
            text: text // Plain text body
          };
    
          // Send email
          await transport.sendMail(mailOptions);
          console.log(`Email sent successfully to ${email}`);
        }
        return true;
      } catch (error) {
        console.error('Error sending emails:', error);
      }
} 
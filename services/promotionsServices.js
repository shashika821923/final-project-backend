const nodemailer = require('nodemailer');
const { dbconfig } = require('../dbConnection');
const sql = require('mssql');

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

        await sql.connect(dbconfig.GYM);

        // Create a new request object
        const request = new sql.Request();

        const query = `
        INSERT INTO emailPormos (subject, body)
        VALUES (@subject, @body)
      `;
  
      // Bind parameters and execute the query
      const result = await request.input('subject', sql.Text, subject)
                                   .input('body', sql.Text, text)
                                   .query(query);
  
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


exports.sendAllLogEmails = async (emailList, subject, text) => {

  try {

      // Iterate over each email address in the list
      for (let i = 0; i < emailList.length; i++) {
        const email = emailList[i];
  
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

exports.addUserReview = async (req, res) => {
  let connection;
  try {
      // Connect to the database
      connection = await sql.connect(dbconfig.GYM);

      // Extract data from the request body
      const { userId, review } = req.body;
      const postedDateTime = new Date().toISOString(); // Get current date and time

      // Insert the data into the userReviews table
      const query = `
          INSERT INTO [dbo].[userReviews] (userId, review, postedDateTime)
          VALUES (@userId, @review, @postedDateTime);
      `;
      const request = new sql.Request(connection);
      request.input('userId', sql.Int, userId);
      request.input('review', sql.VarChar, review);
      request.input('postedDateTime', sql.DateTime, postedDateTime);
      await request.query(query);

      // Close connection
      await connection.close();

      // Return success message
      return res.status(200).send("Review Saved Successfully");
  } catch (err) {
      // Handle errors
      console.error('Error inserting review:', err);
      if (connection) {
          // Close connection if an error occurs
          await connection.close();
      }
      return res.status(500).send("Error saving review");
  }
};


exports.getAllUserReviews = async (req, res) => {
  try {
      // Connect to the database
      await sql.connect(dbconfig.GYM);

      const query = `
          SELECT ur.id, ur.userId, ur.review, ur.postedDateTime, 
                 CONCAT(u.firstName, ' ', u.secondName) AS name
          FROM [dbo].[userReviews] ur
          JOIN [dbo].[users] u ON ur.userId = u.userId
          ORDER BY ur.postedDateTime DESC;`;

      const result = await sql.query(query);

      // Close connection
      await sql.close();

      // Send the response with the reviews
      res.status(200).json(result.recordset);
  } catch (err) {
      console.error('Error fetching user reviews:', err);
      res.status(500).send('Error fetching user reviews');
  }
};

exports.sendPaymentreminder = async(year, month, emailList) => {
  try{
    for (let i = 0; i < emailList.length; i++) {
      const email = emailList[i];
      console.log(email)
      // Create email options
      const mailOptions = {
        from: 'shashikasedirisingha@gmail.com', // Sender address
        to: email, // Recipient address
        subject: "Kind Payment reminder from Lord's Gym", // Subject line
        text: `Please settle you payment for ${year} - ${month} before end of this month, Thank you !` // Plain text body
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
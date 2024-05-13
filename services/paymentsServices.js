const sql = require('mssql');
const { dbconfig } = require('../dbConnection');

exports.addNewPayment = async (req, res) => {
    let connection;
    try {
        // Connect to the database
        connection = await sql.connect(dbconfig.GYM);

        // Check if a payment record already exists
        const checkQuery = `
            SELECT COUNT(*) AS paymentCount
            FROM [dbo].[payments]
            WHERE userId = @userId
            AND year = @year
            AND month = @month;
        `;
        const checkRequest = new sql.Request(connection);
        checkRequest.input('userId', sql.Int, req.body.userId);
        checkRequest.input('year', sql.Int, req.body.year);
        checkRequest.input('month', sql.Int, req.body.month);
        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset[0].paymentCount > 0) {
            // Return "Payment already done" message with 200 status
            return res.status(200).send("Payment already done");
        }

        // If no payment record exists, proceed with insertion
        const insertQuery = `
          INSERT INTO [dbo].[payments] (userId, year, month, paymentDate, acceptedBy)
          VALUES (@userId, @year, @month, @paymentDate, @acceptedBy);
        `;

        const insertRequest = new sql.Request(connection);

        insertRequest.input('userId', sql.Int, req.body.userId);
        insertRequest.input('year', sql.Int, req.body.year);
        insertRequest.input('month', sql.Int, req.body.month);
        insertRequest.input('paymentDate', sql.DateTime, new Date().toISOString());
        insertRequest.input('acceptedBy', sql.Int, req.body.acceptedBy);

        // Execute insert query
        await insertRequest.query(insertQuery);

        // Close connection
        await connection.close();

        // Return success message
        return res.status(200).send("Payment Saved Successfully");
    } catch (err) {
        // Handle errors
        console.error('Error inserting data:', err);
        if (connection) {
            // Close connection if an error occurs
            await connection.close();
        }
        return res.status(500).send("Error saving payment");
    }
};


exports.addUserReview = async (req, res) => {
    let connection;
    try {
        // Connect to the database
        connection = await sql.connect(dbconfig.LORDS_GYM);

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

        // Return success message as plain text
        return res.status(200).send("Review Saved Successfully");
    } catch (err) {
        console.error('Error saving review:', err);
        return res.status(500).send("Error saving review");
    }
};



exports.payedUsersList = async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        const { year, month } = req.body;

        // Construct the SQL query dynamically based on the input
        const query = `
            SELECT userId
            FROM [dbo].[payments]
            WHERE  year = @year
            AND month = @month;
        `;

        const request = new sql.Request();
        request.input('year', sql.Int, year);
        request.input('month', sql.Int, month);

        // Execute the query
        const result = await request.query(query);

        // Close connection
        await sql.close();

        // Send the response with the filtered payments
        return (result.recordset.map(x => x.userId));
    } catch (err) {
        console.error('Error fetching payments by filter:', err);
        res.status(500).send('Error fetching payments by filter');
    }
};


exports.notPaidUserEmails = async (idlIst) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);


        // Construct the SQL query dynamically based on the input
        const query = idlIst.length > 0 ? `SELECT userId, email FROM [dbo].[users] WHERE userId NOT IN (${idlIst.join(', ')});` : `SELECT userId, email FROM [dbo].[users]` ;

        // Execute the query
        const result = await sql.query(query);

        // Close connection
        await sql.close();

        // Extract emails from the query result
        const emails = result.recordset.map((user) => user.email);

        // Send the response with the filtered emails
       return (emails);
    } catch (err) {
        console.error('Error fetching emails by user IDs:', err);
        res.status(500).send('Error fetching emails by user IDs');
    }
};



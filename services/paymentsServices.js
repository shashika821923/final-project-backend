const sql = require('mssql');
const { dbconfig } = require('../dbConnection');

exports.addNewPayment = async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        // Check if a payment record already exists
        const checkQuery = `
            SELECT COUNT(*) AS paymentCount
            FROM [dbo].[payments]
            WHERE userId = @userId
            AND year = @year
            AND month = @month;
        `;
        const checkRequest = new sql.Request();
        checkRequest.input('userId', sql.Int, req.body.userId);
        checkRequest.input('year', sql.Int, req.body.year);
        checkRequest.input('month', sql.Int, req.body.month);
        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset[0].paymentCount > 0) {
            // Close connection
            await sql.close();

            // Return "Payment already done" message with 200 status
            return res.status(200).send("Payment already done");
        }

        // If no payment record exists, proceed with insertion
        const query = `
          INSERT INTO [dbo].[payments] (userId, year, month, paymentDate, acceptedBy)
          VALUES (@userId, @year, @month, @paymentDate, @acceptedBy);
        `;

        const request = new sql.Request();

        request.input('userId', sql.Int, req.body.userId);
        request.input('year', sql.Int, req.body.year);
        request.input('month', sql.Int, req.body.month);
        request.input('paymentDate', sql.DateTime, new Date().toISOString());
        request.input('acceptedBy', sql.Int, req.body.acceptedBy);

        // Execute query
        const result = await request.query(query);

        // Close connection
        await sql.close();

        // Return the result
        return res.status(200).send("Payment Saved Successfully");;
    } catch (err) {
        // Handle errors
        console.error('Error inserting data:', err);
        throw err;
    }
}

exports.getPaymentsByUserId = async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        const query = `
        SELECT p.paymentId, p.userId, p.year, p.month, p.paymentDate, 
        CONVERT(varchar, u.firstName) + ' ' + CONVERT(varchar, u.secondname) AS fullName
    FROM [dbo].[payments] p
    JOIN [dbo].[users] u ON p.acceptedBy = u.userId
    WHERE p.userId = @userId
    ORDER BY p.year DESC, p.month DESC;
    
        
        `;

        const request = new sql.Request();
        request.input('userId', sql.Int, req.body.userId); // Assuming userId is passed in the URL parameters

        // Execute query
        const result = await request.query(query);

        // Close connection
        await sql.close();

        // Send the response
        res.status(200).json(result.recordset);
    } catch (err) {
        // Handle errors
        console.error('Error fetching payments:', err);
        res.status(500).send('Error fetching payments');
    }
}

const { dbconfig } = require("../dbConnection");
const sql = require('mssql');

exports.addNewBlogPost = async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        const query = `
          INSERT INTO [dbo].[blogPosts] (title, description, userid, imageName)
          VALUES (@title, @description, @userId, @imageName);`;

        const request = new sql.Request();

        request.input('title', sql.NVarChar, req.body.title);
        request.input('description', sql.NVarChar, req.body.content);
        request.input('userId', sql.Int, req.body.userId);
        request.input('imageName', sql.VarChar, req.body.imageUrl);

        // Execute query
        const result = await request.query(query);

        // Close connection
        await sql.close();

        // Return the result
        return result;
    } catch (err) {
        // Handle errors
        console.error('Error inserting data:', err);
        throw err;
    }
}

exports.getAllBlogPosts = async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        const query = `select * from blogPosts where isDeleted = 0`;

        const request = new sql.Request();

        // Execute query
        const result = await request.query(query);

        // Return the result
        return result.recordset;
    } catch (err) {
        // Handle errors
        console.error('Error inserting data:', err);
        throw err;
    } finally {
        await sql.close();
    }
}
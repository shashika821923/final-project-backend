const sql = require('mssql');
const { dbconfig } = require('../dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.insertUser = async (userData) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);
        let hashedPassword = await hashPassword(userData.password)
        // Insert data into the users table
        const result = await sql.query`
        INSERT INTO users (firstName, secondName, address, contact, height, weight, email, password, usertype)
        VALUES (${userData.firstName}, ${userData.lastName}, ${userData.address}, ${userData.contactNo}, ${userData.height}, ${userData.weight}, ${userData.email}, ${hashedPassword}, ${3})
      `;

        console.log('Data inserted successfully.');

        // Close the connection
        await sql.close();
    } catch (error) {
        console.error('Error inserting data:', error.message);
    }
}

async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (cost factor)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Function to compare a password with its hashed version
async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}
exports.loginUser = async (credentials) => {
    try {
        await sql.connect(dbconfig.GYM);

        // Query user by email
        const query = 'SELECT * FROM users WHERE CONVERT(VARCHAR(MAX), email) = @email';
        const pool = await sql.connect(dbconfig.GYM);

        const user = await pool.request()
            .input('email', sql.VarChar, credentials.email)
            .query(query);

        if (!user || user.recordset.length === 0) {
            // User not found
            return { success: false, message: 'Invalid email or password.' };
        }

        // Compare passwords
        const match = await bcrypt.compare(credentials.password, user.recordset[0].password);

        if (!match) {
            // Passwords don't match
            return { success: false, message: 'Invalid email or password.' };
        }

        // Passwords match, generate JWT token
        const token = jwt.sign({ userId: user.recordset[0].userId, email: user.recordset[0].email, userType: user.recordset[0].usertype }, 'your_secret_key', { expiresIn: '1h' });

        return { success: true, token: token };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'An error occurred while logging in.' };
    }
}

exports.getAllUsersList = async () => {
    try {
        await sql.connect(dbconfig.GYM);

        const query = 'SELECT * FROM users WHERE isActive=1 AND isDeleted=0';

        const result = await sql.query(query);

        return result.recordset; // Assuming you want to return the users as an array
    } catch (error) {
        console.error('Error:', error.message);
        throw error; // Rethrow the error to handle it at a higher level
    }
}

exports.getUserByUserId = async (userID) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);

        // Query user by user ID
        const result = await sql.query`SELECT * FROM users WHERE userId = ${userID}`;

        // Check if user exists
        if (result.recordset.length > 0) {
            // Map database values to initial values object
            const user = result.recordset[0];
            const initialValues = {
                firstName: user.firstName || "",
                lastName: user.secondName || "",
                address: user.address || "",
                contactNo: user.contact || "",
                weight: user.weight || "",
                height: user.height || "",
                email: user.email || "",
                password: user.password || ""
            };

            // Return the initial values object
            return initialValues;
        } else {
            // User not found
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    } finally {
        // Close the database connection
        sql.close();
    }
}

exports.updateUserInfo = async (userInfo) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig.GYM);
    
        // Construct SQL query to update user information
        const query = `
          UPDATE [lords-gym].[dbo].[users]
          SET
            [firstName] = '${userInfo.firstName}',
            [secondName] = '${userInfo.lastName}',
            [address] = '${userInfo.address}',
            [contact] = '${userInfo.contactNo}',
            [height] = '${userInfo.height}',
            [weight] = '${userInfo.weight}',
            [email] = '${userInfo.email}'
          WHERE [userId] = ${userInfo.userId}
        `;
    
        // Execute the SQL query
        await sql.query(query);
    
        // Close the database connection
        await sql.close();
    
        // Return success message
        return { success: true, message: 'User information updated successfully' };
      } catch (error) {
        console.error('Error updating user:', error.message);
        throw error;
      }
}

exports.deleteUser = async (userId) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig);

        // Construct SQL query to update isDeleted column
        const query = `
          UPDATE [lords-gym].[dbo].[users]
          SET [isDeleted] = 1
          WHERE [userId] = ${userId}
        `;

        // Execute the SQL query
        await sql.query(query);

        // Close the database connection
        await sql.close();

        // Return success message
        return { success: true, message: 'User marked as deleted successfully' };
    } catch (error) {
        console.error('Error marking user as deleted:', error.message);
        throw error;
    }
}

exports.getNewUsersList = async () => {
    try {
        await sql.connect(dbconfig.GYM);

        const query = 'SELECT * FROM users WHERE isActive=0 AND isDeleted=0';

        const result = await sql.query(query);

        return result.recordset; // Assuming you want to return the users as an array
    } catch (error) {
        console.error('Error:', error.message);
        throw error; // Rethrow the error to handle it at a higher level
    }
}


exports.acceptUserRequest = async (userId) => {
    try {
        // Connect to the database
        await sql.connect(dbconfig);

        // Construct SQL query to update isDeleted column
        const query = `
          UPDATE [lords-gym].[dbo].[users]
          SET [isActive] = 1
          WHERE [userId] = ${userId}
        `;

        // Execute the SQL query
        await sql.query(query);

        // Close the database connection
        await sql.close();

        // Return success message
        return { success: true, message: 'User marked as deleted successfully' };
    } catch (error) {
        console.error('Error marking user as deleted:', error.message);
        throw error;
    }
}

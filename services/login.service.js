const sql = require("mssql");
const { dbconfig } = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

async function sendPostRequestAndSaveMealPlan(userId, userData, response) {
    try {
      // Send POST request to the endpoint
      const postResponse = await axios.post(
        "http://127.0.0.1:8000/api/suggest-meal-plan/",
        {
          height_cm: userData.height,
          weight_kg: userData.weight,
        },
        {
          timeout: 10000, // 10 seconds timeout
        }
      );
  
      // Extract meal plan data from the response
      const { suggested_meal_plan, recommended_foods } = postResponse.data;
  
      // Replace commas with periods in recommended foods list
      const formattedFoodsList = recommended_foods.replace(/,/g, '.');
  
      // Save meal plan to the database
      await sql.connect(dbconfig.GYM);
      const insertMealPlanQuery = `INSERT INTO mealPlans (userId, foods, planType) VALUES (${userId}, '${formattedFoodsList}', '${suggested_meal_plan}')`;
      await sql.query(insertMealPlanQuery);
      await sql.close();
  
      console.log("Meal plan saved successfully.");
    } catch (error) {
      console.error("Error saving meal plan:", error.message);
    }
  }
  
  

// Use this function after inserting the user data
exports.insertUser = async (userData) => {
  try {
    await sql.connect(dbconfig.GYM);

    // Hash the password securely (using a recommended library)
    const hashedPassword = await hashPassword(userData.password); // Replace with secure hashing library

    // Use parameterized query to safely insert data
    const result = await sql.query`
            INSERT INTO users (firstName, secondName, address, contact, height, weight, email, password, usertype)
            VALUES (
                ${userData.firstName},
                ${userData.lastName},
                ${userData.address},
                ${userData.contactNo},
                ${userData.height},
                ${userData.weight},
                ${userData.email},
                ${hashedPassword},
                ${3}
            )
        `;

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      // Fetch the inserted userId separately
      const userIdResult = await sql.query`
                SELECT userId FROM users WHERE CONVERT(nvarchar(max), email) = ${userData.email}
            `;

      if (userIdResult.recordset.length > 0) {
        const userId = userIdResult.recordset[0].userId;

        // Call the function to send the post request and save the meal plan
        await sendPostRequestAndSaveMealPlan(userId, userData);
      } else {
        console.error("Error inserting data: Unable to retrieve userId.");
      }
    } else {
      console.error(
        "Error inserting data: No records affected by insert operation."
      );
    }

    await sql.close();
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
};

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
    const query =
      "SELECT * FROM users WHERE CONVERT(VARCHAR(MAX), email) = @email";
    const pool = await sql.connect(dbconfig.GYM);

    const user = await pool
      .request()
      .input("email", sql.VarChar, credentials.email)
      .query(query);

    if (!user || user.recordset.length === 0) {
      // User not found
      return { success: false, message: "Invalid email or password." };
    }

    // Compare passwords
    const match = await bcrypt.compare(
      credentials.password,
      user.recordset[0].password
    );

    if (!match) {
      // Passwords don't match
      return { success: false, message: "Invalid email or password." };
    }

    // Passwords match, generate JWT token
    const token = jwt.sign(
      {
        userId: user.recordset[0].userId,
        email: user.recordset[0].email,
        userType: user.recordset[0].usertype,
      },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    return { success: true, token: token };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "An error occurred while logging in." };
  }
};

exports.getAllUsersList = async () => {
  try {
    await sql.connect(dbconfig.GYM);

    const query = "SELECT * FROM users WHERE isActive=1 AND isDeleted=0";

    const result = await sql.query(query);

    return result.recordset; // Assuming you want to return the users as an array
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

exports.getAllEmails = async () => {
  try {
    await sql.connect(dbconfig.GYM);

    const query = "SELECT email FROM users WHERE isActive=1 AND isDeleted=0";

    const result = await sql.query(query);

    return result.recordset; // Assuming you want to return the users as an array
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

exports.getUserByUserId = async (userID) => {
    try {
      // Connect to the database
      await sql.connect(dbconfig.GYM);
  
      // Query user and meal plan by user ID using a JOIN
      const query = `
        SELECT u.*, mp.foods AS mealPlan
        FROM users u
        LEFT JOIN mealPlans mp ON u.userId = mp.userId
        WHERE u.userId = ${userID}
      `;
      const result = await sql.query(query);
  
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
          password: user.password || "",
          mealPlan: user.mealPlan || "", // Extract meal plan from the result
        };
  
        // Return the initial values object
        return initialValues;
      } else {
        // User not found
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
      throw error;
    } finally {
      // Close the database connection
      sql.close();
    }
  };
  

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

    this.updateMealPlan(userInfo.userId, userInfo);

    // Return success message
    return { success: true, message: "User information updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

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
    return { success: true, message: "User marked as deleted successfully" };
  } catch (error) {
    console.error("Error marking user as deleted:", error.message);
    throw error;
  }
};

exports.getNewUsersList = async () => {
  try {
    await sql.connect(dbconfig.GYM);

    const query = "SELECT * FROM users WHERE isActive=0 AND isDeleted=0";

    const result = await sql.query(query);

    return result.recordset; // Assuming you want to return the users as an array
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

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
    return { success: true, message: "User marked as deleted successfully" };
  } catch (error) {
    console.error("Error marking user as deleted:", error.message);
    throw error;
  }
};

exports.retrieveMealPlan = async (userId) => {
    try {
      await sql.connect(dbconfig.GYM);
  
      // Query the meal plan for the specified user ID
      const query = `SELECT * FROM mealPlans WHERE userId = ${userId}`;
      const result = await sql.query(query);
  
      if (result.recordset.length > 0) {
        const mealPlan = result.recordset[0];
        return { success: true, mealPlan };
      } else {
        return { success: false, message: "Meal plan not found for the user ID." };
      }
    } catch (error) {
      console.error("Error retrieving meal plan:", error.message);
      return { success: false, message: "An error occurred while retrieving the meal plan." };
    }
};

exports.updateMealPlan = async (userId, userData) => {
    try {
      // Send POST request to the Django API to update the meal plan
      const postResponse = await axios.post(
        "http://127.0.0.1:8000/api/suggest-meal-plan/",
        {
          height_cm: userData.height,
          weight_kg: userData.weight,
        }
      );
  
      // Extract meal plan data from the response
      const { suggested_meal_plan, recommended_foods } = postResponse.data;
  
      // Update the meal plan in the database
      await sql.connect(dbconfig.GYM);
      const updateQuery = `
        UPDATE mealPlans
        SET foods = '${recommended_foods}', planType = '${suggested_meal_plan}'
        WHERE userId = ${userId}
      `;
      await sql.query(updateQuery);
      await sql.close();
  
      console.log("Meal plan updated successfully.");
      return { success: true, message: "Meal plan updated successfully." };
    } catch (error) {
      console.error("Error updating meal plan:", error.message);
      return { success: false, message: "An error occurred while updating the meal plan." };
    }
  };
  
  

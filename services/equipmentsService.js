const { dbconfig } = require("../dbConnection");
const sql = require("mssql");

exports.addEquipment = async (req, res) => {
    try {
      // Connect to the database
      let pool = await sql.connect(dbconfig.GYM);
  
      // Construct SQL query to insert equipment data
      const query = `
        INSERT INTO [lords-gym].[dbo].[equipments] (ItemName, qty, purchaseDate, lastServiceDate)
        VALUES (@itemName, @qty, @purchaseDate, @lastServiceDate);
      `;
      await pool.request()
        .input('itemID', sql.Int, req.body.itemID)
        .input('itemName', sql.VarChar, req.body.itemName)
        .input('qty', sql.Int, req.body.qty)
        .input('purchaseDate', sql.DateTime, req.body.purchaseDate)
        .input('lastServiceDate', sql.DateTime, req.body.lastServiceDate)
        .query(query);
  
      // Close the database connection
      await pool.close();
  
      // Return success message
      return { success: true, message: "Equipment added successfully" };
    } catch (error) {
      console.error("Error adding equipment:", error.message);
      throw error;
    }
  };
  

  exports.updateEquipment = async (req, res) => {
    try {
      // Connect to the database
      let pool = await sql.connect(dbconfig.GYM);
  
      // Construct SQL query to update equipment data
      const query = `
        UPDATE [lords-gym].[dbo].[equipments]
        SET
          [ItemName] = @itemName,
          [qty] = @qty,
          [purchaseDate] = @purchaseDate,
          [lastServiceDate] = @lastServiceDate
        WHERE [itemID] = @itemID;
      `;
      await pool.request()
        .input('itemID', sql.Int, req.body.equipmentId)
        .input('itemName', sql.VarChar, req.body.itemName)
        .input('qty', sql.Int, req.body.qty)
        .input('purchaseDate', sql.DateTime, req.body.purchaseDate)
        .input('lastServiceDate', sql.DateTime, req.body.lastServiceDate)
        .query(query);
  
      // Close the database connection
      await pool.close();
  
      // Return success message
      return { success: true, message: "Equipment updated successfully" };
    } catch (error) {
      console.error("Error updating equipment:", error.message);
      throw error;
    }
  };
  


  exports.deleteEquipment = async (req, res) => {
    try {
      // Connect to the database
      let pool = await sql.connect(dbconfig.GYM);
  
      // Construct SQL query to delete equipment
      const query = `
        DELETE FROM [lords-gym].[dbo].[equipments]
        WHERE [itemID] = @itemID;
      `;
      await pool.request()
        .input('itemID', sql.Int, req.body.itemID)
        .query(query);
  
      // Close the database connection
      await pool.close();
  
      // Return success message
      return { success: true, message: "Equipment deleted successfully" };
    } catch (error) {
      console.error("Error deleting equipment:", error.message);
      throw error;
    }
  };
  
  


exports.getAllEquipments = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    // Construct the SQL query dynamically based on the input
    const query = `
        SELECT * 
        FROM equipments
    `;

    const request = new sql.Request();
    // Execute the query
    const result = await request.query(query);

    // Close connection
    await sql.close();

    // Send the response with the filtered payments
    return (result.recordset);
  } catch (error) {
    // Handle errors
    console.error('Error fetching equipments:', error);
    throw error;
  }
};



exports.getEquipmentById = async (equipmentId) => {
  try {

    await sql.connect(dbconfig.GYM);

    // Query to fetch equipment by ID
    const query = `SELECT * FROM equipments WHERE itemID = ${equipmentId}`;
   const request = new sql.Request();
    // Execute the query
    const result = await request.query(query);
    // Check if equipment was found
    await sql.close();

    // Send the response with the filtered payments
    return (result.recordset);
  } catch (error) {
    // Handle errors
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

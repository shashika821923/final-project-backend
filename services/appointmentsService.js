const { dbconfig } = require("../dbConnection");
const sql = require('mssql');

exports.addNewAppointment = async (req, res) => {
    const { userId, date, time } = req.body;

  try {
    // Connect to the database
    await sql.connect(dbconfig.GYM);

    // Construct SQL query to insert appointment
    const query = `
      INSERT INTO [appointments] ([userId], [date], [time])
      VALUES (${userId}, '${date}', '${time}')
    `;

    // Execute the SQL query
    await sql.query(query);

    // Close the database connection
    await sql.close();

    // Return success response
    res.json({ success: true, message: 'Appointment added successfully' });
  } catch (error) {
    console.error('Error inserting appointment:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getAllAppointments = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    let query = req.body.status == '1' ? (`SELECT A.appointmentId, A.userId, A.date, A.time, A.isDeleted, A.isApproved, A.isCompleted, U.firstName, U.secondName FROM [lords-gym].[dbo].[appointments] AS A
    JOIN [lords-gym].[dbo].[users] AS U ON A.userId = U.userId where A.isApproved = 1 AND A.isDeleted = 0 AND A.isCompleted = 0`) : (req.body.status == '2' ?
    (`SELECT A.appointmentId, A.userId, A.date, A.time, A.isDeleted, A.isApproved, A.isCompleted, U.firstName, U.secondName FROM [lords-gym].[dbo].[appointments] AS A
    JOIN [lords-gym].[dbo].[users] AS U ON A.userId = U.userId where A.isApproved = 0 and A.isDeleted = 0 and A.isCompleted = 0`): req.body.status == '3' ? (`SELECT A.appointmentId, A.userId, A.date, A.time, A.isDeleted, A.isApproved, A.isCompleted, U.firstName, U.secondName FROM [lords-gym].[dbo].[appointments] AS A
    JOIN [lords-gym].[dbo].[users] AS U ON A.userId = U.userId where A.isApproved = 1 and A.isDeleted = 0 and A.isCompleted = 1`) : (`SELECT A.appointmentId, A.userId, A.date, A.time, A.isDeleted, A.isApproved, A.isCompleted, U.firstName, U.secondName FROM [lords-gym].[dbo].[appointments] AS A
    JOIN [lords-gym].[dbo].[users] AS U ON A.userId = U.userId where A.isDeleted = 1`))

    const result = await sql.query(query);

    return result.recordset;
  } catch (error) {
    console.error('Error retrieving appointments with user info:', error.message);
    throw error;
  }
}

exports.getSelectedAppointment = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    const result = await sql.query(`
        SELECT A.appointmentId, A.userId, A.date, A.time, A.isDeleted, A.isApproved, A.isCompleted, 
        U.firstName, U.secondName
        FROM [lords-gym].[dbo].[appointments] AS A
        JOIN [lords-gym].[dbo].[users] AS U ON A.userId = U.userId
        where A.appointmentId = ${req.body.appointmentId}`);

    return result.recordset;
  } catch (error) {
    console.error('Error retrieving appointments with user info:', error.message);
    throw error;
  }
}

exports.updateAppointment = async (req, res) => {
    const { userId, date, time, appointmentId } = req.body;

    try {
      await sql.connect(dbconfig.GYM);
  
      // Update the appointment record in the database
      const result = await sql.query(`
        UPDATE appointments
        SET 
          userId = ${userId},
          date = '${date}',
          time = '${time}'
        WHERE appointmentId = ${appointmentId}
      `);
  
      res.status(200).send('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      res.status(500).send('Error updating appointment');
    } finally {
      sql.close();
    }
}


exports.completeAppointment = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    // Fetch appointment details from the appointments table
    const appointmentDetails = await sql.query(`
      SELECT [userId], CONVERT(VARCHAR(10), [date], 120) AS [date], CONVERT(VARCHAR(8), [time], 108) AS [time]
      FROM [appointments]
      WHERE [appointmentId] = ${req.body.appointmentId}
    `);

    if (appointmentDetails.recordset.length === 0) {
      throw new Error('Appointment not found');
    }

    const { userId, date, time } = appointmentDetails.recordset[0];

    // Update the appointment record in the database
    const result = await sql.query(`
      UPDATE appointments
      SET 
      isCompleted = 1
      WHERE appointmentId = ${req.body.appointmentId}
    `);

    // Insert a record into the attendance table
    const attendanceResult = await sql.query(`
      INSERT INTO attendance (userId, date, time)
      VALUES (${userId}, '${date}', '${time}')
    `);

    res.status(200).send('Appointment updated successfully');
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).send('Error updating appointment');
  } finally {
    sql.close();
  }
}



exports.approveAppointments = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    // Update the appointment record in the database
    const result = await sql.query(`
      UPDATE appointments
      SET 
      isApproved = 1
      WHERE appointmentId = ${req.body.appointmentId}
    `);

    res.status(200).send('Appointment updated successfully');
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).send('Error updating appointment');
  } finally {
    sql.close();
  }
}


exports.deleteAppointments = async (req, res) => {
  try {
    await sql.connect(dbconfig.GYM);

    // Update the appointment record in the database
    const result = await sql.query(`
      UPDATE appointments
      SET 
      isDeleted = 1
      WHERE appointmentId = ${req.body.appointmentId}
    `);

    res.status(200).send('Appointment updated successfully');
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).send('Error updating appointment');
  } finally {
    sql.close();
  }
}

// server.js
const express = require('express');
const app = express();
const fs = require("fs");
const sql = require('mssql');
const cors = require("cors");
const port = 4000;

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.raw({inflate: true, limit: '500mb', type: 'message/rfc822' }));

const loginRoutes = require('./routes/loginRoutes');
const appointmentsRoutes = require('./routes/appointmentRoutes');
const blogRoutes = require('./routes/bloggingRoutes');
// Define a route
app.use('/users', loginRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/blogging', blogRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

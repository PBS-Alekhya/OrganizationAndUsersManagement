const express = require('express');
const cors = require('cors');
require('dotenv').config();


const organizationRoutes = require('./routes/organizationRoutes');
const nestedUserRoutes = require('./routes/nestedUserRoutes'); 
const topLevelUserRoutes = require('./routes/nestedUserRoutes.js');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

app.use('/api/organizations/:orgId/users', nestedUserRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', topLevelUserRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

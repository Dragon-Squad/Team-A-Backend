require("dotenv").config();
const express = require('express');
const setupSwagger = require('./setupSwagger'); 

const app = express();

// Set up Swagger documentation
setupSwagger(app);

// Set the port for the app to listen on
const SERVER_PORT = process.env.API_DOCS_SERVER_PORT || 3006;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});

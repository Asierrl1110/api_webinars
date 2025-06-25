// Import the express dependence
const express = require("express");

// Import the controller
const helloController = require("../controllers/hello");

// Constant with the API routes
const api = express.Router();

api.get("/hello", helloController.getHello);

// Export our API
module.exports = api;
// Import the dependences
require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
// Server port
const port = 3000;
// Url database
const urlMongoAtlas = process.env.MONGODB_URI;

async function main() {
  try {
    // Connect to Mongo Atlas database
    await mongoose.connect(urlMongoAtlas);

    console.log("Conexión establecida con Mongo Atlas");

    // Server set to listen to requests
    app.listen(port, () => {
      console.log(`Servidor del API REST está funcionando en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error al conectar con Mongo Atlas:", error);
  }
}

main();
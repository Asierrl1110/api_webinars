// Importamos las dependencias
require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
// Puerto del servidor
const port = 3000;
// URL de la base de datos
const urlMongoAtlas = process.env.MONGODB_URI;

async function main() {
  try {
    // Conectamos a la base de datos
    await mongoose.connect(urlMongoAtlas);

    console.log("Conexión establecida con Mongo Atlas");

    // Servidor listo para oir peticiones
    app.listen(port, () => {
      console.log(`Servidor del API REST está funcionando en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error al conectar con Mongo Atlas:", error);
  }
}

main();
// server.js
const express = require("express");
const db = require("./db");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const app = express();

// Usar el puerto 3000, o cualquier otro puerto que prefieras
const PORT = process.env.PORT || 3000;

// Configuración para servir archivos estáticos
app.use(express.static("public")); // 'public' es la carpeta donde guardas tus archivos estáticos

// Ruta básica
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Asegúrate de que index.html esté en la carpeta 'public'
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});















/*
// Ruta para insertar países desde el SVG
app.post("/insertar-paises", async (req, res) => {
  try {
    const htmlFilePath = path.join(__dirname, "public", "index.html");
    const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

    const dom = new JSDOM(htmlContent);
    const paths = dom.window.document.querySelectorAll("svg path");

    let insertados = 0;

    // Crear Promises solo para elementos válidos
    const queries = Array.from(paths)
      .filter((pathElement) => pathElement.id && pathElement.getAttribute("title"))
      .map((pathElement) => {
        const id = pathElement.id;
        const title = pathElement.getAttribute("title");

        return new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO paises (id, title) VALUES (?, ?)",
            [id, title],
            (err, results) => {
              if (err) reject(err);
              else {
                insertados++;
                resolve(results);
              }
            }
          );
        });
      });

    // Ejecutar todas las Promises
    await Promise.all(queries);

    res.send(`Se han insertado ${insertados} países.`);
  } catch (error) {
    console.error("Error al insertar países:", error);
    res.status(500).send("Hubo un error al insertar los países.");
  }
});
*/

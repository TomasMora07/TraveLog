// server.js
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const app = express();
// Usar el puerto 3000, o cualquier otro puerto que prefieras
const PORT = process.env.PORT || 3000;

// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración para servir archivos estáticos
app.use(express.static("public")); // 'public' es la carpeta donde guardas tus archivos estáticos

// Ruta básica
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Asegúrate de que index.html esté en la carpeta 'public'
});

// Validar contraseña
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,15}$/;
  return passwordRegex.test(password);
}

// Ruta para manejar el registro
app.post("/signup", async (req, res) => {
  const { name, lastName, email, password } = req.body;

  // Validar contraseña
  if (!validatePassword(password)) {
      return res.status(400).send("Password must be 12-15 characters long, include uppercase, lowercase, numbers, and symbols.");
  }

  try {
      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Consulta para insertar datos
      const query = `
          INSERT INTO usuarios (nombre, apellido, email, password)
          VALUES (?, ?, ?, ?)
      `;

      db.query(query, [name, lastName, email, hashedPassword], (err, result) => {
          if (err) {
              console.error("Error al insertar datos:", err);
              return res.status(500).send("Error al registrar usuario");
          }
          console.log("Usuario registrado:", result.insertId);
          res.send("Usuario registrado con éxito");
      });
  } catch (err) {
      console.error("Error al cifrar contraseña:", err);
      res.status(500).send("Error al registrar usuario");
  }
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

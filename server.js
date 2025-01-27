const express = require('express');
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + 'public'));

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
  secret:'secret',
  resave: true,
  saveUninitialized:true
}))

const connection = require('./db');

app.get('/', (req, res)=>{
  res.render('index');
})

app.get('/login', (req, res)=>{
  res.render('login');
})

app.get('/register', (req, res)=>{
  res.render('register');
})

/* REGISTRO DE USUARIOS */
app.post('/register', async (req, res)=>{
  const name = req.body.name;
  const lastname = req.body.lastName;
  const email = req.body.email;
  const pass = req.body.password;

  // hashear password
  let passwordHash = await bcryptjs.hash(pass, 8);

  // insertar valores
  connection.query('INSERT INTO usuarios SET ?', {nombre:name, apellido:lastname, email:email, password:passwordHash}, async(error, results)=>{
    if (error) {
      console.log(error);
    } else {
      res.render('register', {
        alert: true,
        alertTitle: "Registration",
        alertMessage: "¡Successful Registration!",
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 1500,
        ruta: ''
      })
    }
  })
})
/* FIN DE REGISTRO DE USUARIOS */

/* INICIO DE SESIÓN */
app.post('/auth', async (req, res)=>{
  const email = req.body.email;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);
  if(email && pass) {
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results)=>{
        if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))) {
          res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Email or password incorrect",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
          });
        } else {
          req.session.loggedin = true;
          req.session.name = results[0].nombre
          res.render('login', {
            alert: true,
            alertTitle: "Succes",
            alertMessage: "Login Succesful",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1500,
            ruta: ''
        });
      }
    })
  } else {
    res.render('login', {
      alert: true,
      alertTitle: "Warning",
      alertMessage: "Add an email or password",
      alertIcon: 'warning',
      showConfirmButton: true,
      timer: false,
      ruta: 'login'
    });
  }
})
/* FIN DE INICIO DE SESIÓN */

app.get('/', (req, res)=>{
  if(req.session.loggedin) {
    res.render('index', {
      login: true,
      name: req.session.name
    })
  } else {
    res.render('index', {
      login: false,
      name: 'You must log in'
    })
  }
})

app.listen(3000, (req, res)=>{
  console.log('SERVER RUNNING IN http://localhost:3000')
})


































/*
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
  res.sendFile(path.join(__dirname, "public", "views", "index.html")); // Asegúrate de que index.html esté en la carpeta 'public'
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

*/















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

const express = require('express');
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
  secret:'secret',
  resave: true,
  saveUninitialized:true
}))

const connection = require('./db');

app.get('/login', (req, res)=>{
  res.render('login');
})

app.get('/register', (req, res)=>{
  res.render('register');
})

app.get("/", (req, res) => {
  const login = req.session.userId ? true : false; // Comprueba si el usuario ha iniciado sesión
  const name = req.session.name || ''; // Obtiene el nombre del usuario (si existe)
  const userId = req.session.userId || ''; // Obtiene el ID del usuario (si existe)

  res.render("index", { login, name, userId }); // Pasa las variables a la vista
});

app.get("/memories", (req, res) => {
  if(req.session.loggedin) {
    res.render('memories', {
      login: true,
      name: req.session.name,
      userId: req.session.userId // <-- Pasamos el ID del usuario al renderizar el index
    })
  } else {
    res.render('index', {
      login: false,
      name: 'You must log in'
    })
  }
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
          req.session.userId = results[0].id; // <-- Aquí guardamos el id del usuario
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
      name: req.session.name,
      userId: req.session.userId // <-- Pasamos el ID del usuario al renderizar el index
    })
  } else {
    res.render('index', {
      login: false,
      name: 'You must log in'
    })
  }
})

/* ASOCIAR PAÍS AL USUARIO */
app.post("/insertCountries", async (req, res) => {
  const userId = req.body.userId;
  const countryId = req.body.countryId;

  if (!userId || !countryId) {
     return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  connection.query('INSERT INTO usuarios_paises_recuerdos SET ?', {id_usuario:userId, id_pais:countryId},
    async(error, results)=>{
      if (error) {
        console.log(error);
      } else {
        res.json({ success: true });
      }
    })
  })


/** OBTENER IDS DE PAÍSES ASOCIADOS AL USUARIO */
app.get("/selectedCountries/:userId", (req, res) => {
  const userId = req.params.userId;

  // Obtener los países seleccionados desde la base de datos
  const query = "SELECT id_pais FROM usuarios_paises_recuerdos WHERE id_usuario = ?";
  connection.query(query, [userId], (err, results) => {
     if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Error al obtener países." });
     }

     const selectedCountries = results.map(row => row.id_pais);
     res.json({ success: true, selectedCountries });
  });
}); 

/* OBTENER PROGRESO DEL USUARIO (CANTIDAD DE PAÍSES ASOCIADOS)*/
app.get('/progreso/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "El ID del usuario es requerido" });
  }

  // Consulta para contar los países relacionados al usuario
  const query = `
    SELECT COUNT(*) AS totalPaises
    FROM usuarios_paises_recuerdos
    WHERE id_usuario = ?
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener progreso:', error);
      return res.status(500).json({ success: false, message: 'Error al obtener progreso del usuario' });
    }

    const totalPaises = results[0].totalPaises;
    const porcentaje = Math.round((totalPaises / 256) * 100); // Cálculo del porcentaje redondeado

    // Respuesta con el total de países y el porcentaje
    res.json({
      success: true,
      totalPaises: totalPaises,
      porcentaje: porcentaje
    });
  });
});


// ELIMINAR PAÍS SELECCIONADO POR EL USUARIO
app.post("/deleteCountry/:userId", (req, res) => {
  const userId = req.params.userId;
  const countryId = req.body.countryId;

  const query = "DELETE FROM usuarios_paises_recuerdos WHERE id_usuario = ? AND id_pais = ?";
  connection.query(query, [userId, countryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Error al eliminar el país." });
    }

    res.json({ success: true });
  });
});


/* LOG OUT */
app.get('/logout', (req, res)=>{
  req.session.destroy(()=>{
    res.redirect('/login')
  })
})


app.listen(3000, (req, res)=>{
  console.log('SERVER RUNNING IN http://localhost:3000')
})
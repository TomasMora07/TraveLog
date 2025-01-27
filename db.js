//Llamar al componente de mysql
const mysql = require('mysql');

//Establecer los parámetros de la conexión
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});
 
//Nos conectamos con la base
connection.connect(function (error) {
    if (error) throw error;
    console.log('Conectado a la base de datos');
});

//Exportamos el objeto con los datos de la conexión
module.exports = connection;
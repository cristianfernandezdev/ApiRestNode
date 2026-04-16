const express = require('express');
const mongoose = require('mongoose');


const autores = require('./routes/autores');
const libros = require('./routes/libros');


mongoose.connect('mongodb://127.0.0.1:27017/librosREST_v2')
    .then(() => console.log("Conectado a MongoDB (librosREST_v2)"))
    .catch(err => console.error("Error crítico conectando a la BD:", err));

const app = express();


app.use(express.json());


app.use('/autores', autores);
app.use('/libros', libros);


app.listen(8080, () => {
    console.log("Servidor Express escuchando en el puerto 8080");
});
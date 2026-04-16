const mongoose = require('mongoose');


let comentarioSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    nick: {
        type: String,
        required: true,
        trim: true
    },
    comentario: {
        type: String,
        required: true,
        trim: true
    }
});


let libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    editorial: {
        type: String,
        required: false,
        trim: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'autores',
        required: false
    },
    comentarios: [comentarioSchema]
});

module.exports = mongoose.model('libros', libroSchema);
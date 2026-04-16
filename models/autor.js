const mongoose = require('mongoose');

let autorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    anyoNacimiento: {
        type: Number,
        required: false,
        min: 0,
        max: 2000
    }
});

module.exports = mongoose.model('autores', autorSchema);
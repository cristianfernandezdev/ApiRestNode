const express = require('express');
const Autor = require('../models/autor');
let router = express.Router();


router.get('/', async (req, res) => {
    try {
        let resultado = await Autor.find();
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error obteniendo autores" });
    }
});


router.post('/', async (req, res) => {
    try {
        let nuevoAutor = new Autor({
            nombre: req.body.nombre,
            anyoNacimiento: req.body.anyoNacimiento
        });
        let resultado = await nuevoAutor.save();
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error añadiendo autor" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Autor.findByIdAndRemove(req.params.id);
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(400).send({ ok: false, error: "No se ha encontrado el autor" });
        }
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error eliminando autor" });
    }
});

module.exports = router;
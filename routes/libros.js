const express = require('express');
const Libro = require('../models/libro');
let router = express.Router();


router.get('/', async (req, res) => {
    try {
        let resultado = await Libro.find().populate('autor');
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error obteniendo libros" });
    }
});

const Autor = require('../models/autor');


router.get('/filtro/sin-comentarios', async (req, res) => {
    try {
        let resultado = await Libro.find({
            $or: [
                { comentarios: { $exists: false } },
                { comentarios: { $size: 0 } }
            ]
        });
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error filtrando libros sin comentarios" });
    }
});

router.get('/editorial/:nombre', async (req, res) => {
    try {
        let resultado = await Libro.find({ editorial: req.params.nombre }).select('titulo editorial');
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error buscando por editorial" });
    }
});


router.get('/precio/:min/:max', async (req, res) => {
    try {
        let resultado = await Libro.find({
            precio: { $gte: req.params.min, $lte: req.params.max }
        }).sort({ precio: -1 });
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error filtrando por precios" });
    }
});


router.get('/autor-nacimiento/:min/:max', async (req, res) => {
    try {
        let autores = await Autor.find({
            anyoNacimiento: { $gte: req.params.min, $lte: req.params.max }
        });
        let idsAutores = autores.map(a => a._id);
        let resultado = await Libro.find({ autor: { $in: idsAutores } }).populate('autor');
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error filtrando por año de nacimiento del autor" });
    }
});


router.get('/:id/comentarios', async (req, res) => {
    try {
        let resultado = await Libro.findById(req.params.id).select('titulo comentarios');
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(400).send({ ok: false, error: "Libro no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error obteniendo comentarios" });
    }
});


router.put('/actualizar-precios/:editorial', async (req, res) => {
    try {
        await Libro.updateMany(
            { editorial: req.params.editorial },
            { $mul: { precio: 1.10 } }
        );
        let actualizados = await Libro.find({ editorial: req.params.editorial });
        res.status(200).send({ ok: true, resultado: actualizados });
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error actualizando precios" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        let resultado = await Libro.findById(req.params.id).populate('autor');
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(400).send({ ok: false, error: "No se ha encontrado el libro" });
        }
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error buscando el libro indicado" });
    }
});


router.post('/', async (req, res) => {
    try {
        let nuevoLibro = new Libro({
            titulo: req.body.titulo,
            precio: req.body.precio,
            editorial: req.body.editorial,
            autor: req.body.autor
        });
        let resultado = await nuevoLibro.save();
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error añadiendo libro" });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let resultado = await Libro.findByIdAndUpdate(req.params.id, {
            $set: {
                titulo: req.body.titulo,
                precio: req.body.precio,
                editorial: req.body.editorial,
                autor: req.body.autor
            }
        }, { new: true });

        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(400).send({ ok: false, error: "No se ha encontrado el libro a modificar" });
        }
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error actualizando libro" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Libro.findByIdAndRemove(req.params.id);
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(400).send({ ok: false, error: "No se ha encontrado el libro a eliminar" });
        }
    } catch (error) {
        res.status(400).send({ ok: false, error: "Error eliminando libro" });
    }
});

module.exports = router;
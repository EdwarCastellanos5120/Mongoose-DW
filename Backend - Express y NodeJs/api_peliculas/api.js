var mongoose = require("mongoose");
var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
var Pelicula = require("../models/peliculaSchema");
const cors = require('cors');

router.use(cors());

var conexion = 'AQUI VA LA CADENA DE CONEXION'
const db = conexion;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexion a la base de datos exitosa");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos", error);
  });

router.get("/hola", function (req, res) {
  res.status(201).send("Api de Peliculas");
});

//TODO: LISTA DE PELICULAS
router.get("/peliculas", async (req, res) => {
  try {
    const data = await Pelicula.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al consultar las peliculas");
  }
});

//TODO: CREAR PELICULA
router.post(
  "/CrearPelicula",
  [
    check("titulo").isLength({ min: 3 }),
    check("director").isLength({ min: 3 }),
    check("genero").isLength({ min: 3 }),
    check("duracion").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const pelicula = new Pelicula(req.body);
      const data = await pelicula.save();
      console.log("Pelicula creada");
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la película");
    }
  }
);

//TODO: ACTUALIZAR PELICULA
router.put(
  "/ActualizarPelicula/:id",
  [
    check("titulo").isLength({ min: 3 }),
    check("director").isLength({ min: 3 }),
    check("genero").isLength({ min: 3 }),
    check("duracion").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const peliculaId = req.params.id;
      const updates = req.body;

      const updatedPelicula = await Pelicula.findByIdAndUpdate(
        peliculaId,
        updates,
        { new: true }
      );

      if (!updatedPelicula) {
        return res.status(404).send("Pelicula no encontrada");
      }

      console.log("Pelicula actualizada");
      res.status(200).json(updatedPelicula);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al actualizar la película");
    }
  }
);

//TODO: ELIMINAR PELICULA
router.delete("/EliminarPelicula/:id", async (req, res) => {
  try {
    const peliculaId = req.params.id;
    const deletedPelicula = await Pelicula.findByIdAndDelete(peliculaId);

    if (!deletedPelicula) {
      return res.status(404).send("Pelicula no encontrada");
    }

    console.log("Pelicula eliminada");
    res.status(200).json({ message: "Pelicula eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la película");
  }
});

//TODO: BUSCAR POR NOMBRE DE PELICULA
router.get("/BuscarPelicula/:titulo", async (req, res) => {
  try {
    const tituloPelicula = req.params.titulo;

    const peliculas = await Pelicula.find({
      titulo: { $regex: tituloPelicula, $options: "i" },
    });

    if (peliculas.length === 0) {
      return res.status(404).json({ message: "Pelicula no encontrada" });
    }

    res.status(200).json(peliculas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar la película por título");
  }
});

//TODO: BUSCAR POR ID DE PELICULA
router.get("/BuscarPeliculaPorId/:id", async (req, res) => {
  try {
    const peliculaId = req.params.id;

    const pelicula = await Pelicula.findById(peliculaId);

    if (!pelicula) {
      return res.status(404).json({ message: "Pelicula no encontrada" });
    }

    res.status(200).json(pelicula);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar la película por ID");
  }
});

//TODO: BUSCAR POR GENERO DE PELICULA
router.get("/BuscarPeliculaPorGenero/:genero", async (req, res) => {
  try {
    const genero = req.params.genero;

    if (!genero) {
      return res
        .status(400)
        .json({ error: "El parámetro 'genero' es obligatorio" });
    }

    const peliculas = await Pelicula.find({ genero: genero });

    if (peliculas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron películas en ese género" });
    }

    res.status(200).json(peliculas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar películas por género");
  }
});

module.exports = router;

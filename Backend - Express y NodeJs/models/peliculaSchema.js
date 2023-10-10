var mongoose = require('mongoose');

var peliculaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    sinopsis: String,
    imagen: String,
    actores: String, 
    idioma: String, 
    clasificacion: String, 
    calificacion: {
        type: Number,
        min: 0,
        max: 10
    }, 
    fechaLanzamiento: Date, 
});

module.exports = mongoose.model('ColeccionPelicula', peliculaSchema);
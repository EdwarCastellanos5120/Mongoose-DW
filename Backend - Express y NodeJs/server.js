const express = require('express');
const api = require('./api_peliculas/api');
const port = 3000;
const app = express();

app.listen(port, function () {
    console.log('Servicio Desplegado en el Puerto - > ' + port);
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/api', api);
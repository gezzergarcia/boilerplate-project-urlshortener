require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

/**
 * Base de datos en memoria
 */
const bd = [];

/**
 * Contador para generar el shorturl
 */
let cont = 0;

/**
 * Expresión regular para validar una URL
 */
const regex = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/\S*)?$/;

// Basic Configuration
const port = process.env.PORT || 3000;

/**
 * Módulo para parsear el body de las peticiones
 */
const bodyParser = require('body-parser');

/**
 * Módulo para imprimir logs
 */
const logGet = require('debug')('get');
const logPost = require('debug')('post');
const logApp = require('debug')('app');

app.use(cors());

/**
 * Middleware para parsear el body de las peticiones
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

/**
  * GET /api/shorturl/:shorturl
  */
app.get('/api/shorturl/:shorturl', (req, res) => {
  logGet('req.params.shorturl', req.params.shorturl, typeof req.params.shorturl);
  const urlFound = bd.filter((item) => item.short_url === req.params.shorturl);
  logGet('urlFound', urlFound);

  if (urlFound.length > 0) {
    // logGet('urlFound[0].original_url', urlFound[0].original_url);
    logGet(`el parámetro ${req.params.shorturl} redirige a ${urlFound[0].original_url}`);
    res.redirect(urlFound[0].original_url);
  }
});

app.post('/api/shorturl', (req, res) => {
  logPost('req.body', req.body);

  let responseObject = {};

  if (regex.test(req.body.url)) {
    logPost('La URL es válida.');
    responseObject = {
      original_url: req.body.url,
      short_url: `${cont += 1}`,
    };
    bd.push(responseObject);
  } else {
    logPost('La URL no es válida.');
    responseObject = { error: 'invalid url' };
  }

  logPost('responseObject', responseObject);
  logApp('bd', bd);
  res.json(responseObject);
});

app.listen(port, () => {
  logApp(`Listening on port ${port}`);
});

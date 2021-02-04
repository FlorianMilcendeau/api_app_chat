const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const indexRouter = require('./routes/index');

const app = express();

const { CLIENT_URL } = process.env;

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    credentials: true,
  })
);

app.use('/uploads', express.static('uploads'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', indexRouter);

module.exports = app;

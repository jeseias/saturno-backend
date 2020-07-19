const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err);
  console.log('UNCAUGHTEXCEPTION');

  process.exit(1);
});

// Enviroment configuration file
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.config.env'), });
const app = require("../app");

// Connnecting to the data
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to database successfull'))
  .catch  (() => console.log('Connection to database successfull'));

const PORT = process.env.PORT || 9999;
const server = app.listen(PORT, console.log(`App running on port ${PORT}. ${process.env.NODE_ENV}`));

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('UNHANDLEDREJECTION');

  server.close(() => {
    process.exit(1);
  });
});
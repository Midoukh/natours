const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('🔥', err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const { PORT } = process.env;
const DB = process.env.DATA_BASE.replace(
  '$PASSWORD$',
  process.env.DATA_BASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Successfully connected to DB');
  });

const server = app.listen(PORT, () => {
  console.log(`app runnig on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('🔥', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

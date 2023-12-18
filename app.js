import pg from 'pg';
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import sdk from '@falconeye-tech/sdk';

const app = express();
const port = 3001;
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'personal_project',
  password: '0913',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;

const er = new sdk();

await er.init({
  apiHost: 'https://www.handsomelai.shop',
  userKey: '9ac93750-36cc-402c-911b-b7f4bd58c10a',
  clientToken: 'd74b0083-9bc7-43b6-b337-0cb971b8c0aa',
});
// await er.init({
//   apiHost: 'http://localhost',
//   userKey: '526acaff-5726-40c7-a8ae-949b8ee23b46',
//   clientToken: 'ca048536-f004-4b11-ae88-40bb1878666f',
// });

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(er.requestHandler());
app.get('/programError', async (req, res, next) => {
  try {
    console.log('Hi');
    throw new Error('This is the error!');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/typeError', async (req, res, next) => {
  try {
    console.logg('Hi');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/referenceError', async (req, res, next) => {
  try {
    console.logg('Hi');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/databaseError', async (req, res, next) => {
  try {
    console.log('That is database error');
    const query1 = {
      text: 'INSERTT INTO projects(framework, user_id, client_token) VALUES($1, $2, $3) RETURNING *',
      values: ['express', 10, 'jbhjvcvjhjb'],
    };

    const query2 = {
      text: `INSERT INTO users(first_name, second_name, email, password, user_key) VALUES($1, $2, $3, $4, $5) RETURNING id, first_name, second_name, email, user_key`,
      values: [
        'kenvin',
        'Lee',
        'kevin@gmail.com',
        'gndgnfgnfmnfghmfgndfgh',
        'dhdgjfgyhjmgbs',
      ],
    };
    // const res = await pool.query(query1);
    const res = await pool.query(query2);
  } catch (e) {
    next(e);
  }
});

// hii;

app.use(er.errorHandler());

app.use((err, req, res, next) => {
  const error = Object.assign(err);
  error.statusCode = err.statusCode || 500;
  res.status(error.statusCode).json({
    status: error.status || 'error',
    data: error.message,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

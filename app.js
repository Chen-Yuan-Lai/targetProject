import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import sdk from '@falconeye-tech/sdk';

const app = express();
const port = 3001;

const er = new sdk();

await er.init({
  apiHost: 'https://www.handsomelai.shop',
  userKey: '028a1e23-d05a-4231-a3a1-c92e91bf14dd',
  clientToken: 'b0b91773-5db8-41bd-b46e-dd35569d61e1',
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(er.requestHandler());

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
    console.log('Hi');
    throw new Error('This is an error!');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

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

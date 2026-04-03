import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Dashboard API is running',
    version: '1.0.0',
    docs: 'Import postman_collection.json to test all endpoints',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      records: '/api/records',
      dashboard: '/api/dashboard'
    }
  });
});

app.use('/api', routes);
app.use(errorHandler);

export default app;

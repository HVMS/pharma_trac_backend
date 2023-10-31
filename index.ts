import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { registerRouter } from './controller/users/registerUser';

//For env File 
dotenv.config();

const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

// Redirect requests to the routers
app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

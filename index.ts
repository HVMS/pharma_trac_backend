import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { registerRouter } from './controller/users/registerUser';

//For env File 
dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON in request body
app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}))

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

// Redirect requests to the routers
app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

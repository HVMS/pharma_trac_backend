import express, { Request, Response } from "express";
import { registerRouter } from "./controller/users/registerUser";
import dotenv from "dotenv";
import { registerFinalUser } from "./controller/users/registerFinalUser";
import { updateUserRouter } from "./controller/users/updateUser";
import { userById } from "./controller/users/getUserById";

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
app.use('/registerfinal', registerFinalUser);
app.use('/user', userById);
app.use('/updateUser', updateUserRouter);

app.use('/addVitalSign', );

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

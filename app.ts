import express, { Request, Response } from "express";
import { registerRouter } from "./controller/users/registerUser";
import dotenv from "dotenv";
import { registerFinalUser } from "./controller/users/registerFinalUser";
import { updateUserRouter } from "./controller/users/updateUser";
import { userById } from "./controller/users/getUserById";
import { addVitalSignRouter } from "./controller/vitals/addVitalSign";
import { getBloodSugarRouter } from "./controller/vitals/getBloodSugar";
import { getBodyTemperatureRouter } from "./controller/vitals/getBodyTemperature";
import { getBloodCholesterolRouter } from "./controller/vitals/getBloodCholesterol";
import { getHeartRateRouter } from "./controller/vitals/getHeatRate";

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

app.use('/addVitalSign', addVitalSignRouter);
app.use('/getBloodSugar', getBloodSugarRouter);
app.use('/getBloodCholesterol', getBloodCholesterolRouter);
app.use('/getBodyTemperature', getBodyTemperatureRouter);
app.use('/getHeartRate', getHeartRateRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

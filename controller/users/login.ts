import express, { Request, Response } from "express";
import UserService from "../../service/user.service";

export const loginRouter = express.Router();

const userService = new UserService();

loginRouter.post('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);

    const email_address = req.body.email_address;
    const password = req.body.password;

    const user = await userService.loginUser(email_address, password);

    console.log("User is : ", user);

    if (user) {
        res.json({
            "statusCode": 200,
            "message": "User logged in successfully",
            "user": user
        });
    } else {
        res.json({
            "statusCode": 404,
            "message": "User not found",
        });
    }

});
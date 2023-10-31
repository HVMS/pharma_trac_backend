import express, { Request, Response } from "express";
import user from "../../model/user.model";
import UserService from "../../service/user.service";

export const registerRouter = express.Router();

const userService = new UserService();

registerRouter.post('/', async (req: Request, res: Response) => {
    console.log(req.body);

    const current_user = req.body;

    console.log("Email address is : ", req.body.email_address);
    console.log("Pwd is : ", req.body.password);

    const new_user = await userService.createUser(current_user);
    console.log(new_user);

    if (new_user) {
        res.json({
            statusCode: 200,
            message: "User created successfully",
            user: new_user
        });
    } else {
        res.json({
            message: "User already exists",
        });
    }

});
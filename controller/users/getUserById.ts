import express, { Request, Response } from "express";
import UserService from "../../service/user.service";

export const userById = express.Router();

const userService = new UserService();

userById.get('/', async (req: Request, res: Response) => {
    console.log("Request body is : ",req.body);

    const userId = req.query.id as string;

    console.log("User Id is : ", userId);

    const userInformation = await userService.getUserById(userId);
    console.log("New user is : ",userInformation);

    if (userInformation) {
        res.json({
            "statusCode": 200,
            "message": "User found",
            "user": userInformation
        });
    } else {
        res.json({
            "statusCode": 404,
            "message": "User not found",    
        });
    }

});
import express, { Request, Response } from "express";
import userRegister from "../../model/userRegister.model";
import UserService from "../../service/user.service";

export const registerFinalUser = express.Router();

const userService = new UserService();

registerFinalUser.post('/', async (req: Request, res: Response) => {
    console.log("Request body is : ",req.body);

    const current_user : userRegister = req.body;

    console.log("Email address is : ", current_user.email_address);
    console.log("Password is : ", current_user.password);

    console.log("Full Name is : ", current_user.fullName);
    console.log("Confirm Password is : ", current_user.confirmPassword);

    console.log("Birthdate is : ", current_user.birthDate);
    console.log("Gender is : ", current_user.gender);

    console.log("Country is : ", current_user.country);
    console.log("Height is : ", current_user.height);

    console.log("Weight is : ", current_user.weight);


    const newRegisterUser = await userService.registerUser(current_user);
    console.log("New user is : ",newRegisterUser);

    if (newRegisterUser) {
        res.json({
            "statusCode": 200,
            "message": "User Register successfully",
            "user": newRegisterUser
        });
    } else {
        res.json({
            "statusCode": 409,
            "message": "User already exists",
        });
    }

});
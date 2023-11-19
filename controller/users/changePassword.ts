import express, {Request, Response} from 'express';
import UserService from '../../service/user.service';

export const changePasswordRouter = express.Router();

const userService = new UserService();
// Login endpoint
changePasswordRouter.patch('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);
    const user_id = req.body.user_id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    console.log("User Id is : ", user_id);
    console.log("Password is : ", password);
    console.log("Confirm Password is : ", confirmPassword);

    try {
        const updatedUser = await userService.changePassword(user_id, password, confirmPassword);
        
        if (!updatedUser) {
            res.json({
                "statusCode": 404,
                "message": "User not found.",
            });
        }else{
            res.json({
                "statusCode": 200,
                "message": "Password Updated Successfully.",
            });
        }

        res.json(updatedUser);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

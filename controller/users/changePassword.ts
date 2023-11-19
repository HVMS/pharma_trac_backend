import express, {Request, Response} from 'express';
import UserService from '../../service/user.service';

export const changePasswordRouter = express.Router();

const userService = new UserService();
// Login endpoint
changePasswordRouter.patch('/', async (req: Request, res: Response) => {
    const {_userId, password, confirmPassword} = req.body;

    console.log("User Id is : ", _userId);
    console.log("Password is : ", password);
    console.log("Confirm Password is : ", confirmPassword);

    try {
        const updatedUser = await userService.changePassword(_userId, password, confirmPassword);
        
        if (!updatedUser) {
            res.status(404).send({message: 'User not found'});
            return;
        }else{
            console.log("Updated user is : ", updatedUser);
            res.status(200).send({
                message: 'User updated successfully',
            });
        }

        res.json(updatedUser);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

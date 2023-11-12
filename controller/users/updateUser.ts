import express, {Request, Response} from 'express';
import UserService from '../../service/user.service';

export const updateUserRouter = express.Router();

const userService = new UserService();
// Login endpoint
updateUserRouter.patch('/', async (req: Request, res: Response) => {
    const {_id, ...updateFields} = req.body;

    console.log("Update fields are : ", updateFields);
    console.log("Id is : ", _id);

    try {
        const updatedUser = await userService.updateUser(_id, updateFields);
        
        if (!updatedUser) {
            res.status(404).send({message: 'User not found'});
            return;
        }else{
            console.log("Updated user is : ", updatedUser);
            res.status(200).send({
                message: 'User updated successfully',
                updatedUser: updatedUser.value,
            });
        }

        res.json(updatedUser);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

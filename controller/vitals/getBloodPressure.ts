import express, {Request, Response} from 'express';
import VitalSignSerivce from '../../service/vitalsign.service';

export const getBloodPressureRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

getBloodPressureRouter.get('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const user_id = req.query.user_id as string;

    console.log("User Id is : ", user_id);

    try {
        const bloodPressureData = await vitalSignService.getBloodPressureData(user_id);
        
        if (bloodPressureData) {
            res.json({
                "statusCode": 200,
                "message": "Blood Pressure data retrieved Successfully",
                "response": bloodPressureData,
            });
        } else {
            res.json({
                "statusCode": 404,
                "message": "Failed to retrieve Blood pressue data",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});
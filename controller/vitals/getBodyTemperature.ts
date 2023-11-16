import express, {Request, Response} from 'express';
import VitalSignSerivce from '../../service/vitalsign.service';

export const getBodyTemperatureRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

getBodyTemperatureRouter.get('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const user_id = req.query.id as string;

    console.log("User Id is : ", user_id);

    try {
        const bloodSugarData = await vitalSignService.getBodyTemperatureData(user_id);
        
        if (bloodSugarData) {
            res.json({
                "statusCode": 200,
                "message": "Body Temperature data retrieved Successfully",
                "result": bloodSugarData,
            });
        } else {
            res.json({
                "statusCode": 404,
                "message": "Failed to retrieve Body Temperature data",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});
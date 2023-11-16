import express, {Request, Response} from 'express';
import VitalSignSerivce from '../../service/vitalsign.service';

export const getHeartRateRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

getHeartRateRouter.get('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const user_id = req.query.user_id as string;

    console.log("User Id is : ", user_id);

    try {
        const heartRateData = await vitalSignService.getHeartRateData(user_id);
        
        if (heartRateData) {
            res.json({
                "statusCode": 200,
                "message": "Heart Rate data retrieved Successfully",
                "result": heartRateData,
            });
        } else {
            res.json({
                "statusCode": 404,
                "message": "Failed to retrieve Heart Rate data",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});
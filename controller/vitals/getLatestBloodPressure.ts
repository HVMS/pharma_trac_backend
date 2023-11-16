import express, { Request, Response } from 'express';
import VitalSignService from '../../service/vitalsign.service';

export const getLatestBloodPressureRouter = express.Router();

const vitalSignService = new VitalSignService();

getLatestBloodPressureRouter.get('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const user_id = req.query.user_id as string;

    console.log("User Id is : ", user_id);

    try {
        const latestBloodPressureData = await vitalSignService.getLatestBloodPressureData(user_id);
        
        if (latestBloodPressureData) {
            res.json({
                "statusCode": 200,
                "message": "Latest Blood Pressure data retrieved Successfully",
                "result": latestBloodPressureData,
            });
        } else {
            res.json({
                "statusCode": 404,
                "message": "Failed to retrieve latest Blood Pressure data",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});
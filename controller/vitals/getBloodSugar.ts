import express, {Request, Response} from 'express';
import { vitalSigns } from '../../model/vitalModel/vitalSign.model';
import VitalSignSerivce from '../../service/vitalsign.service';

export const getBloodSugarRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

getBloodSugarRouter.post('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const { user_id } = req.body;

    try {
        const bloodSugarData = await vitalSignService.getBloodSugarData(user_id);
        
        if (bloodSugarData) {
            res.json({
                "statusCode": 200,
                "message": "Blood Sugar data retrieved Successfully",
                "result": bloodSugarData,
            });
        } else {
            res.json({
                "statusCode": 404,
                "message": "Failed to retrieve Blood Sugar data",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});
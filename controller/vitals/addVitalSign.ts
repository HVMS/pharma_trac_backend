import express, {Request, Response} from 'express';
import { vitalSigns } from '../../model/vitalModel/vitalSign.model';
import VitalSignSerivce from '../../service/vitalsign.service';

export const addVitalSignRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

// Login endpoint
addVitalSignRouter.post('/', async (req: Request, res: Response) => {
    console.log("Request body is : ", req.body);
    const { user_id, vitalSigns } = req.body;

    console.log("current_vitalSign are : ", vitalSigns);

    try {
        const vitalSignData = await vitalSignService.addVitalSign({ user_id, vitalSigns });
        
        if (vitalSignData) {
            res.json({
                "statusCode": 200,
                "message": "Vital Signs added Successfully",
                "result": vitalSignData.result,
                "response": vitalSignData.data,
            });
        } else {
            res.json({
                "statusCode": 409,
                "message": "Failed to add or update Vital Signs",
            });
        }
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

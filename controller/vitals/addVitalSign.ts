import express, {Request, Response} from 'express';
import { vitalSigns } from '../../model/vitalModel/vitalSign.model';
import VitalSignSerivce from '../../service/vitalsign.service';

export const addVitalSignRouter = express.Router();

const vitalSignService = new VitalSignSerivce();

// Login endpoint
addVitalSignRouter.post('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);
    const current_vitalSign: vitalSigns = req.body;

    console.log("current_vitalSign are : ", current_vitalSign);

    try {
        const vitalSignData = await vitalSignService.addVitalSign(current_vitalSign);
        
        if (vitalSignData) {
            res.json({
                "statusCode": 200,
                "message": "Vital Signs added successfully",
                "user": vitalSignData
            });
        } else {
            res.json({
                "statusCode": 409,
                "message": "Vital Signs already exists",
            });
        }

        res.json(vitalSignData);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

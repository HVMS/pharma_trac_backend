import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineSideEffectRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineSideEffectRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ",req.body);

    const medicine_name = req.query.medicine_name as string;
    console.log("medicine name is : ", medicine_name);

    try {
        const medicineSideEffectsList: any = await medicineService.getMedicineSideEffects(medicine_name);
        
        if (!medicineSideEffectsList) {
            return res.json({
                "statusCode": "404",
                "medicine_name": medicine_name,
                "data": [],
            });
        } else {
            return res.json({
                "statusCode": "200",
                "medicine_name": medicine_name,
                "data": medicineSideEffectsList,
            });
        }
    } catch (error: any) {
        console.log(error);
        return res.json({
            "statusCode": "500",
            "data": "error occured",
        });
    }
});

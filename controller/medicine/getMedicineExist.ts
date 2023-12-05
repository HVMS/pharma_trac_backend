import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineExistRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineExistRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ",req.body);

    const medicine_name = req.query.medicine_name as string;
    console.log("medicine name is : ", medicine_name);

    try {
        const medicineSideEffectsList: any = await medicineService.getMedicineExistance(medicine_name);
        
        if (!medicineSideEffectsList) {
            return res.json({
                "statusCode": "404",
                "medicine_name": medicine_name,
                "message": "No medicine found",
                "status": false,
            });
        } else {
            return res.json({
                "statusCode": "200",
                "medicine_name": medicine_name,
                "message": "Yes medicine found",
                "status": true,
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

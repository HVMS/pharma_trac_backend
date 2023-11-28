import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineSideEffectRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineSideEffectRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ",req.body);

    const medicine = req.query.medicine_name as string;
    console.log("medicine name is : ", medicine);

    try {
        const medicineSideEffectsList: any = await medicineService.getSideEffectsByMedicine(medicine);
        
        if (!medicineSideEffectsList || medicineSideEffectsList.length === 0) {
            return res.json({
                "statusCode": "404",
                "medicine_name": medicine,
                "message": "No side effects found"
            });
        } else {
            return res.json({
                "statusCode": "200",
                "medicine_name": medicine,
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

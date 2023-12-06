import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getAllMedicineStartsWithBRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getAllMedicineStartsWithBRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ",req.body);

    try {
        const medicineListB: any = await medicineService.getMedicineStartsWithB();
        
        if (!medicineListB) {
            return res.json({
                "statusCode": "404",
                "message": "No medicine found",
                "data": [],
            });
        } else {
            return res.json({
                "statusCode": "200",
                "message": "All medicine found starts with Letter B",
                "data": medicineListB,
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

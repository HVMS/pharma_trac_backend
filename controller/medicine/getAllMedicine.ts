import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getAllMedicineRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getAllMedicineRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ",req.body);

    const medicine_name = req.query.medicine_name as string;
    console.log("medicine name is : ", medicine_name);

    try {
        const medicineList: any = await medicineService.getAllMedicineList();
        
        if (!medicineList) {
            return res.json({
                "statusCode": "404",
                "message": "No medicine found",
                "data": [],
            });
        } else {
            return res.json({
                "statusCode": "200",
                "message": "All medicine found",
                "data": medicineList,
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

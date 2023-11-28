import express, {Request, Response} from 'express';
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineTypesRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineTypesRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);

    try {
        const medicineTypesList: any = await medicineService.getMedicineTypes();
        
        if (!medicineTypesList || medicineTypesList.length === 0) {
            return res.json({
                "statusCode": "404",
                "message": "No medicine types found"
            });
        } else {
            return res.json({
                "statusCode": "200",
                "data": medicineTypesList,
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

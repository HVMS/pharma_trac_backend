import express, {Request, Response} from 'express';
// import the MedicineService class from service folder but in javscript format
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineInformationRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineInformationRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);

    try {
        const medicineList = await medicineService.getMedicineInfo();
        
        if (!medicineList) {
            res.json({
                "statusCode": 404,
                "message": "Medicines not found.",
            });
        }else{
            res.json({
                "statusCode": 200,
                "message": "Medicine found successfully.",
            });
        }

        res.json(medicineList);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
});

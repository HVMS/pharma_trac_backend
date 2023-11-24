import express, {Request, Response} from 'express';
// import the MedicineService class from service folder but in javscript format
import MedicineService from '../../service/medicine.service'; // Update the path to the MedicineService module

export const getMedicineInformationRouter = express.Router();

const medicineService = new MedicineService();

// Medicine Information endpoint
getMedicineInformationRouter.get('/', async (req: Request, res: Response) => {

    console.log("Request body is : ", req.body);

    try {
        const medicineList: any = await medicineService.getMedicineInfo();
        
        if (!medicineList || medicineList.length === 0) {
            res.json({
                "message": "No medicine found"
            });
        }else{
            res.json({
                "data": medicineList,
            });
        }

        res.json(medicineList);
    } catch (error: any) {
        res.json({
            "data": "error occured",
        });
    }
});

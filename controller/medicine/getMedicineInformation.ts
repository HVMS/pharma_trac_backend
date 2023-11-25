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
            return res.json({
                "statusCode": "404",
                "message": "No medicine found"
            });
        } else {
            return res.json({
                "statusCode": "200",
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

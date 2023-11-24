import * as cheerio from "cheerio";
import axios from 'axios';

const baseURL = "https://www.drugs.com";

const drug_information_url = baseURL + "/drug_information.html";

class MedicineService {
    async getMedicineInfo(){
        try {
            const response = await axios.get(drug_information_url);
            const $ = cheerio.load(response.data);

            const ulList = $('#content > div > nav > ul');

            // inside the ulList, find the li tag and its attribute href and store into an array or list
            const arrayList = ulList.find('li').map((i: any, element: any) => {
                const href = $(element).find('a').attr('href');
                return href;
            }).get();

            // now remove the last element of the array
            arrayList.pop();

            let finalMedicineList: any = [];

            try {
                finalMedicineList = arrayList.map(async (element: any) => {
                    console.log(baseURL + element);
                    const response = await axios.get(baseURL + element);
                    const $ = cheerio.load(response.data);

                    const medicineList = $('.ddc-list-column-2').find('li').map(async (i: any, element: any) => {
                        const medicine = $(element).find('a').attr('href');
                        if (medicine !== undefined) {
                            if (medicine.includes('/mtm/')) {
                                return medicine.split('/')[2].split('.')[0];
                            } else if (medicine.includes('/pro/')) {
                                return medicine.split('/')[2].split('.')[0];
                            } else if (medicine.includes('/npc/')) {
                                return medicine.split('/')[2].split('.')[0];
                            } else if (medicine.includes('/cons/')) {
                                return medicine.split('/')[2].split('.')[0];
                            } else {
                                return medicine.split('/')[1].split('.')[0];
                            }
                        }
                    }).get();

                    console.log("Medicine List is : ");
                    console.log(medicineList.toString());

                    finalMedicineList = finalMedicineList.concat(medicineList);

                    return finalMedicineList;
                });
            } catch (error) {
                console.error(error);
                throw error;
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default MedicineService;
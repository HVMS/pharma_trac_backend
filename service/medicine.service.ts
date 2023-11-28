import * as cheerio from "cheerio";
import axios from 'axios';

const baseURL = "https://www.drugs.com";

const drug_information_url = baseURL + "/drug_information.html";

class MedicineService {

    async getSideEffectsByMedicine(medicine: string) {
        try {
            
            // Now call the getMedicineTypes() function to get the medicine types
            // Then check whether the medicine is in the list or not - if not then return false else true
            const medicineTypesList = await this.getMedicineTypes();

            // Now medicine types list is an list of list of string - so we need to flatten it
            const flattenMedicineTypesList = medicineTypesList.flat();
            console.log("Flatten medicine types list is : ", flattenMedicineTypesList);
            
            if (flattenMedicineTypesList.includes(medicine)) {
                console.log("Found");
                return true;
            } else {
                console.log("Not found");
                return false;
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getMedicineTypes() {
        try{

            const response = await axios.get(drug_information_url);
            const $ = cheerio.load(response.data);

            const ulList = $('#content > div > nav > ul');

            const arrayList = ulList.find('li').map((i: any, element: any) => {
                const href = $(element).find('a').attr('href');
                return href;
            }).get();

            arrayList.pop();

            let medicineTypesList: any = [];

            medicineTypesList = await Promise.all(arrayList.map(async (element) => {
                console.log(baseURL + element);
                const response = await axios.get(baseURL + element);
                const $ = cheerio.load(response.data);
    
                const medicineList = $('#content > div.contentBox > ul').find('li').map((i, element) => {
                    const medicine = $(element).find('a').attr('href');
                    if (medicine != undefined) {
                        if (medicine.includes('/mtm/')) {
                            return medicine.split('.')[0];
                        } else if (medicine.includes('/pro/')) {
                            return medicine.split('.')[0];
                        } else if (medicine.includes('/npc/')) {
                            return medicine.split('.')[0];
                        } else if (medicine.includes('/cons/')) {
                            return medicine.split('.')[0];
                        } else {
                            return medicine.split('.')[0];
                        }
                    }
                }).get();

                return medicineList;
    
            }));

            return medicineTypesList;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

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

            // make an arraylist of string and store the medicine name
            const medicineList: any = [];

            try {
                finalMedicineList = arrayList.map(async (element: any) => {
                    console.log(baseURL + element);
                    const response = await axios.get(baseURL + element);
                    const $ = cheerio.load(response.data);

                    const elements = $('.ddc-list-column-2').find('li').toArray();

                    for (const element of elements) {
                        const medicinePromise = new Promise((resolve) => {
                            const medicine = $(element).find('a').attr('href');
                            if (medicine !== undefined) {
                                if (medicine.includes('/mtm/')) {
                                    resolve(medicine.split('/')[2].split('.')[0]);
                                } else if (medicine.includes('/pro/')) {
                                    resolve(medicine.split('/')[2].split('.')[0]);
                                } else if (medicine.includes('/npc/')) {
                                    resolve(medicine.split('/')[2].split('.')[0]);
                                } else if (medicine.includes('/cons/')) {
                                    resolve(medicine.split('/')[2].split('.')[0]);
                                } else {
                                    resolve(medicine.split('/')[1].split('.')[0]);
                                }
                            }
                        }).then((medicine) => {
                            medicineList.push(medicine);
                        }).then(() => {
                            console.log("Medicine is : ", medicineList);
                        });
                    }

                });

                await Promise.all(finalMedicineList);

            } catch (error) {
                console.error(error);
                throw error;
            }

            return medicineList;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default MedicineService;
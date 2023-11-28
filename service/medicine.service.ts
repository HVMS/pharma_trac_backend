import * as cheerio from "cheerio";
import axios from 'axios';

const baseURL = "https://www.drugs.com";

const drug_information_url = baseURL + "/drug_information.html";

class MedicineService {

    async getSideEffectsByMedicine(medicine_name: string) {
        try {
            
            // Now call the getMedicineTypes() function to get the medicine types
            // Then check whether the medicine is in the list or not - if not then return false else true
            const medicineTypesList = await this.getMedicineTypes();

            // Now medicine types list is an list of list of string - so we need to flatten it
            const flattenMedicineTypesList = medicineTypesList.flat();
            console.log("Flatten medicine types list is : ", flattenMedicineTypesList);

            const regex = new RegExp(medicine_name, 'i');

            const medicine = flattenMedicineTypesList.find((element: any) => {
                return regex.test(element);
            });
            
            if (medicine.length > 0 || medicine !== undefined) {
                console.log("Found");
                console.log("Medicine name is : ", medicine_name);
                console.log("Medicine element is : ", medicine);

                let medicineSideEffectsList: any = [];

                medicineSideEffectsList = new Promise(async (resolve) => {
                    const url = baseURL + medicine + ".html";
                    const response = await axios.get(url);
                    const $ = cheerio.load(response.data);

                    try {
                        const sideEffectParagraph = $("p").filter((index, element) => {
                            return /common.*side effects.*may include:/i.test($(element).text());
                        });

                        console.log("Side effect paragraph is : ", sideEffectParagraph);

                        let sideEffectsText = sideEffectParagraph.next().text();
                        console.log("Side effects text is : ", sideEffectsText);

                        let sideEffectsList = sideEffectsText.split('\n').map(effect => effect.trim().replace(/or|;|,|\./g, ''));

                        // let lines = sideEffectsText.split(' ');
                        // lines = lines.filter((line: string) => line.split(' ').length < 4 || !/ or | such as | something /i.test(line));
                        // sideEffectsText.split(/,|;/);
                        // let sideEffectsList = sideEffectsText.split('\n').map(effect => effect.trim());
                        console.log("Side effects text is : ", sideEffectsList);  
                        
                        if (sideEffectsList.includes('or')){
                            sideEffectsList.pop();
                        };

                        console.log("sideEffectsList is: ");
                        console.log(sideEffectsList);

                        let drugInfo = {
                            drug_name: medicine_name,
                            side_effects: sideEffectsList
                        };

                        let drugInfoJson = JSON.stringify(drugInfo);
                        console.log("drugInfoJson is: ");
                        console.log(drugInfoJson);

                    } catch (error) {
                        console.error(error);
                        throw error;
                    }

                });

                // Now will call the function which will return the side effects of this particular medicine into the json format
                // const medicineSideEffectsList = this.prepareSideEffectsList(medicine);
                // console.log("Medicine side effects list is : ", medicineSideEffectsList);

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

    async prepareSideEffectsList(medicine: string) {
        try {

            const url = baseURL + medicine + ".html";
            const response = axios.get(url);
            const $ = cheerio.load((await response).data);

            const sideEffectParagraph = $("p").filter(() => {
                return /common.*side effects.*may include:/i.test($(this).text());
            });

            console.log("Side effect paragraph is : ", sideEffectParagraph);

            // let sideEffectsList = this.getCorrectTextData(sideEffectParagraph).split(/,|;/).map((effect: string) => effect.trim());
            // console.log("Side effects list is : ", sideEffectsList);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    getCorrectTextData(sideEffectsParagraph: any){
        try {
            let sideEffectsText = sideEffectsParagraph.next().text();
            let lines = sideEffectsText.split('\n');
            lines = lines.filter((line: string) => line.split(' ').length < 4 || !/ or | such as | something /i.test(line));
            sideEffectsText = lines.join('\n');
            return sideEffectsText;
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
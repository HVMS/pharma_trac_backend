import * as cheerio from "cheerio";
import axios from 'axios';
import { MongoClient } from "mongodb";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const medicineCollection = envVariables.medicineCollection;

const baseURL = "https://www.drugs.com";

const drug_information_url = baseURL + "/drug_information.html";

class MedicineService {

    async getMedicineStartsWithA(){
        try {
            const medicineList = await this.getAllMedicineList();

            // Now extract only medicine which starts with the letter 'a' 
            
            const medicineListStartingWithA = medicineList.filter((medicine: string) => {
                let name = medicine.toLowerCase();
                return name.startsWith('a') ||
                        name.startsWith('mtm/a') ||
                        name.startsWith('pro/a') ||
                        name.startsWith('npc/a') ||
                        name.startsWith('cons/a');
            });

            console.log("Medicine list starting with a is : ", medicineListStartingWithA);
            console.log("Medicine list starting with a is : ", medicineListStartingWithA.length);

            return medicineListStartingWithA;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllMedicineList() {
        try {

            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            // Extract only name from the database

            const medicineList = await database.collection(medicineCollection).find().map((medicine: any) => {
                return medicine.name;
            }).toArray();

            await client.close();

            return medicineList;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getMedicineExistance(medicine_name: string) {
        try {
            
            // Now check wheather the medicine is in the database or not - if yes return true else false
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });
            
            const database = client.db(dbName);

            medicine_name = medicine_name.toLowerCase();

            const medicineData = await database.collection(medicineCollection).findOne({name: medicine_name});

            await client.close();

            if (!medicineData) {
                return false;
            } else {
                return true;
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getSideEffectsByMedicine(medicine_name: string) {
        try {

            let finalSideEffectsList: any = [];
            
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

                await new Promise(async (resolve) => {
                    const url = baseURL + '/'+ medicine + ".html";
                    const response = await axios.get(url);
                    const $ = cheerio.load(response.data);

                    try {
                        const sideEffectParagraph = $("p").filter((index, element) => {
                            return /common.*side effects.*may include:/i.test($(element).text());
                        });

                        // console.log("Side effect paragraph is : ", sideEffectParagraph);

                        let sideEffectsText = sideEffectParagraph.next().text();
                        // console.log("Side effects text is : ", sideEffectsText);

                        // Remove the empty lines from the side effects text
                        sideEffectsText = sideEffectsText.replace(/^\s*[\r\n]/gm, '');

                        let lines = sideEffectsText.split(';');
                        // console.log("Lines are : ", lines);
                        lines = lines.filter((line: string) => line.split(/,| /).length < 4);
                        lines = lines.filter(line => !/or|such as|normal/i.test(line));
                        // console.log("Lines are : ", lines);
                        sideEffectsText.split(/,|;/);
                        // console.log("sideEffectsText is : ", sideEffectsText);
                        let sideEffectsList = sideEffectsText.split(';').map(effect => effect.trim());
                        // console.log("Side effects list is : ", sideEffectsList);
                        
                        sideEffectsList = sideEffectsList.filter(effect => !/\b(or|when|you|this|where|was|such as|normal)\b/i.test(effect));;
                        
                        // Create a separate list that stores comma-separated elements
                        finalSideEffectsList = sideEffectsList.flatMap(effect => effect.split(',').map(item => item.trim()));

                        // Remove elements that are "" or "\n"
                        finalSideEffectsList = finalSideEffectsList.filter((item: string) => item !== "" && item !== "\n");

                        // console.log("Separate list is : ", finalSideEffectsList);

                        // let drugInfo = {
                        //     side_effects: finalSideEffectsList
                        // };

                        // drugInfoJson = JSON.stringify(drugInfo);
                        
                        resolve(finalSideEffectsList);

                    } catch (error) {
                        console.error(error);
                        throw error;
                    }

                });
            } else {
                console.log("Not found");
                return finalSideEffectsList;
            }

            console.log("Final Side Effects List is : ", finalSideEffectsList);
            return finalSideEffectsList;

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
                        if (medicine.includes('/mtm/') || medicine.includes('/pro/') ||
                            medicine.includes('/npc/') || medicine.includes('/cons/')) {
                            // return medicine.split('.')[0].split('/')[0];
                            return medicine.substring(1).split('.')[0];
                        } else{
                            return medicine.substring(1).split('.')[0];
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
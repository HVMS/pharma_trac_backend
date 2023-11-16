import { Db, MongoClient, ObjectId } from "mongodb";
import { vitalSign, vitalSigns } from "../model/vitalModel/vitalSign.model";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const vitalSignCollection = envVariables.vitalSignsCollection;

console.log(vitalSignCollection);
console.log(typeof (vitalSignCollection));

class VitalSignSerivce {

    async addVitalSign(data: { user_id: string, vitalSignRequestBody: any[] }) {
        try {
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            console.log("New vitalSigns data is ", data);

            const existingUser = await database.collection(vitalSignCollection).findOne({ user_id: data.user_id });

            let result;

            if (existingUser) {
                for (let vitalSign of data.vitalSignRequestBody) {
                    const existingDateTime = await database.collection(vitalSignCollection).findOne({ user_id: data.user_id, "vitalSignRequestBody.date": vitalSign.date, "vitalSignRequestBody.time": vitalSign.time });

                    if (existingDateTime) {
                        result = await database.collection(vitalSignCollection).updateOne(
                            { user_id: data.user_id, "vitalSignRequestBody.date": vitalSign.date, "vitalSignRequestBody.time": vitalSign.time },
                            { $set: { "vitalSignRequestBody.$": vitalSign } }
                        );
                    } else {
                        result = await database.collection(vitalSignCollection).updateOne(
                            { user_id: data.user_id },
                            { $push: { vitalSignRequestBody: vitalSign } }
                        );
                    }
                }
                console.log("Updated vitalSigns are : ", result);
            } else {
                result = await database.collection(vitalSignCollection).insertOne(data);
                console.log("Inserted vitalSigns are : ", result);
            }

            await client.close();

            if (result) {
                return { result, ...data };
            } else {
                throw new Error("Failed to add vital sign data");
            }

        } catch (error) {
            console.log('error in createUser is : ' + error);
        }
    }

    async getBloodSugarData(userId: string) {
        try {
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            const userData = await database.collection(vitalSignCollection).findOne({ user_id: userId });

            if (!userData) {
                console.log("User not found");
                return;
            }

            // const bloodSugarData = userData.vitalSignRequestBody.filter((entry: any) => entry.blood_sugar !== null);
            
            // console.log("Blood sugar data is : ",bloodSugarData);

            const bloodSugarData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.blood_sugar !== null && entry.blood_sugar !== undefined)
            .map((entry: any) => ({
                blood_sugar: entry.blood_sugar,
                date: entry.date,
                time: entry.time
            }));

            console.log("Blood sugar data 1 is : ",bloodSugarData);

            await client.close();

            return bloodSugarData;

        } catch (error) {
            console.log('error in getBloodSugarData is : ' + error);
        }
    }


}

export default VitalSignSerivce;
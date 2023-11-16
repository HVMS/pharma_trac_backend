import { Db, MongoClient, ObjectId } from "mongodb";
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

            const bloodSugarData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.blood_sugar !== null && entry.blood_sugar !== undefined)
            .map((entry: any) => ({
                blood_sugar: entry.blood_sugar,
                date: entry.date,
                time: entry.time
            }));

            console.log("Blood sugar data is : ", bloodSugarData);

            await client.close();

            if (bloodSugarData) {
                return bloodSugarData;
            } else {
                return [];
            }

        } catch (error) {
            console.log('error in getBloodSugarData is : ' + error);
        }
    }

    async getBloodCholesterolData(userId: string) {
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

            const bloodCholesterolData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.blood_cholesterol !== null && entry.blood_cholesterol !== undefined)
            .map((entry: any) => ({
                blood_cholesterol: entry.blood_cholesterol,
                date: entry.date,
                time: entry.time
            }));

            console.log("Blood Cholesterol data is : ", bloodCholesterolData);

            await client.close();

            if (bloodCholesterolData) {
                return bloodCholesterolData;
            } else {
                return [];
            }

        } catch (error) {
            console.log('error in getBloodCholesterolData is : ' + error);
        }
    }

    async getBodyTemperatureData(userId: string) {
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

            const temperatureData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.temperature !== null && entry.temperature !== undefined)
            .map((entry: any) => ({
                temperature: entry.temperature,
                date: entry.date,
                time: entry.time
            }));

            console.log("Body temperature data is : ", temperatureData);

            await client.close();

            if (temperatureData) {
                return temperatureData;
            } else {
                return [];
            }

        } catch (error) {
            console.log('error in getBodyTemperatureData is : ' + error);
        }
    }

    async getHeartRateData(userId: string) {
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

            const heartRateData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.heart_rate !== null && entry.heart_rate !== undefined)
            .map((entry: any) => ({
                heart_rate: entry.heart_rate,
                date: entry.date,
                time: entry.time
            }));

            console.log("Heart rate data is : ", heartRateData);

            await client.close();

            if (heartRateData) {
                return heartRateData;
            } else {
                return [];
            }

        } catch (error) {
            console.log('error in getHeartRateData is : ' + error);
        }
    }

    async getBloodPressureData(userId: string) {
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

            const bloodPressureData = userData.vitalSignRequestBody
            .filter((entry: any) => entry.blood_pressure !== null && entry.blood_pressure !== undefined)
            .map((entry: any) => ({
                blood_pressure: entry.blood_pressure,
                date: entry.date,
                time: entry.time
            }));

            console.log("Blood Pressure Data is : ", bloodPressureData);

            await client.close();

            if (bloodPressureData) {
                return bloodPressureData;
            } else {
                return [];
            }

        } catch (error) {
            console.log('error in getBloodPressureData is : ' + error);
        }
    }

    async getLatestBloodPressureData(userId: string) {
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
    
            const now = new Date();
            console.log("Now is : ", now);
    
            const bloodPressureData = userData.vitalSignRequestBody
                .filter((entry: any) => {
                    const entryDateTime = new Date(entry.date + ' ' + entry.time);
                    console.log("Entry date time is : ", entryDateTime);
                    return entry.blood_pressure !== null && entry.blood_pressure !== undefined && entryDateTime <= now;
                })
                .map((entry: any) => ({
                    blood_pressure: entry.blood_pressure,
                    date: entry.date,
                    time: entry.time
                }));
    
            const sortedBloodPressureData = bloodPressureData.sort((a: any, b: any) => {
                const dateTimeA = Date.parse(a.date + ' ' + a.time);
                console.log("Date time A is : ", dateTimeA);
                const dateTimeB = Date.parse(b.date + ' ' + b.time);
                console.log("Date time B is : ", dateTimeB);

                console.log("Difference is : ", dateTimeB - dateTimeA);
                return dateTimeB - dateTimeA;
            });
    
            const latestBloodPressureData = sortedBloodPressureData[0];
    
            await client.close();
    
            if (latestBloodPressureData) {
                return latestBloodPressureData;
            } else {
                return [];
            }
    
        } catch (error) {
            console.log('error in getLatestBloodPressureData is : ' + error);
        }
    }

}

export default VitalSignSerivce;
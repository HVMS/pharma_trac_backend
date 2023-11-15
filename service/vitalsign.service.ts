import { Db, MongoClient, ObjectId } from "mongodb";
import { vitalSign, vitalSigns } from "../model/vitalModel/vitalSign.model";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const vitalSignCollection = envVariables.vitalSignsCollection;

console.log(vitalSignCollection);
console.log(typeof (vitalSignCollection));

class VitalSignSerivce {

    async addVitalSign(data: { user_id: string, vitalSigns: any[] }) {
        try {
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            console.log("New vitalSigns are  is ", data);

            const result = await database.collection(vitalSignCollection).insertOne(data);

            console.log("Inserted vitalSigns are : ", result);

            await client.close();

            return result;

        } catch (error) {
            console.log('error in createUser is : ' + error);
        }
    }


}

export default VitalSignSerivce;
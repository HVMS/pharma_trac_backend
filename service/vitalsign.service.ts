import { Db, MongoClient, ObjectId } from "mongodb";
import { vitalSign, vitalSigns } from "../model/vitalModel/vitalSign.model";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const vitalSignCollection = envVariables.vitalSignCollection;

console.log(vitalSignCollection);
console.log(typeof (vitalSignCollection));

class VitalSignSerivce {

    async addVitalSign(vitalSigns: vitalSigns) {
        try {
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            console.log("New vitalSigns are  is ", vitalSigns);

            const newVitalSign = await database.collection(vitalSignCollection).insertOne(vitalSigns);

            console.log("Inserted vitalSigns are : ", newVitalSign);

            await client.close();

            return newVitalSign;


        } catch (error) {
            console.log('error in createUser is : ' + error);
        }
    }


}

export default VitalSignSerivce;
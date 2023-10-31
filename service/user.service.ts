import {Db, MongoClient, ObjectId} from "mongodb";
import user from "../model/user.model";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const userDatabase = envVariables.usersCollectionName;

class UserService{

    async getUser(user: user) {
        try {
            // Connect to MongoDB
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });
            const db: Db = client.db(dbName);
            console.log(user);
            const returned_user = await db
                .collection(userDatabase)
                .findOne(user);

            console.log(returned_user);
            await client.close();

            if (returned_user) {
                return returned_user;
            }
        } catch (error) {
            console.log(error);
        }
    }


    async createUser(user: user){
        if ((await this.getUser({email_address: user.email_address})) != null){
            return ;
        }
        try {
            const client = await MongoClient.connect(mongoURI,{
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            console.log("New user is ", user);

            const newUser = await database.collection(userDatabase).insertOne(user);

            console.log("inserted user is : ", newUser);

            await client.close();

            return newUser;


        } catch (error) {
            console.log('error in createUser is : '+error);
        }
    }
}

export default UserService;
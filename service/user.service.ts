import { Db, MongoClient, ObjectId } from "mongodb";
import user from "../model/user.model";
import userRegister from "../model/userRegister.model";
import envVariables from "../importenv";

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const userDatabase = envVariables.usersCollectionName;
const userRegistrationDatabase = envVariables.userRegistrationCollection;

console.log(userRegistrationDatabase);
console.log(typeof (userRegistrationDatabase));

class UserService {

    async getUser(userRegister: userRegister) {
        try {
            // Connect to MongoDB
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });
            const db: Db = client.db(dbName);
            console.log(userRegister);
            const returned_user = await db
                .collection(userRegistrationDatabase)
                .findOne(userRegister);

            console.log(returned_user);
            await client.close();

            if (returned_user) {
                return returned_user;
            }
        } catch (error) {
            console.log(error);
        }
    }


    async createUser(user: user) {
        if ((await this.getUser({ email_address: user.email_address })) != null) {
            return;
        }
        try {
            const client = await MongoClient.connect(mongoURI, {
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
            console.log('error in createUser is : ' + error);
        }
    }

    async registerUser(userRegister: userRegister) {
        if ((await this.getUser({ email_address: userRegister.email_address })) != null) {
            return;
        }
        try {
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 3000,
            });

            const database = client.db(dbName);

            console.log("Before mongodb insertion data is : ", userRegister);

            console.log("userDatabase name is : ", userRegistrationDatabase);

            const newRegisteredUser = await database.collection(userRegistrationDatabase).insertOne(userRegister);

            console.log("After mongodb insertion data is : ", newRegisteredUser);

            await client.close();

            return newRegisteredUser;

        } catch (error) {
            console.log('error in register user is : ' + error);
        }
    }

    // Get User information using it's Id
    async getUserById(userId: string) {
        try {
            // Connect to MongoDB
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });
            const db: Db = client.db(dbName);

            // Assuming you have an ObjectId for the user, create one like this
            const objectId = new ObjectId(userId);

            const returned_user = await db
                .collection(userRegistrationDatabase)
                .findOne({ _id: objectId });

            await client.close();

            if (returned_user) {
                return returned_user;
            } else {
                return null;
            }
        } catch (error) {
            console.log('Error in getUserById:', error);
        }
    }

    async updateUser(userRegister: userRegister) {
        try{
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });

            const db: Db = client.db(dbName);

            const objectId = new ObjectId(userRegister._id);
            
            const updatedUser = await db
                .collection(userDatabase)
                .updateOne({ _id: objectId }, { $set: userRegister });

            await client.close();

            if (updatedUser) {
                return updatedUser;
            } else {
                return null;
            }

        }catch(error){
            console.log('Error in updateUser:', error);
        }
    }

}

export default UserService;
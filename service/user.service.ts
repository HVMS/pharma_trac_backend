import { Db, MongoClient, ObjectId } from "mongodb";
import user from "../model/userModel/user.model";
import userRegister from "../model/userModel/userRegister.model";
import envVariables from "../importenv";
import bcrypt from 'bcrypt';

const mongoURI = envVariables.mongoURI;
const dbName = envVariables.dbName;
const userDatabase = envVariables.usersCollectionName;
const userRegistrationDatabase = envVariables.userRegistrationCollection;

console.log(userRegistrationDatabase);
console.log(typeof (userRegistrationDatabase));

class UserService {

    async loginUser(email_address: string, password: string){
        try{
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });

            const db: Db = client.db(dbName);
            console.log("Email address is : ", email_address);
            console.log("Password is : ", password);

            const returned_user = await db
                .collection(userRegistrationDatabase)
                .findOne({ email_address: email_address });

            if (returned_user) {
                console.log("Returned user is : ", returned_user);

                const isPasswordMatched = await bcrypt.compare(password, returned_user.password);

                if (isPasswordMatched) {
                    console.log("Password matched");
                    return returned_user;
                }

            } else {
                console.log("User not found");
            }

        } catch (error) {
            console.log(error);
        }
    }

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

            const { ObjectId } = require('mongodb');

            const database = client.db(dbName);

            console.log("Before mongodb insertion data is : ", userRegister);

            console.log("userDatabase name is : ", userRegistrationDatabase);

            // check here password is empty or not before hashing
            if (!userRegister.password) {
                throw new Error('Password is required');
            }
          
            const hashedPassword = await bcrypt.hash(userRegister.password.toString(), 10);
            userRegister.password = hashedPassword;

            const newRegisteredUser = await database.collection(userRegistrationDatabase).insertOne({
                ...userRegister,
                _id: new ObjectId(),
            });

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

    async updateUser(_id: string, updateFields : Partial<userRegister>) {
        try{
            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });

            const db: Db = client.db(dbName);

            console.log("incoming id is : ", _id);

            const objectIdToUpdate = ObjectId.createFromHexString(_id);

            const updatedUser = await db
                .collection(userRegistrationDatabase)
                .findOneAndUpdate({ _id: objectIdToUpdate }, { $set: updateFields });

            console.log("Updated user is : ", updatedUser);

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

    async changePassword(_userId: string, password: string, confirmPassword: string){
        try{

            const client = await MongoClient.connect(mongoURI, {
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
            });

            const db: Db = client.db(dbName);

            console.log("User Id is : ", _userId);
            console.log("Password is : ", password);
            console.log("Confirm Password is : ", confirmPassword);

            const users = db.collection(userRegistrationDatabase);
            const user = await users.findOne({ _id: new ObjectId(_userId) });

            // now change the password into the encrypted form and update the user as well as the confirmation password too
            if (!user) {
                throw new Error('User not found');
            }

            if (!password) {
                throw new Error('Password is required');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const hashedPassword = await bcrypt.hash(password.toString(), 10);
            const updatedUser = await users.findOneAndUpdate(
                { _id: new ObjectId(_userId) },
                {
                    $set: {
                        password: hashedPassword,
                        confirmPassword: confirmPassword,
                    },
                }
            );

            await client.close();

            if (updatedUser) {
                return "Password changed successfully";
            } else {
                return null;
            }

        } catch (error) {
            console.log('Error in changePasswordRouter:', error);
        }
    }

}

export default UserService;
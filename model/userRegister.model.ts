import { ObjectId } from "mongodb";

interface userRegister {
    email_address?: String;
    password?: String;
    fullName?: String;
    confirmPassword?: String;
    birthDate?: String;
    gender?: String;
    country?: String;
    height?: String;
    weight?: String;
    _id?: ObjectId;
}

export default userRegister;
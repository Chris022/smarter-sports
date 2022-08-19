import { Context } from "../types/context_type";
import { Prisma, User } from "@prisma/client";

import bcrypt from "bcrypt"

import { encrypt_user_id } from "../utils/jwt_helpers"


interface UserInput {
    name:       string,
    email:      string,
    password:   string
}

export let register = async (parent, args:{user_data:UserInput}, context:Context) => {
    let user_data = args.user_data;

    //hash the password
    user_data.password = await bcrypt.hash(user_data.password,10);

    //create user
    try{
        let user = await context.prisma.user.create({data: user_data});
    }catch(e){
        console.log("Error creating User:");
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code === "P2002"){
                console.log("Email already in use")
            }
        }
        return {message: "Error creating user"}
    }
    return {message: "User Created"}
};



interface LoginInput {
    email:      string,
    password:   string
}

export let login = async (parent, args:{login_data:LoginInput}, context:Context) => {
    let login_data = args.login_data;

    //get user from DB
    let user = await context.prisma.user.findUnique({where:{email:login_data.email}})
    if(!user){
        console.log("Could not log in");
        return {jwt:null};
    }
    user = user as User;

    //check user Password
    let match = await bcrypt.compare(login_data.password,user.password)

    if(!match){
        console.log("Could not log in")
        return {jwt:null};
    }

    //return JWT
    return {
        jwt: encrypt_user_id(user.id)
    }


};
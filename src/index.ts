import fs                       from "fs"
import path                     from "path"

import express                  from 'express';
import { ApolloServer, gql }    from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema'

import { PrismaClient }         from '@prisma/client'

import {
  encrypt_user_id,
  decrypt_user_id
}                               from "./utils/jwt_helpers";
import resolvers                from "./resolvers";

const app = express();

let typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
)

let context = async ({ req,res }) => {
  let prisma = new PrismaClient();

  //get the auth token
  let auth_token = req.headers["authorization"]

  //get the user id
  let user_id = await decrypt_user_id(auth_token);
  if(!user_id) return {prisma:prisma,logged_in_user:null}

  //get the logged in user with the id from the jwt
  let user = await prisma.user.findUnique({where:{id:user_id}})

  return {prisma: prisma,logged_in_user:user}
}

//let schema = makeExecutableSchema({
//  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
//  resolversui
//})

//schema = constraintDirective()(schema)


//get_user_id_of_logged_in_user();
let server = new ApolloServer({ typeDefs, resolvers, context });


let startServer= async () =>  {
  await server.start();
  server.applyMiddleware({app})
}
startServer()
app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));

//TODO: Hinzufügen von LOGIN/REGISTER/LOGOUT MUTATIONS
import fs from "fs"
import path from "path"
import { makeExecutableSchema } from '@graphql-tools/schema'

import * as jose from 'jose'
import resolvers from "./resolvers";
import express from 'express';
const cookieParser = require('cookie-parser');
let { ApolloServer, gql } = require('apollo-server-express');


let typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
)

let context = ({ req,res }) => {
  //get the auth token
  //let auth_token = req.headers["authorization"]

  res.cookie('cookieName',123, { maxAge: 900000});
}

//let schema = makeExecutableSchema({
//  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
//  resolversui
//})

//schema = constraintDirective()(schema)


let get_user_id_of_logged_in_user = async () => {
  let publicKey = await jose.importSPKI(fs.readFileSync(
    path.join(__dirname, './../public.key'),
    'utf8'
  ), "RS256")

  let privateKey = await jose.importPKCS8(fs.readFileSync(
    path.join(__dirname, './../private.key'),
    'utf8'
  ), "RS256")

  //login
  const token = await new jose.SignJWT({
    user_id: 1,
  })
  .setProtectedHeader({
    typ: 'JWT',
    alg: 'RS256',
  })
  .setExpirationTime('1h')
  .sign(privateKey);
  console.log(token)

  try{
    let { payload, protectedHeader } = await jose.jwtVerify(token+"k", publicKey);
    return payload.user_id
  }catch(error){
    return null;
  }
}
const app = express();

app.use(cookieParser());

//get_user_id_of_logged_in_user();
let server = new ApolloServer({ typeDefs, resolvers, context });

const cors = {
  credentials: true,
  origin: 'https://studio.apollographql.com'
}

let startServer= async () =>  {
  await server.start();
  server.applyMiddleware({app,cors})
}
startServer()
app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
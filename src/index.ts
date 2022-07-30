import fs from "fs"
import path from "path"
import { makeExecutableSchema } from '@graphql-tools/schema'

const { ApolloServer, gql } = require('apollo-server');


const typeDefs =  fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
)

//let schema = makeExecutableSchema({
//  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
//  resolvers
//})

//schema = constraintDirective()(schema)


const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];


const resolvers = {
  Query: {
    books: () => books,
  },
};


const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

import {books} from "./books"



let resolvers = {
    Query: {
      books: () => books,
    },
};

export default resolvers;
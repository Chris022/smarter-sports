import {register,login} from "./auth"



let resolvers = {
  Mutation:{
    register,
    login
  }
};

export default resolvers;
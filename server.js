const express = require("express");
const { graphqlHTTP } = require("express-graphql");
var { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const app = express();


// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "hello",
    fields: () => ({
      message: { 
        type: GraphQLString,
        resolve: () => "Hello world!!!"
      }
    })
  })
});

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log("Server runing on port 5000"));
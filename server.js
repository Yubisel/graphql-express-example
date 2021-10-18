const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const app = express();

const Authors = require("./Authors");
const Books = require("./Books");

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Represent a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: { 
      type: AuthorType,
      resolve: oBook => Authors.find(oAuthor => oAuthor.id === oBook.authorId)
   }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Represent a author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => Books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => Authors
    }
  })
});

// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log("Server runing on port 5000"));
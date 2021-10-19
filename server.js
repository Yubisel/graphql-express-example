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
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (oAuthor) => Books.filter(oBook => oBook.authorId === oAuthor.id)
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Single book",
      args: {
        id:  { type: GraphQLInt }
      },
      resolve: (parent, args) => Books.find(oBook => oBook.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => Books
    },
    author: {
      type: AuthorType,
      description: "Single author",
      args: {
        id:  { type: GraphQLInt }
      },
      resolve: (parent, args) => Authors.find(oAuthor => oAuthor.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => Authors
    }
  })
});


const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: GraphQLNonNull(GraphQLInt),
        }
      },
      resolve: (parent, args) => {
        const  oBook = {
          id: Books.length + 1,
          name: args.name,
          authorId: args.authorId 
        }
        Books.push(oBook);
        return oBook;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (parent, args) => {
        const  oAuthor = {
          id: Authors.length + 1,
          name: args.name,
        }
        Authors.push(oAuthor);
        return oAuthor;
      }
    }
  })
});

// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log("Server runing on port 5000"));
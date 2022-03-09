const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull, //means that you can never return a null value for a given type
} = require('graphql');
const app = express();

//dummy data
const books = [
  { id: 1, name: 'Crime and Punishment', authorId: 1 },
  { id: 2, name: 'Anna Karenina', authorId: 2 },
  { id: 3, name: 'When Nietzsche Wept', authorId: 3 },
  { id: 4, name: 'Animal Farm', authorId: 4 },
  { id: 5, name: 'The Schopenhauer Cure', authorId: 3 },
];

const authors = [
  { id: 1, name: 'Fyodor Dostoevsky' },
  { id: 2, name: 'Leo Tolstoy' },
  { id: 3, name: ' Irvin D. Yalom' },
  { id: 4, name: 'George Orwell' },
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Book name',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      //specifies a custom resolve to define how to get the author, that takes book (parent) as param:
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author name',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      //specifies a custom resolve to define how to get the author's books, that takes author (parent) as param:
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Query Root',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'Books list',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

/**
 * Simple SAMPLE: schema defines the quert section which defines use cases that will be used for querying
 const schema = new GraphQLSchema({
   query: new GraphQLObjectType({
     name: 'OlaMundo',
     //fields: asking for specific fields on objects
     fields: () => ({
       message: {
         type: GraphQLString,
         resolve: () => 'OlaMundo', //a func that will tell GraphQL where to get this info and return it
       },
     }),
   }),
 });
*/

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(5000, () => console.log('Server Running...'));

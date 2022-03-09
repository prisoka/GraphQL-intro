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
  { id: 1, name: 'Crime and Punishment', authorId: '11' },
  { id: 2, name: 'Anna Karenina', authorId: '22' },
  { id: 3, name: 'When Nietzsche Wept', authorId: '33' },
  { id: 4, name: 'Animal Farm', authorId: '44' },
  { id: 5, name: 'The Schopenhauer Cure', authorId: '33' },
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
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

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const app = express();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'OlaMundo',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'OlaMundo', //a func that will tell GraphQL where to get this info
      },
    }),
  }),
});

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(5000, () => console.log('Server Running...'));

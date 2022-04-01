// import the necessary packages and modules
const express = require ('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');
const { type } = require('os');

// Import necessary files
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth')
const db = require ('./config/connection');


// Define the server and the local port 3001
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

// Sets up Middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Adding build lines
if (process.env.NODE_ENV ==='production'){
    app.use(express.static(path.join(__dirname,'../client/build')));
}
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../client/build/index.html'));
})

// Create a new instance of Apollo server using the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start()
    server.applyMiddleware({app})

    db.once('open', () =>{
        app.listen(PORT, () => {
            console.log(`Server is running ${PORT}`)
            console.log('GraphQL server  http://127.0.0.1')
        })
    })
};


startApolloServer(typeDefs, resolvers);
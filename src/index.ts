import { ApolloServer } from "@apollo/server";
import express, { Express } from "express"
import { expressMiddleware } from "@apollo/server/express4";
import http from 'http'
import dotenv from "dotenv";
import cors from "cors"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { ConnectDB } from "./db/connect"
import mergedTypeDefs from "./Schema/index";
import playground from 'graphql-playground-middleware-express';
import mergedResolver from "./resolvers/index";

dotenv.config()

const app: Express = express()
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolver,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        introspection: true,
        csrfPrevention: false, 
        cache: "bounded",
    })

    await server.start();
    app.use('/graphql',
        cors({
            origin: '*', 
            allowedHeaders: 'Content-Type, Authorization',
            credentials:true
        }),
        express.json(),
        express.urlencoded({ extended: true }),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res }),
        }),
    );
    app.get('/playground', playground({ endpoint: '/graphql' }));

    await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    await ConnectDB()
}

startServer()



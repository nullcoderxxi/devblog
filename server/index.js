import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './config/db.js';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { getUser } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
await server.start();

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
}));

await connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 GraphQL playground: http://localhost:${PORT}/graphql`);
});

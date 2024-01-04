import express from 'express';
import { bot } from './bot';

const app = express();
app.get('/', (_, res) => res.end(200))
app.listen(process.env.PORT || 8080)

bot();

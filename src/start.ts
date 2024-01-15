import express from 'express';
import { bot } from './bot';
import './database/connection'

const app = express();
app.get('/', (_, res) => res.send(200))
app.listen(process.env.PORT || 8080)

bot();

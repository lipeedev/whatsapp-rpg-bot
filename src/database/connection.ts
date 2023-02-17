import mongoose from 'mongoose';
const app = mongoose.connection;

const connect = () => mongoose.connect(process.env.MONGO_URL);
//mongoose.set('strictQuery', false)

app.on("error", () => mongoose.disconnect());
app.on("disconnected", () => connect());
app.on('connected', () => console.log('[DATABASE] conectado ✅'));

connect();
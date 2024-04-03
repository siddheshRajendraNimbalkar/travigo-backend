import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.js';
import residencyRouter from './routes/residency.js';

dotenv.config();
const app = express();

const Port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(Port,()=> console.log(`listening on port ${Port}`) );

app.use('/api/v1/user', userRouter);
app.use('/api/v1/residency', residencyRouter);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const  userRouter = require('./routes/userRouter');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(()=> {console.log("connected to the database ...")}).catch((e)=>{console.log(e)});

app.use(cors({
    exposedHeaders: 'x-auth-token'
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json());


app.use('/user', userRouter);

app.listen(PORT, ()=> console.log(`listening to port ${PORT}`));
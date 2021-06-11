const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const delRouter = require("./routes/deliveryRouter");
const { check, validationResult } = require('express-validator');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.DB_URl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to database")
})
    .catch((error) => {
        console.log(error)
    })

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
//app.use(expressValidator);

app.use('/api/asd', delRouter);

app.listen(PORT, () => {
    console.log(`server running at   http://localhost:${PORT}/api/asd  ......../`);

});
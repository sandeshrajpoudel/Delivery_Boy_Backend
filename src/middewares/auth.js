const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const DeliveryAddress = require("../models/deliveryAddress");
const Users = require("../models/Users")



const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.json({
      status: "fail",
      message: "Unauthorized"
    })

  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified
    next();
  } catch (error) {

    console.log(error.toString())
    res.json({
      status: "error",
      message: error.toString()
    })
  }
};
module.exports = verifyToken;
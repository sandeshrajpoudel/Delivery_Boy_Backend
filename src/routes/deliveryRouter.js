const dotenv = require("dotenv").config();
const express = require("express");
const Router = express.Router();
const { param, check, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DeliveryAddress = require("../models/deliveryAddress");
const Users = require("../models/Users")
const verifyToken = require("../middewares/auth");
const mongoose = require("mongoose");
const jwt_decode = require("jwt-decode")

// Read all delivery addresses related to an user
Router.get("/delivery_addresses/of/:user_id",
  param('user_id').custom(async (value, { req }) => {
    const user = await User.findById(value);
    if (!user) {
      throw new Error("Invalid Id of user");
    }
    return false;
  }),
  async (req, res) => {


    try {
      const allAddresses = DeliveryAddress
        .find({ "user": req.params.user_id },
          { "address": 1, "_id": 1 })
      res.json({
        status: "success",
        data: { message: (await allAddresses).toString() }

      })
    }
    catch (error) {
      console.log(error)
      res.json({
        status: "error",
        message: error.toString()
      })
    }
  });


//Add new delivery address
Router.post('/delivery_addresses',
  [
    check('email').isEmail(),
    check('address').isLength({ min: 3 }),
    check('phone').isLength({ min: 9, max: 10 }),
    check('secondaryphone').optional().isLength({ min: 9, max: 10 }),
    check('location').optional().isLatLong(),
    check('message').optional().isLength({ min: 5 })


  ], verifyToken,
  async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.json({
        status: "error",
        message: "enter valid information"

      })
    }

    try {
      const user = req.user
      //console.log("user:"+JSON.stringify(user))

      let postAddress = new DeliveryAddress({
        user: user.user_id,
        phone: req.body.phone,
        secondaryPhone: req.body.secondaryPhone,
        email: req.body.email,
        address: req.body.address,
        message: req.body.message,
        location: req.body.location,

      })

      await postAddress.save()
      res.json({
        status: "success",
        message: postAddress
      })


    } catch (error) {
      console.log(error)
      res.json({
        status: "error",
        message: error.message
      })

    }
  });


// Edit delivery address

Router.put('/delivery_addresses/:id',

  param('id').custom(async (value, { req }) => {
    const user = await DeliveryAddress.findById(value);
    if (!user) {
      throw new Error("Invalid Id");
    }
    return false;
  }),

  [
    check('email').optional()
      .isEmail(),
    check('address').optional()
      .isLength({ min: 5 }),
    check('secondaryphone').optional()
      .isLength({ min: 9, max: 10 }),
    check('phone').optional()
      .isLength({ min: 9, max: 10 }),
    check('location').optional()
      .isLatLong(),
    check('message').optional().isLength({ min: 5, max: 100 })


  ], verifyToken,

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.json({
          status: "error",
          message: "enter valid information"

        })

      }

      let FindAddress = await DeliveryAddress.findById({
        _id: req.params.id
      })

      FindAddress.phone = req.body.phone,
        FindAddress.secondaryPhone = req.body.secondaryPhone,
        FindAddress.email = req.body.email,
        FindAddress.address = req.body.address,
        FindAddress.message = req.body.message,
        FindAddress.location = req.body.location,

        await FindAddress.save();

      res.json({
        status: "success",
        Data: FindAddress

      });

    } catch (error) {
      console.log(error)
      res.json({
        status: "error",
        message: error.toString
      })

    }


  });
//Delete delivery addresses

Router.delete('/delivery_addresses/:id',

  param('id').custom(async (value, { req }) => {
    const user = await DeliveryAddress.findById(value);
    if (!user) {
      throw new Error("Invalid Id");
    }
    return false;
  }),
  async (req, res) => {
    try {
      const del_Address = await DeliveryAddress.findById({
        _id: req.params.id
      })

      const del = await del_Address.remove()
      res.json({
        status: 'successfull',
        message: 'Address deleted'
      })

    } catch (error) {
      res.json({
        status: "error",
        message: error
      })

    }

  });


//register user


Router.post('/users/register',
  async (req, res) => {


    try {

      const emailExists = await Users.findOne({
        email: req.body.email
      });

      if (emailExists) {
        res.json("email already exists");

      } else {

        const hash_password = await bcrypt.hash(req.body.password, 10);

        const User = new Users({
          email: req.body.email,
          password: hash_password,
        });

        await User.save();
        res.json({
          status: "success",
          message: User
        });
      }
    } catch (error) {
      res.json(error.toString())
    }
  });



//login user
Router.post('/users/login'
  , async (req, res) => {
    try {
      const userEmail = await Users.findOne({ email: req.body.email });
      if (userEmail == null) {
        return res.json({
          status: "fail",
          data: { message: 'Username doesnt exists.' }
        });
      }
      else if ((await bcrypt.compare(req.body.password, userEmail.password)) == false) {
        return res.json({
          status: "fail",
          data: { message: 'password not matching.' }
        });
      } else {
        // console.log(userEmail)
        const payload = {
          // {
          user_id: userEmail._id,
          email: userEmail.email
        }
        console.log("payload: ")
        console.log(payload)
        const token = jwt.sign(payload,
          process.env.SECRET_KEY);
        // console.log(token)
        res.setHeader('X-Token', token)
        // res.setHeader('ABC', "DEF");

        res.json({
          status: "Success",
          data: {userEmail, token}
        })
      }
    } catch (error) {
      console.log(error);
      res.json(error);


    }

  });





module.exports = Router;
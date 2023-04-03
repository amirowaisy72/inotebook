const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Amirisagoodboy";

//ROUTE 1: Create a user using POST "/api/auth/createuser" Does not require auth
router.post(
  "/createuser",
  [
    body("name", "Minimum length of name is 3").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      let success = false
      try {
        //Check if user already exists
        let emailCheck = req.body.email;
        let exists = await User.findOne({ emailCheck });
        if (exists) {
          res.send({success, message:"This email already exists"});
        } else {
          //Generate password hash
          const salt = await bcrypt.genSalt(10);
          const secPassword = await bcrypt.hash(req.body.password, salt);
          //Create a new user
          let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
          });

          //JWS Token
          const data = {
            user: {
              id: user.id,
            },
          };
          const authToken = jwt.sign(data, JWT_SECRET);
          success = true
          res.send({success,authToken});
        }
      } catch (error) {
        res.status(500).send({success,error:error.message});
      }
    }
  }
);

//ROUTE 2 : Authenticate a user using POST "/api/auth/login" Does not require auth
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Wrong Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      let success = false
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          res
            .status(400)
            .json({ success, error: "Please try to login with correct credentials" });
        } else {
          const passwordCompare = await bcrypt.compare(password, user.password);
          if (!passwordCompare) {
            res
              .status(400)
              .json({ success,error: "Please try to login with correct credentials" });
          } else {
            //Password matched & found, enail matched & found, grant him the profile page

            //JWS Token
            const payload = {
              user: {
                id: user.id,
              },
            };
            const authToken = jwt.sign(payload, JWT_SECRET);
            success = true
            res.send({success,authToken});
          }
        }
      } catch (error) {
        res.status(500).json({ success, error: error.message });
      }
    }
  }
);

//ROUTE 3 : Get loggedIn user details using POST "/api/auth/getuser" Login require
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

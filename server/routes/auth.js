const admin = require("../config/firebase.config");
const router = require('express').Router()

const user = require('../models/user')
router.post("/login", async (req, res) => {
  console.log("REQUEST: LOGIN")
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await admin.auth().verifyIdToken(token);
    console.log(decodeValue)
    if(!decodeValue) return res.status(401).send({message: "Unauthorized Access"})
    else{
      const userExists = await user.findOne({"user_id":decodeValue.user_id})
      if(!userExists){
        await newUserData(decodeValue, req, res)
      }
      else{
        await updateUserData(decodeValue, req, res)
      }
    }

  } catch (error) {
    return res.status(401).send({message: "Unauthorized Access"})
  }
})





const newUserData = async (decodeValue, req, res) => {
  const newUser = new user({
    name:decodeValue.name,
    email:decodeValue.email,
    imageUrl:decodeValue.picture,
    user_id:decodeValue.user_id,
    email_verified:decodeValue.email_verified,
    role:"ADMIN",
    auth_time:decodeValue.auth_time
  })

  try{
    const savedUser = await newUser.save();
    res.status(200).send({user:savedUser, success: true})
  }
  catch (error){
    return res.status(500).send({message:error})
  }


}
const updateUserData = async (decodeValue, req, res) => {
  const filter = {user_id : decodeValue.user_id}
  const options = {
    upsert:true,
    new:true
  }
  try {
    const result = await user.findOneAndUpdate(
        filter,
        {auth_time:decodeValue.auth_time},
        options
        )
    res.status(200).send({user:result, success:true})
  }catch (error) {
    res.status(401).send({message: "Unauthorized Access"})
  }
}


module.exports = router;
const admin = require("../config/firebase.config");
const router = require('express').Router()

const user = require('../models/user')

router.post("/login", async (req, res) => {
  console.log("REQUEST: LOGIN")
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await admin.auth().verifyIdToken(token);
    // console.log(decodeValue)
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


router.put("/favourites/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const songId = req.query;

  try {
    console.log(filter, songId);
    const result = await user.updateOne(filter, {
      $push: { favourites: songId },
    });
    res.status(200).send({ success: true, msg: "Song added to favourites" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get("/getall", async (req, res) => {
  const options = {
    // sort returned documents in ascending order
    sort: { createdAt: 1 },
  };

  const cursor = await user.find().sort(options.sort);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.get("/getUser/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };

  const userExists = await user.findOne({ _id: filter });
  if (!userExists)
    return res.status(400).send({ success: false, msg: "Invalid User ID" });
  if (userExists.favourites) {
    res.status(200).send({ success: true, data: userExists });
  } else {
    res.status(200).send({ success: false, data: null });
  }
});

router.put("/updateRole/:userId", async (req, res) => {
  console.log(req.body.data.role, req.params.userId);
  const filter = { _id: req.params.userId };
  const role = req.body.data.role;

  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findOneAndUpdate(filter, { role: role }, options);
    res.status(200).send({ user: result });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };

  const result = await user.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
});

router.put("/removeFavourites/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const songId = req.query;

  try {
    console.log(filter, songId);
    const result = await user.updateOne(filter, {
      $pull: { favourites: songId },
    });
    res
        .status(200)
        .send({ success: true, msg: "Song removed from favourites" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});


module.exports = router;

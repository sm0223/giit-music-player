const router = require('express').Router()

const artist = require('../models/artist')

router.get("/getAll", async (req, res) => {
  const options = {
    sort: { createdAt: 1 } // sort returned documents in ascending order
  };

  const cursor = await artist.find().sort(options.sort);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: false, msg: "No Data Found" });
  }
});

router.get("/getOne/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const cursor = await artist.findOne(filter);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: false, msg: "No Data Found" });
  }
});

router.post("/save", async (req, res) => {
  console.log("REQUEST ARTIST SAVE" + req.body)
  const newArtist = artist({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    instagram: req.body.instagram,
  });
  try {
    const savedArtist = await newArtist.save();
    res.status(200).send({ artist: savedArtist });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await artist.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
});

module.exports = router
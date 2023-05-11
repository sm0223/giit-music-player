const mongoose = require("mongoose");


const artistSchema = mongoose.Schema(
    { name: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      instagram: {
        type: String,
      },
    },
    { timestamps: true }
);
module.exports = mongoose.model("artist", artistSchema);
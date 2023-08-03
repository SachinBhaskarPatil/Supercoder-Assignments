const mongoose = require("mongoose");

module.exports.init = async function () {
  await mongoose.connect(
    "mongodb+srv://use:sachin65@todo-db.5mv9gk2.mongodb.net/superCoders?retryWrites=true&w=majority"
  )
};
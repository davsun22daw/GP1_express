const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  nomLogin: { type: String, required: true, unique: true },
  ContrasenyaLogin: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("ContrasenyaLogin")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.ContrasenyaLogin, salt);
    this.ContrasenyaLogin = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isCorrectContrasenyaLogin = function (
  ContrasenyaLogin,
  callback
) {
  bcrypt.compare(
    ContrasenyaLogin,
    this.ContrasenyaLogin,
    function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    }
  );
};

module.exports = mongoose.model("User", UserSchema);

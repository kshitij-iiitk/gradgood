import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      minlength: 6,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
    },
    upiId: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to handle profile pic for Google users
userSchema.pre("save", function (next) {
  if (this.isGoogleUser && !this.profilePic) {
    this.profilePic = `https://avatar.iran.liara.run/public/${
      this.gender === "male" ? "boy" : this.gender === "female" ? "girl" : "boy"
    }?username=${this.userName}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

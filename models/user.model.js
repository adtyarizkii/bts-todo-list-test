const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error(
            "Username must be at least 6 characters"
          );
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// full text search
userSchema.index({ "$**": "text" });

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    email,
    _id: { $ne: excludeUserId },
    isDeleted: false,
  });
  return !!user;
};

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({
    username,
    _id: { $ne: excludeUserId },
    isDeleted: false,
  });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Check email for logout
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @param {ObjectId} [refreshToken] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailLogout = async function (email, refreshToken, excludeUserId) {
  const user = await this.findOne({ email, refreshToken, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = model('User', userSchema);

module.exports = User;

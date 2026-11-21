import { User } from "../models/usersmodel.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const exitingUser = await User.findOne({ username });
    if (exitingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (error) {
    res.json({ message: `Somthing wen wrong ${error}` });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Username and password is wrong" });
  }
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    if (bcrypt.compare(password, user.password)) {
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();

      return res.status(httpStatus.OK).json({ token: token });
    }
  } catch (error) {
    return res.status(500).json({ message: `Somthing went wrong ${error}` });
  }
};

export { register, login };

import { User } from "../models/usersmodel";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

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

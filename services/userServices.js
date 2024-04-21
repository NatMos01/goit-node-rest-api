import User from "../models/users.js";

export const findUser = (filter) => User.findOne(filter);

export const findUserById = (id) => User.findById(id);
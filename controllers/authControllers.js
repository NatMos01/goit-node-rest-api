import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import Jimp from 'jimp';

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve('public', 'avatars');


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });

    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await authServices.signup({
        ...req.body,
        password: hashPassword,
        avatarURL,
    });

    res.status(201).json({
        user: newUser,
    });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is invalid');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is invalid');
    }

    const { _id: id } = user;

    const payload = {
        id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
    const response = await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: response,
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    });
};

const signout = async (req, res) => {
    const { _id } = req.user;

    await authServices.updateUser({ _id }, { token: '' });

    res.status(204).json();
};

const updateAvatar = async (req, res) => {
    if (!req.file) throw HttpError(400, 'The file was not found');

    const { _id } = req.user;


    const { path: tempUpload, originalname } = req.file;

    const image = await Jimp.read(tempUpload);
    if (!image) throw new Error('Failed to read image');

    await image.resize(250, 250).writeAsync(tempUpload);

    const uniquePrefix = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsPath, uniquePrefix);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', uniquePrefix);

    await authServices.updateUser({ _id }, { avatarURL });

    res.json({
        avatarURL,
    });
};

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
import User from '../models/users.js';

export const signup = async data => {
    const response = await User.create(data);
    return { email: response.email, subscription: response.subscription };
};

export const findUser = async user => {
    return await User.findOne(user);
};

export const findUserById = async id => {
    return await User.findById(id);
};

export const updateUser = async (user, data) => {
    return await User.findByIdAndUpdate(user, data, {
        returnDocument: 'after',
    }).select('email subscription -_id');
};
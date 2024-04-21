import { Contact } from '../models/contacts.js';

//GET
export const listContacts = async (filter = {}) => {
    return Contact.find(filter).populate('owner', 'email subscription');
};

//GET ID
export const getContactById = async contactId => {
    return Contact.findById(contactId);
};

//DEL
export const removeContact = async contactId => {
    return Contact.findByIdAndDelete(contactId);
};

//POST
export const addContact = async data => {
    return Contact.create(data);
};

//PUT ID
export const updateContactById = async (contactId, data) => {
    return Contact.findByIdAndUpdate(contactId, data, {
        new: true,
    });
};

//PATCH
export const updateFavoriteStatus = async (contactId, data) => {
    const status = { favorite: data };
    return Contact.findByIdAndUpdate(contactId, status, {
        new: true,
    });
};
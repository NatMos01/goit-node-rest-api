import * as contactsService from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../middlewares/ctrlWrapper.js';

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;

    const results = await contactsService.listContacts({ owner });
    res.json(results);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await contactsService.getContactById({ _id: id, owner });

    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await contactsService.removeContact({ _id: id, owner });

    if (!result) {
        throw HttpError(404, 'Not found');
    }

    res.json(result);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;

    const result = await contactsService.addContact({ ...req.body, owner });

    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await contactsService.updateContactById(
        { _id: id, owner },
        req.body
    );

    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const favorite = req.body.favorite;

    const result = await contactsService.updateFavoriteStatus(
        { _id: id, owner },
        favorite
    );

    if (!result) {
        throw HttpError(404, 'Not found');
    }

    res.status(200).json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
};
import contactsServices from "../services/contactsServices.js";
import crypto from "crypto";
import createContactSchema, {
   updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
   const contacts = await contactsServices.listContacts();
   res.send(contacts);
};

export const getOneContact = async (req, res) => {
   try {
      const contact = await contactsServices.getContactById(req.params.id);
      if (contact) {
         res.status(200).json(contact);
      } else {
         res.status(404).json({ message: "Not found" });
      }
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
};

export const deleteContact = async (req, res) => {
   try {
      const contact = await contactsServices.removeContact(req.params.id);
      if (contact) {
         res.status(200).json(contact);
      } else {
         res.status(404).json({ message: "Not found" });
      }
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
};

export const createContact = async (req, res) => {
   const { name, email, phone } = req.body;
   const { value, error } = createContactSchema.validate(req.body);
   if (typeof error !== "undefined") {
      return res.status(400).send("validation error");
   }
   const contact = await contactsServices.addContact({ name, email, phone });

   res.status(201).send({ id: crypto.randomUUID(), ...value });
};

export const updateContact = async (req, res) => {
   const { name, email, phone } = req.body;
   if (!name && !email && !phone) {
      return res.status(400).send("Body must have at least one field");
   }
   const { value, error } = updateContactSchema.validate(req.body);
   if (typeof error !== "undefined") {
      return res.status(400).send("Validation error");
   }
   if (!(await contactsServices.getContactById(req.params.id))) {
      return res.status(404).send("Not found");
   }
   const contact = await contactsServices.updateContact(req.params.id, {
      name,
      email,
      phone,
   });

   res.status(200).send(contact);
};
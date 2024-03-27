import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function readContacts() {
   const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
   return JSON.parse(data);
}

async function writeContacts(contacts) {
   const data = fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, undefined, 2)
   );
   return data;
}

async function listContacts() {
   const contacts = await readContacts();
   return contacts;
}

async function getContactById(contactId) {
   const contacts = await readContacts();
   return contacts.find((contact) => contact.id === contactId);
}

async function removeContact(contactId) {
   const contacts = await readContacts();
   const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
   );
   if (contactIndex !== -1) {
      const removedContact = contacts.splice(contactIndex, 1)[0];
      await writeContacts(contacts);
      return removedContact;
   } else {
      return null;
   }
}

async function addContact({ name, email, phone }) {
   const contacts = await readContacts();
   const newContact = { id: crypto.randomUUID(), name, email, phone };
   contacts.push(newContact);
   await writeContacts(contacts);
   return newContact;
}

async function updateContact(contactId, { name, email, phone }) {
   const contacts = await readContacts();
   const updatedIndex = contacts.findIndex(
      (contact) => contact.id === contactId
   );

   if (updatedIndex !== -1) {
      if (name !== undefined) {
         contacts[updatedIndex].name = name;
      }
      if (email !== undefined) {
         contacts[updatedIndex].email = email;
      }
      if (phone !== undefined) {
         contacts[updatedIndex].phone = phone;
      }
      await writeContacts(contacts);
      return contacts[updatedIndex];
   }
}
const contactsServices = {
   listContacts,
   getContactById,
   removeContact,
   addContact,
   updateContact,
};
export default contactsServices;
import { promises as fs } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";

const contactsPath = join("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const dataArr = JSON.parse(data);
    return dataArr;
  } catch (error) {
    throw new Error("Failed to list contacts: " + error.message);
  }
}

async function getContactById(contactId) {
  try {
    const dataArr = await listContacts();
    return dataArr.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    throw new Error("Failed to get contact by ID: " + error.message);
  }
}

async function removeContact(contactId) {
  try {
    const dataArr = await listContacts();
    const index = dataArr.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = dataArr.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(dataArr, null, 2));
    return result;
  } catch (error) {
    throw new Error("Failed to remove contact: " + error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const dataArr = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    dataArr.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(dataArr, null, 2));
    return newContact;
  } catch (error) {
    throw new Error("Failed to add contact: " + error.message);
  }
}

export { listContacts, getContactById, removeContact, addContact };
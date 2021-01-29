import { getPaths } from '../helpers/utils.js';
import path from "path";
import fs from 'node:fs/promises';
import { readFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const { __dirname } = getPaths(import.meta.url);
const contactsPath = path.join(__dirname, "../../db/contacts.json");

async function listContacts(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    const parsedData = JSON.parse(data);

    return res.status(200).send(parsedData);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    const { contactId } = req.params;
    const parsedData = JSON.parse(data)
    let existContact = parsedData.find((contact) => contact.id == contactId);

    existContact
      ? res.status(200).send(existContact)
      : res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
}

async function removeContact(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    const { contactId } = req.params;
    const parsedData = JSON.parse(data);
    const existContact = parsedData.find((contact) => contact.id == contactId);

    if (!existContact) {
      return res.status(404).send({ message: "Not found" });
    }

    const updatedData = parsedData.filter((contact) => contact.id !== contactId);
    const stringifyParsedData = JSON.stringify(updatedData, null, 2);

    await fs.writeFile(contactsPath, stringifyParsedData, "utf-8");

    return res.status(200).send({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  try {

    const data = await fs.readFile(contactsPath, "utf-8");

    const newContact = { id: uuidv4(), ...req.body };
    const parsedData = JSON.parse(data).concat(newContact);
    const stringifyParsedData = JSON.stringify(parsedData, null, 2);

    await fs.writeFile(contactsPath, stringifyParsedData, "utf-8");

    return res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    const { contactId } = req.params;
    const parsedData = JSON.parse(data);
    const existContactIdx = parsedData.findIndex((contact) => contact.id== contactId);

    if (existContactIdx === -1) {
      return res.status(404).send({ message: "Not found" });
    }

    const updatedData = parsedData.map((contact) =>
      contact.id == contactId ? { ...contact, ...req.body } : contact
    );
    const stringifyParsedData = JSON.stringify(updatedData, null, 2);

    await fs.writeFile(contactsPath, stringifyParsedData, "utf-8");

    const updatedContact = updatedData[existContactIdx];

    return res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
}

export {
  listContacts,
  addContact,
  removeContact,
  getContactById,
  updateContact,
};

import { Router } from "express";
import _ from "lodash";

import * as contactsModel from "./contacts.model.js";
import * as contactsMiddleware from "../helpers/validate.js";

const { listContacts, getContactById, addContact, removeContact, updateContact } = contactsModel;
const { validateCreatedContact, validateUpdatedContact } = contactsMiddleware;

const contactRouter = Router();

contactRouter.get("/", listContacts);
contactRouter.get("/:contactId", getContactById);
contactRouter.post("/", validateCreatedContact, addContact);
contactRouter.delete("/:contactId", removeContact);
contactRouter.patch("/:contactId", validateUpdatedContact, updateContact);

export default contactRouter;
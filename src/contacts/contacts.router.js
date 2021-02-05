import { Router } from "express";
import * as contactsController from "./contacts.controller.js";
import * as  contactsMiddleware  from "./contacts.middleware.js";

const { listContacts, getContactById } = contactsController;
const { addContact, removeContact, updateContact } = contactsController;
const {
  validateCreateContact,
  validateUpdateContact,
  validateContactID,
} = contactsMiddleware;

const contactRouter = Router();
contactRouter.get("/", listContacts);
contactRouter.get("/:contactId", validateContactID, getContactById);
contactRouter.post("/", validateCreateContact, addContact);
contactRouter.delete("/:contactId", validateContactID, removeContact);
contactRouter.patch(
  "/:contactId",
  validateContactID,
  validateUpdateContact,
  updateContact
);

export default contactRouter;

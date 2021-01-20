const path = require("path");
const fs = require("fs").promises;

const contactsPath = path.join("db", "contacts.json");

function listContacts() {
  const readContacts = fs
    .readFile(contactsPath)
    .then((data) => data.toString())
    .then((contacts) => console.table(JSON.parse(contacts)))
    .catch((err) => console.log(err.message));
}

function getContactById(contactId) {
  const readContacts = fs
    .readFile(contactsPath)
    .then((data) => {
      const getContacts = JSON.parse(data);
      let contactToFind = getContacts.find(
        (contact) => contact.id === contactId
      );
      if (contactToFind === undefined) {
        console.log(`Contact with id ${contactId} not found!`);
      } else {
        console.table(contactToFind);
      }
    })
    .catch((err) => console.log(err.message));
}

function removeContact(contactId) {
  const readContacts = fs
    .readFile(contactsPath)
    .then((data) => {
      const getContacts = JSON.parse(data);
      let newContacts = getContacts.filter(
        (contact) => contact.id !== contactId
      );
      if (getContacts.length === newContacts.length) {
        console.log(`Contact with id ${contactId} not found!`);
      } else {
        fs.writeFile(contactsPath, JSON.stringify(newContacts));
        console.table(newContacts);
        console.log(`Contact removed!`);
      }
    })
    .catch((err) => console.log(err.message));
}

function addContact(name, email, phone) {
  const readContacts = fs
    .readFile(contactsPath)
    .then((data) => {
      const getContacts = JSON.parse(data);
      let newContacts = [
        ...getContacts,
        { id: getContacts.length + 1, name, email, phone },
      ];
      fs.writeFile(contactsPath, JSON.stringify(newContacts));
      console.table(newContacts);
      console.log(`Contacts  updated!`);
    })
    .catch((err) => console.log(err.message));
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};

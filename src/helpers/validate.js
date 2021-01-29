import Joi from 'joi';

function validateCreatedContact(req, res, next) {
  console.log(req.body);
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  const validatedContact = createContactRules.validate(req.body);

  if (validatedContact.error) {
    console.log(validatedContact.error);
    return res.status(400).send({ message: "missing required name field" });
  }

  next();
}

function validateUpdatedContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });

  const validatedContact = updateContactRules.validate(req.body);

  if (validatedContact.error) {
    return res.status(400).send({ message: "missing fields" });
  }

  next();
}

export { validateCreatedContact, validateUpdatedContact };
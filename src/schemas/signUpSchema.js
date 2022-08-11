import joi from "joi";

const signUpSchema = joi.object({
  email: joi.string().email().max(50).required(),
  password: joi
  .string()
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
  .required(),
  username: joi.string().max(20).required(),
  pictureUrl: joi.string().required()
});

export default signUpSchema;

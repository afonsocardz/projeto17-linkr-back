function validateSchema(schema) {
  return (req, res, next) => {
    const body = req.body;
    const { error } = schema.validate(body, { abortEarly: false });
    if(error){
      return res.status(422).send(error.details.map((response) => response.message));
    }
    next();
  }
}

export default validateSchema;
import joi from 'joi';

const Post = joi.object({
  url: joi.string()
    .uri()
    .required(),
  message: joi.string(),
  userId: joi.number()
    .required(),
})

export default Post;
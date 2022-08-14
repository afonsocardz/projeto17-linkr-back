import joi from 'joi';

const Post = joi.object({
  url: joi.string()
    .uri()
    .required(),
  message: joi.string().allow(null, "")
})

export default Post;
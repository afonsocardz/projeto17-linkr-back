import urlMetadata from "url-metadata";

async function validateUrl(req, res, next) {
  const post = req.body;
  try {
    const { title, image, description, source } = await urlMetadata(post.url);
    res.locals.post = { ...post, title, image, description, source };
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("URL couldn't be reach");
  }
}

export default validateUrl;

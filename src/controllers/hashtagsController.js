import {
  returnPostsHashtags,
  searchForHashtag,
  trendingHashtags,
} from "../repositories/hashtagsRepository.js";

async function getTrendingHashtags(req, res) {
  try {
    const { rows: trending } = await trendingHashtags();

    return res.status(200).send(trending);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function redirectHashtag(req, res) {
  const { hashtag } = req.params;
  const newHashtag = "#"+hashtag
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const { rowCount: metHashtag } = await searchForHashtag(newHashtag);

    if (metHashtag === 0) return res.status(404).send("Hashtag not foud");

    const { rows: postsHashtags } = await returnPostsHashtags(newHashtag);

    if (postsHashtags.length === 0) return res.status(404).send("No posts related to this hashtag");

    const newPostsHashtags = await postsHashtags.slice(startIndex, endIndex)

    res.status(200).send(newPostsHashtags);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { getTrendingHashtags, redirectHashtag };

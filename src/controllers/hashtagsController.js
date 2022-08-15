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

  try {
    const { rowCount: metHashtag } = await searchForHashtag(newHashtag);

    if (metHashtag === 0) return res.status(404).send("Hashtag not foud");

    const { rows: postsHashtags } = await returnPostsHashtags(newHashtag);

    if (postsHashtags.length === 0) return res.status(404).send("No posts related to this hashtag");

    res.status(200).send(postsHashtags);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { getTrendingHashtags, redirectHashtag };

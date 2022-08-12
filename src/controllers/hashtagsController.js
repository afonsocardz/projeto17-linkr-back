import { trendingHashtags } from "../repositories/hastagsRepositories.js";

async function getTrendingHashtags(req, res) {
  try {
    const { rows: trending } = await trendingHashtags();

    return res.status(200).send(trending);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { getTrendingHashtags };

import { createHashtags, searchForHashtag, selectHashtags, trendingHashtags } from "../repositories/hastagsRepositories.js";

async function getTrendingHashtags(req, res) {
  try {
    const { rows: trending } = await trendingHashtags();

    return res.status(200).send(trending);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function populatingHashtags(req, res) {
  try {
    const { rows: hashtag, rowCount: foundHashtag } = await selectHashtags();
    console.log(hashtag);
  
    if (foundHashtag === 0) return res.status(404).send("No hashtag was found");
  
    const { rows, rowCount: metHashtag } = await searchForHashtag(hashtag);
    console.log(rows);
    
    if (metHashtag === 1) return res.status(409).send("Hashtag already exists");
  
    await createHashtags(hashtag);
  
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500)
  }
}

export { getTrendingHashtags, populatingHashtags };

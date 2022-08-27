import { respostPostId, shares } from "../repositories/repostsRepository.js";

async function getReposts(req, res) {
  const userId = res.locals.user.id;

  try {
    const { rows: reposts } = await shares(userId);
    console.log(reposts);

    res.status(200).send(reposts);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function changeReposts(req, res) {
  const { postId } = req.params;
  const { id: userId } = res.locals;

  try {
    await respostPostId(postId, userId);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export { getReposts, changeReposts };

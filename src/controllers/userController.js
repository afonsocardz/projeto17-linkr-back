import {
  deleteFollowedUser,
  getFollowedsByUserId,
  getUserById,
  getUserByUsername,
  insertFollowedUser,
} from "../repositories/userRepository.js";

export async function getUser(req, res) {
  const { userId } = req.params;

  try {
    const result = await getUserById(userId);
    return res.send(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro ao ver posts", label: "error" }]);
  }
}

export async function searchUser(req, res) {
  const { username } = req.params;

  try {
    const { rows: user } = await getUserByUsername(username);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro interno!");
  }
}

export async function getFolloweds(req, res) {
  const { userId } = req.params;
  const { user } = res.locals;

  if (Number(user.id) !== Number(userId)) {
    return res.status(401).send("Não autorizado!");
  }
  try {
    const { rows: followeds } = await getFollowedsByUserId(userId);
    console.log(followeds);
    res.status(200).send(followeds);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar usuários seguidos!");
  }
}

export async function followUnfollow(req, res) {
  const { userId, followedUserId } = req.body;
  if (!userId || !followedUserId) {
    return res.send("Doidera!");
  }
  const { user } = res.locals;
  if (Number(user.id) !== Number(userId)) {
    return res.status(401).send("Não autorizado!");
  }

  try {
    const {
      rows: [followedUser],
    } = await getUserById(Number(followedUserId));
    if (!followedUser) {
      res.status(404).send("Usuário não encontrado!");
      return;
    }
    const { rows: followeds } = await getFollowedsByUserId(userId);
    const isFollowed = followeds?.filter(
      (followed) => followed.followedUserId === Number(followedUserId)
    );
    if (isFollowed.length === 0) {
      await insertFollowedUser(userId, followedUserId);
      res.status(201).send("User Followed!");
      return;
    } else {
      await deleteFollowedUser(userId, followedUserId);
      res.status(200).send("User Unfollowed!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar usuários seguidos!");
  }
}

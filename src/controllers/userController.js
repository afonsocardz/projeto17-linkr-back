import {
  deleteFollowedUser,
  getFollowedsByUserId,
  getFollowedUsersByUsername,
  getUnfollowedUsersByUsername,
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
  const { user } = res.locals;

  try {
    const { rows: followedUsers } = await getFollowedUsersByUsername(
      username,
      Number(user.id)
    );
    const { rows: unfollowedUsers } = await getUnfollowedUsersByUsername(
      username,
      Number(user.id)
    );
    const usersList = [...followedUsers, ...unfollowedUsers];
    res.status(200).send(usersList);
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

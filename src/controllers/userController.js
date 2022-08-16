import {
  getFollowedsByUserId,
  getUserById,
  getUserByUsername,
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
  try {
    const {
      rows: [user],
    } = await getUserById(Number(userId));
    if (!user) {
      return res.status(404).send("Usuário não encontrado!");
    }
    const { rows: followeds } = await getFollowedsByUserId(userId);
    console.log(followeds);
    res.status(200).send(followeds);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar usuários seguidos!");
  }
}

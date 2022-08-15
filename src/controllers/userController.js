import {
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

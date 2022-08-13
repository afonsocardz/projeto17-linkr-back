
import { getUserById } from '../repositories/userRepository.js'

export async function getUser(req, res) {
  const { userId } = req.params; 

  try {
    const result = await getUserById(userId);
    return request.send(result.rows[0]);
  } catch (error) {
    console.log(err);
    res.status(500).send([{ msg: 'Erro ao ver posts', label: 'error' }]);
  }
};


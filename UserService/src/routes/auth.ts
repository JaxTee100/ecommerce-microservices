import { Router } from 'express';
import { register, login, getAllUsers, getUserById, refreshToken, logoutUser, updateUser, deleteUser  } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/',  getAllUsers);
router.get('/:id', getUserById);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

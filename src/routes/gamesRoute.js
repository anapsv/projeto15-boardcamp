import { Router } from 'express';
import { loadGames, addNewGame } from '../controllers/gamesController.js';
import { ValidateGame } from '../middlewares/gamesMiddleware.js';

const router = Router();

router.get('/games', loadGames);
router.post('/games', ValidateGame, addNewGame);

export default router;
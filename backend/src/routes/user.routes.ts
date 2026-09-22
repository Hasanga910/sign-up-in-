import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;

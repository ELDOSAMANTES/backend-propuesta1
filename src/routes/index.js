import { Router } from 'express';
import requisicionRouter from './requisicion.router.js';
const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/requisiciones', requisicionRouter);

export default router;

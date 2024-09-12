import express from 'express';
import memberRouter from './MemberRouter.js';
import authRouter from './AuthRouter.js';

const router = express.Router();

router.use('/member', memberRouter);
router.use('/auth', authRouter);

export default router;
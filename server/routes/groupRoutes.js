import { Router } from 'express';
import { createGroups, getGroup, deleteGroup, getGroupById } from '../controller/groupController.js';

const router = Router();

router.get('/getgroup', getGroup);
router.get('/getgroup/:id', getGroupById);
router.post('/creategroup', createGroups);
router.delete('/deletegroup/:id' , deleteGroup)

export default router;

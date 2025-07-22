import express from 'express';
import {Userdata} from '../controllers/usersDetails.js'


const router =express.Router();
router.post("/user",Userdata);

export default router;
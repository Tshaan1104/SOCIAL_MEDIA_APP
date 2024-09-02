import express from 'express';
import {login,register} from '../controllers/Auth.js';
import {createpost} from '../controllers/createPost.js';
import {fetchAllPosts,fetchAllStories,fetchUserImg,fetchUserName} from '../controllers/Posts.js';

const router =express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/createpost', createpost);
router.get('/fetchAllPosts', fetchAllPosts);
router.get('/fetchAllStories', fetchAllStories);
router.get('/fetchUserImg', fetchUserImg);
router.get('/fetchUserName', fetchUserName);

export default router;
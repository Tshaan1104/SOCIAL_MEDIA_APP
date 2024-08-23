import express from 'express';
import {login,register} from '../controllers/Auth.js';
import {createpost} from '../controllers/createPost.js';
import {fetchAllPosts,fetchAllStories,fetchUserImg,fetchUserName} from '../controllers/Posts.js';

const router =express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/createpost', createpost);
router.post('/fetchAllPosts', fetchAllPosts);
router.post('/fetchAllStories', fetchAllStories);
router.post('/fetchUserImg', fetchUserImg);
router.post('/fetchUserName', fetchUserName);

export default router;
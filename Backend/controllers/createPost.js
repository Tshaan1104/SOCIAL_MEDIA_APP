import Post from "../models/Post.js";

export const createpost=async (req, res) => {
    try {
        const newPost=new Post(req.body);
        const post =await newPost.save();
        res.status(200).json(post);

    }
    catch (err) {
        res.status(500).json({error:err});
}}
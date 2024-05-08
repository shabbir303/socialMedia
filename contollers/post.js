import Post from "../models/post.js";
import User from "../models/User.js"

export const createPost = async(req, res)=>{
    try{
        const {userId, description, picturePath} = req.body;
        const user = await User.findbyId(userId);
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.userPicturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    }
    catch(err){
        res.status(409).json({message:err.message});
    }
}

// Read all posts
export const getFeedPosts = async(req, res)=>{
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
}

// Read user Posts
export const getUserPosts = async(req, res)=>{
    try{
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}

// like post 
export const likePosts = async(req, res)=>{
    try{
        const {id} =req.params
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);
        }

        const updatedPost = await Post.findById(
            id,
            {likes:post.like},
            {new:true}
        );
        res.status(200).json(updatedPost);
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
}
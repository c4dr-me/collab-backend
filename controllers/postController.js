const Post = require("../models/Post");
const User = require("../models/Schema");


const createPost = async (req, res) => {
    const { title, content, experience, isPaid, charge } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const post = new Post({
            user: req.user.id,
            title,
            content,
            experience,
            isPaid,
            charge,
        });

        await post.save();

        // Add the post to the user's posts array
        await User.findByIdAndUpdate(req.user.id, {
            $push: { posts: post._id }
        });

        res.status(201).json(post);
        console.log(post);
    } catch (error) {
        console.error('Error creating post:', error.message, error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const editPost = async (req, res) => {
    const { title, content, experience, isPaid, charge } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, experience, isPaid, charge },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const deletePost = async (req, res) => {
    console.log('Delete request received for ID:', req.params.id);
    try {
        if (!req.user) {
            console.log('User not authenticated');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove the post from the user's posts array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { posts: req.params.id }
        });

        console.log('Post deleted successfully:', post);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getUserPosts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const posts = await Post.find({ user: req.user.id }).populate('user', 'photo');
        res.json(posts);
        console.log(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find() .populate({
            path: 'user', // The field to populate
            select: 'photo name token', // Fields to include from the user document
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
};

module.exports = {
    createPost,
    editPost,
    deletePost,
    getUserPosts,
    getAllPosts, // Export the new function
};

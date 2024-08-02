const User = require('../models/Schema');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Setup multer for photo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File upload only supports the following filetypes - ' + filetypes));
    },
}).single('photo');

const getUserInfo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Populate the posts field
        const user = await User.findById(req.user.id)
            .select('-password') // Exclude the password field
            .populate('posts');  // Populate posts

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error); // Detailed logging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateUser = async (req, res) => {
    const { name, email, telephone } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, telephone },
            { new: true }
        ).select('-password'); // Do not send the password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadPhoto = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            let filePath = req.file.path.replace(/\\/g, '/');
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { photo: filePath },
                { new: true }
            ).select('-password'); // Do not send the password
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error uploading photo:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

const getUserByToken = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUserByToken, getUserInfo, updateUser, changePassword, uploadPhoto };

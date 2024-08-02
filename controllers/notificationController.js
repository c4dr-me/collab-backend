const User = require('../models/Schema');

const getNotifications = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  const { token, notificationId } = req.params;
  console.log('Request params:', req.params);
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notification.read = true;
    await user.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};

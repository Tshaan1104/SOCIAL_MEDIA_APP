import Chats from './models/Chats.js';
import Post from './models/Post.js';
import Stories from './models/Stories.js';
import User from './models/Users.js';

// Utility function for finding common elements in two arrays
function findCommonElements(array1, array2) {
    return array1.filter(element => array2.includes(element));
}

// Handle post like event
async function handlePostLiked(socket, { userId, postId }) {
    try {
        await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
        socket.emit("likeUpdated");
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

// Handle post unlike event
async function handlePostUnLiked(socket, { userId, postId }) {
    try {
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
        socket.emit("likeUpdated");
    } catch (error) {
        console.error('Error unliking post:', error);
    }
}

// Handle fetching a user's profile
async function handleFetchProfile(socket, { _id }) {
    try {
        const user = await User.findOne({ _id }, '-password');
        socket.emit("profile-fetched", { profile: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Handle updating a user's profile
async function handleUpdateProfile(socket, { userId, profilePic, username, about }) {
    try {
        const user = await User.updateOne({ _id: userId }, { profilePic, username, about });
        socket.emit("profile-fetched", { profile: user });
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

// Handle user search
async function handleUserSearch(socket, { username }) {
    try {
        const user = await User.findOne({ username });
        socket.emit('searched-user', { user });
    } catch (error) {
        console.error('Error searching user:', error);
    }
}

// Handle follow user
async function handleFollowUser(socket, { ownId, followingUserId }) {
    try {
        await User.updateOne({ _id: ownId }, { $addToSet: { following: followingUserId } });
        await User.updateOne({ _id: followingUserId }, { $addToSet: { followers: ownId } });

        const user1 = await User.findOne({ _id: ownId });
        const user2 = await User.findOne({ _id: followingUserId });
        socket.emit('userFollowed', { following: user1.following });

        // If both users are following each other, create a new chat
        if (user2.following.includes(user1._id) && user1.following.includes(user2._id)) {
            const newChat = new Chats({
                _id: user1._id > user2._id ? user1._id + user2._id : user2._id + user1._id
            });

            await newChat.save();
        }
    } catch (error) {
        console.error('Error following user:', error);
    }
}

// Handle unfollow user
async function handleUnFollowUser(socket, { ownId, followingUserId }) {
    try {
        await User.updateOne({ _id: ownId }, { $pull: { following: followingUserId } });
        await User.updateOne({ _id: followingUserId }, { $pull: { followers: ownId } });

        const user = await User.findOne({ _id: ownId });
        socket.emit('userUnFollowed', { following: user.following });
    } catch (error) {
        console.error('Error unfollowing user:', error);
    }
}

// Handle making a comment on a post
async function handleMakeComment(socket, { postId, username, comment }) {
    try {
        await Post.updateOne({ _id: postId }, { $push: { comments: [username, comment] } });
    } catch (error) {
        console.error('Error making comment:', error);
    }
}

// Handle fetching friends
async function handleFetchFriends(socket, { userId }) {
    try {
        const userData = await User.findOne({ _id: userId });
        const friendsList = findCommonElements(userData.following, userData.followers);
        const friendsData = await User.find(
            { _id: { $in: friendsList } },
            { _id: 1, username: 1, profilePic: 1 }
        ).exec();

        socket.emit("friends-data-fetched", { friendsData });
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

// Handle fetching messages
async function handleFetchMessages(socket, { chatId }) {
    try {
        const chat = await Chats.findOne({ _id: chatId });
        await socket.join(chatId);
        socket.emit('messages-updated', { chat });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Handle updating messages
async function handleUpdateMessages(socket, { chatId }) {
    try {
        const chat = await Chats.findOne({ _id: chatId });
        socket.emit('messages-updated', { chat });
    } catch (error) {
        console.error('Error updating messages:', error);
    }
}

// Handle sending a new message
async function handleNewMessage(socket, { chatId, id, text, file, senderId, date }) {
    try {
        await Chats.findOneAndUpdate(
            { _id: chatId },
            { $addToSet: { messages: { id, text, file, senderId, date } } },
            { new: true }
        );

        const chat = await Chats.findOne({ _id: chatId });
        socket.emit('messages-updated', { chat });
        socket.broadcast.to(chatId).emit('message-from-user');
    } catch (error) {
        console.error('Error adding new message:', error);
    }
}

// Handle chat user search
async function handleChatUserSearch(socket, { ownId, username }) {
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (user.followers.includes(ownId) && user.following.includes(ownId)) {
                socket.emit('searched-chat-user', { user });
            } else {
                socket.emit('no-searched-chat-user');
            }
        } else {
            socket.emit('no-searched-chat-user');
        }
    } catch (error) {
        console.error('Error searching chat user:', error);
    }
}

// Handle fetching all posts
async function handleFetchAllPosts(socket) {
    try {
        const posts = await Post.find();
        socket.emit('all-posts-fetched', { posts });
    } catch (error) {
        console.error('Error fetching all posts:', error);
    }
}

// Handle deleting a post
async function handleDeletePost(socket, { postId }) {
    try {
        await Post.deleteOne({ _id: postId });
        const posts = await Post.find();
        socket.emit('post-deleted', { posts });
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Handle creating a new story
async function handleCreateNewStory(socket, { userId, username, userPic, fileType, file, text }) {
    try {
        const newStory = new Stories({ userId, username, userPic, fileType, file, text });
        await newStory.save();
    } catch (error) {
        console.error('Error creating new story:', error);
    }
}

// Handle fetching stories
async function handleFetchStories(socket) {
    try {
        const stories = await Stories.find();
        socket.emit('stories-fetched', { stories });
    } catch (error) {
        console.error('Error fetching stories:', error);
    }
}

// Handle marking a story as played
async function handleStoryPlayed(socket, { storyId, userId }) {
    try {
        await Stories.updateOne({ _id: storyId }, { $addToSet: { viewers: userId } });
    } catch (error) {
        console.error('Error marking story as played:', error);
    }
}

const SocketHandler = (socket) => {
    socket.on('likePost', (data) => handlePostLiked(socket, data));
    socket.on('unLikePost', (data) => handlePostUnLiked(socket, data));
    socket.on("fetch-profile", (data) => handleFetchProfile(socket, data));
    socket.on("update-profile", (data) => handleUpdateProfile(socket, data));
    socket.on("search-user", (data) => handleUserSearch(socket, data));
    socket.on("follow-user", (data) => handleFollowUser(socket, data));
    socket.on("unFollow-user", (data) => handleUnFollowUser(socket, data));
    socket.on("make-comment", (data) => handleMakeComment(socket, data));
    socket.on("fetch-friends", (data) => handleFetchFriends(socket, data));
    socket.on('fetch-messages', (data) => handleFetchMessages(socket, data));
    socket.on('update-messages', (data) => handleUpdateMessages(socket, data));
    socket.on('new-message', (data) => handleNewMessage(socket, data));
    socket.on("search-chat-user", (data) => handleChatUserSearch(socket, data));
};

export default SocketHandler;

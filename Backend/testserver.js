// testSocket.js

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

// Example of testing the "likePost" event
socket.emit('likePost', { userId: '12345', postId: '67890' });

socket.on('likeUpdated', () => {
  console.log('Like was successfully updated');
});

// Example of testing the "fetch-profile" event
socket.emit('fetch-profile', { _id: '12345' });

socket.on('profile-fetched', (data) => {
  console.log('Profile fetched:', data);
});

// You can add more test cases as needed for other events

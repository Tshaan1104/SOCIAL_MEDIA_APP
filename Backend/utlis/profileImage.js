// utils/profileImage.js
const generateProfileImageURL = (username) => {
    const initial = username.charAt(0).toUpperCase();
    // Here, we're using a placeholder service that generates images with initials
    return `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&size=256`;
  };
  
  export default generateProfileImageURL;
  
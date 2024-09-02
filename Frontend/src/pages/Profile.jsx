import React, { useContext, useEffect, useState } from 'react';
import '../styles/ProfilePage.css';
import '../styles/Posts.css';
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoIosPersonAdd } from 'react-icons/io';
import HomeLogo from '../components/HomeLogo';
import Navbar from '../components/Navbar';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';
import { GeneralContext } from '../context/GeneralContextProvider';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';



// const navigate = useNavigate();

const Profile = () => {
  const { logout } = useContext(AuthenticationContext);
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState([]);
  const [updateprofileImg, setUpdateprofileImg] = useState('');
  const [updateProfileUsername, setUpdateProfileUsername] = useState('');
  const [updateProfileAbout, setUpdateProfileAbout] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [followDisplayType, setFollowDisplayType] = useState('followers');
  const [comment, setComment] = useState('');

  useEffect(() => {
    socket.emit("fetch-profile", { _id: id });

    socket.on("profile-fetched", async ({ profile }) => {
      setUserProfile(profile);
      setUpdateprofileImg(profile.profileImg || '');
      setUpdateProfileUsername(profile.username || '');
      setUpdateProfileAbout(profile.about || '');
    });

    fetchPosts();
  }, [socket, id]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/api/fetchAllPosts');
      const fetchedPosts = response.data;
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    socket.emit('updateProfile', {
      userId: userProfile._id,
      profileImg: updateprofileImg,
      username: updateProfileUsername,
      about: updateProfileAbout
    });
    setIsUpdating(false);
  };

  const handleLike = (userId, postId) => {
    socket.emit('postLiked', { userId, postId });
  };

  const handleUnLike = (userId, postId) => {
    socket.emit('postUnLiked', { userId, postId });
  };

  const handleFollow = async (userId) => {
    socket.emit('followUser', { ownId: localStorage.getItem('userId'), followingUserId: userId });
  };
  const handleMessage = () => {
    navigate(`/chat`);
  };

  const handleUnFollow = async (userId) => {
    socket.emit('unFollowUser', { ownId: localStorage.getItem('userId'), followingUserId: userId });
  };

  useEffect(() => {
    socket.on('userFollowed', ({ following }) => {
      localStorage.setItem('following', following);
    });

    socket.on('userUnFollowed', ({ following }) => {
      localStorage.setItem('following', following);
    });
  }, [socket]);

  const handleComment = (postId, username) => {
    socket.emit('makeComment', { postId, username, comment });
    setComment('');
  };

  const handleDeletePost = async (postId) => {
    await socket.emit('delete-post', { postId });
  };

  useEffect(() => {
    socket.on('post-deleted', async ({ posts }) => {
      setPosts(posts);
    });
  }, [socket]);

  return (
    <div className='profilePage'>
      <HomeLogo />
      <Navbar />

      <div className="profileCard" style={isUpdating ? { display: 'none' } : { display: "flex" }}>
        <img src={userProfile.profileImg} alt="" />
        <h4>{userProfile.username}</h4>
        <p>{userProfile.about}</p>

        <div className="profileDetailCounts">
          <div className="followersCount">
            <p>Followers</p>
            <p>{userProfile.followers ? userProfile.followers.length : 0}</p>
          </div>
          <div className="followingCounts">
            <p>Following</p>
            <p>{userProfile.following ? userProfile.following.length : 0}</p>
          </div>
        </div>

        <div className="profileControls">
          {userProfile._id === userId ? (
            <div className="profileControlBtns">
              <button onClick={async () => { await logout() }}>Logout</button>
              <button type="button" className="btn btn-primary" onClick={() => setIsUpdating(true)}>Edit</button>
            </div>
          ) : (
            <div className="profileControlBtns">
              {localStorage.getItem('following').includes(userProfile._id) ? (
                <>
                  <button onClick={() => handleUnFollow(userProfile._id)} style={{ backgroundColor: 'rgb(224, 42, 42)' }}>Unfollow</button>
                  <button onClick={handleMessage}>Message</button> {/* Updated button */}
                  </>
              ) : (
                <button onClick={() => handleFollow(userProfile._id)}>Follow</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='profileEditCard' style={!isUpdating ? { display: 'none' } : { display: "flex" }}>
        <div className="mb-3">
          <label htmlFor="profileImg" className="form-label">Profile Image</label>
          <input type="text" className="form-control" id="profileImg" onChange={(e) => setUpdateprofileImg(e.target.value)} value={updateprofileImg || ''} />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" onChange={(e) => setUpdateProfileUsername(e.target.value)} value={updateProfileUsername || ''} />
        </div>
        <div className="mb-3">
          <label htmlFor="about" className="form-label">About</label>
          <input type="text" className="form-control" id="about" onChange={(e) => setUpdateProfileAbout(e.target.value)} value={updateProfileAbout || ''} />
        </div>
        <button className='btn btn-primary' onClick={handleUpdate}>Update</button>
      </div>

      <div className="profilePostsContainer">
        {posts.filter(post => post.userId === userProfile._id).map((post) => (
          <div className="Post" key={post._id}>
            <div className="postTop">
              <div className="postTopDetails">
                <img src={post.userImg} alt="" className="userImg" />
                <h3 className="usernameTop">{post.userName}</h3>
              </div>
              <button className='btn btn-danger deletePost' onClick={() => handleDeletePost(post._id)}>Delete</button>
            </div>

            {post.fileType === 'photo' ? (
              <img src={post.file} className='postimg' alt="" />
            ) : (
              <video id="videoPlayer" className='postimg' controls autoPlay muted>
                <source src={post.file} />
              </video>
            )}

            <div className="postReact">
              <div className="supliconcol">
                {post.likes.includes(localStorage.getItem('userId')) ? (
                  <AiTwotoneHeart className='support reactbtn' onClick={() => handleUnLike(localStorage.getItem('userId'), post._id)} />
                ) : (
                  <AiOutlineHeart className='support reactbtn' onClick={() => handleLike(localStorage.getItem('userId'), post._id)} />
                )}
                <label htmlFor="support" className='supportCount'>{post.likes.length}</label>
              </div>
              <BiCommentDetail className='comment reactbtn' />
              <div className="placeiconcol">
                <FaGlobeAmericas className='placeicon reactbtn' name='place' />
                <label htmlFor="place" className='place'>{post.location}</label>
              </div>
            </div>

            <div className="detail">
              <div className='descdataWithBtn'>
                <label htmlFor='username' className="desc labeldata" id='desc'>
                  <span style={{ fontWeight: 'bold' }}>
                    {post.userName}
                  </span>
                  &nbsp; {post.description}
                </label>
              </div>
            </div>

            <div className="commentsContainer">
              <div className="makeComment">
                <input type="text" placeholder='type something...' onChange={(e) => setComment(e.target.value)} value={comment || ''} />
                {comment.length === 0 ? (
                  <button className="sendCommentbtn" disabled={true} style={{ cursor: 'not-allowed' }}><IoIosPersonAdd /></button>
                ) : (
                  <button className="sendCommentbtn" onClick={() => handleComment(post._id, userProfile.username)}><IoIosPersonAdd /></button>
                )}
              </div>

              {post.comments.length > 0 && post.comments.map((comment, index) => (
                <div className="comment" key={index}>
                  <label htmlFor="comment" className='comment'>
                    <span style={{ fontWeight: 'bold' }}>
                      {comment.username}
                    </span>
                    &nbsp; {comment.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

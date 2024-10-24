import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/table5.png';
import { fetchUserData } from '../api/userApi';
import UserRecipes from '../components/UserRecipes';

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState({
    name: '',
    bio: 'Passionate home cook.',
    profilePicture: 'https://via.placeholder.com/150',
  });

  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBio, setNewBio] = useState(user.bio);
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleRemoveImage = () => {
    setImage(null);
    localStorage.removeItem('profilePicture');
  };

  useEffect(() => {
    const getUserData = async () => {
      if (userId) {
        try {
          const data = await fetchUserData(userId);
          setUser({
            ...user,
            name: `${data.firstName} ${data.lastName}`,
            bio: data.bio || user.bio,
            location: data.location || user.location,
            profilePicture: data.profilePicture || user.profilePicture,
          });

          // Load the image from localStorage if it exists
          const storedImage = localStorage.getItem('profilePicture');
          if (storedImage) {
            setImage(storedImage);
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/user/${userId}`);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    getUserData();
    fetchRecipes();
  }, [userId]);

  const handleBioChange = (event) => {
    setNewBio(event.target.value);
  };

  const saveBio = () => {
    setUser({ ...user, bio: newBio });
    setIsModalOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      // Optionally, save the image data to your backend or state management
    };
    reader.readAsDataURL(file);
  };

  const handleUploadButtonClick = (file) => {
    const myHeaders = new Headers();
    const token = "adhgsdaksdhk938742937423";
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append("file", file);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://trickuweb.com/upload/profile_pic", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        const profileurl = JSON.parse(result);
        setImage(profileurl.img_url);

        // Store the image URL in localStorage
        localStorage.setItem('profilePicture', profileurl.img_url);
      })
      .catch((error) => console.log("error", error));
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Fixes the background image in place
        paddingBottom: '50px',
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-xl mt-16 w-11/12 md:w-3/4 lg:w-2/3 border-t-4 border-orange-500 relative">
        <button
          onClick={() => navigate('/home')}
          className="bg-orange-500 font-recia text-white px-4 py-2 rounded hover:bg-orange-600 absolute top-4 right-4"
        >
          Back to Home
        </button>
        {/* ------------------IMAGE UPLOAD------------------ */}
        <div className="flex items-center space-x-10"> 
          <div className="w-36 h-36 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden flex justify-center items-center">
            <div>
              <div onClick={handleClick} style={{ cursor: "pointer", width: "150px", height: "150px", borderRadius: "50%", overflow: "hidden" }}>
                {image ? (
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    style={{ objectFit: "cover" }} // Ensures the image fills the box
                  />
                ) : (
                  <img
                    src="./photo.png"
                    className="w-full h-full object-cover"
                    style={{ objectFit: "cover" }} // Ensures the default image fills the box
                  />
                )}

                <input
                  id="image-upload-input"
                  type="file"
                  onChange={handleImageChange}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
              </div>
              <button
                className="image-upload-button"
                onClick={() => handleUploadButtonClick(image)}
              >
                Upload
              </button>
              <button
                className="image-remove-button"
                onClick={handleRemoveImage}
              >
                Remove
              </button>
            </div>
          </div>
          
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.location}</p>
            <p className="text-gray-700 mt-2 text-lg">{user.bio}</p> {/* Increased font size */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-blue-500 underline"
            >
              Edit Bio
            </button>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-10">My Recipes</h2>
          <div className="grid grid-cols-1 gap-10">  {/* Ensure only one recipe per row */}
            {recipes.length === 0 ? (
              <p>You haven't posted any recipes yet.</p>
            ) : (
              recipes.map((recipe) => (
                <UserRecipes
                  key={recipe._id}
                  recipeId={recipe._id}
                  title={recipe.title}
                  imageUrl={recipe.imageUrl}
                  ingredients={recipe.ingredients}
                  instructions={recipe.instructions}
                  creator={recipe.creator}
                  userRating={recipe.userRating || 0}
                  averageRating={recipe.averageRating || 0}
                  handleRating={() => {}} 
                />
              ))
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Bio</h2>
              <textarea
                value={newBio}
                onChange={handleBioChange}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBio}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
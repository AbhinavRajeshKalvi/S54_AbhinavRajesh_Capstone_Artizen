import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { motion } from "framer-motion"; 
import { useClerk } from '@clerk/clerk-react';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';
import uploadIcon from '../assets/uploadicon.png';
import { addImageToCloudinary } from './cloudinary';
import { toast } from 'react-toastify';
import Masonry from "react-responsive-masonry";

Modal.setAppElement('#root');

const ArtworkGrid = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category') || ''; 

  const { user } = useClerk();
  const [users, setUsers] = useState([]); 
  const [artworks, setArtworks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [userData, setUserData] = useState({
    username: '',
    pfp: '',
  });

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    author: '',
  });

  const categories = [
    { title: 'Painting', id: 1 },
    { title: 'Drawing', id: 2 },
    { title: 'Sculpture', id: 3 },
    { title: 'Digital Art', id: 4 },
    { title: 'Photography', id: 5 }
  ];

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    const fetchData = async (category) => {
      try {
        const responseUser = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`);
        setUsers(responseUser.data); 
        
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/data/artworks`, {
          params: category ? { category } : {}
        });

        setArtworks(response.data);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        toast.error('Failed to fetch artworks. Please try again later.');
      }
    };

    fetchData(selectedCategory);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedCategory]);

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.fullName,
        pfp: user.imageUrl
      });

      setFormData(prevState => ({
        ...prevState,
        author: user.fullName
      }));
    }
  }, [user]);

  const handleSelectCategory = (category) => {
    if (selectedCategory === category) {
      navigate('/discover'); 
    } else {
      navigate(`/discover?category=${category}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  //handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.category || !formData.image || !formData.description) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const usernames = users.map(u => u.username);
      const isUserExist = usernames.includes(user.fullName);

      if (!isUserExist) {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/signup`, {
          username: user.fullName,
          pfp: user.imageUrl
        });
      }

      const imageUrl = await addImageToCloudinary(formData.image);
      formData.image = imageUrl[0];

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/artworks`, formData);

      setFormData({
        title: '',
        category: '',
        author: user.fullName,
        image: '',
        description: '',
      });

      toast.success('Artwork Submitted Successfully');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast.error('Failed to upload artwork. Please try again later.');
    }
  };

  const handleUploadButtonClick = () => {
    if (!user) {
      toast.error('Please sign in to upload artwork.');
      return;
    }
    setModalIsOpen(true);
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        image: acceptedFiles[0],
      }));
      setImagePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container" ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="discover-hero-text" style={{fontSize:'5vw',marginBottom:'4vh'}}>Discover</h1>
        <div>
          <input
            placeholder='Search'
            style={{marginBottom:'5vh',width:'40vw',borderRadius:'50px',height:'5vh',paddingLeft:'1.3vw',fontSize:'1.5vw',border:'none'}}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'30px',marginBottom:'10vh'}}>
        {categories.map(card => (
          <div
            key={card.id}
            style={{
              color: 'white',
              background: selectedCategory === card.title ? '#555555' : '#222222', // Change color if selected
              width: '10vw',
              height: '6vh',
              borderRadius: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2vw',
              cursor: 'pointer'
            }}
            onClick={() => handleSelectCategory(card.title)}
          >
            {card.title}
          </div>
        ))}
      </div>
          <Masonry columnsCount={3} gutter="20px">
                {filteredArtworks.map((image, i) => (
                    <img
                        key={i}
                        src={image.image}
                        style={{width: "100%", display: "block", borderRadius:'20px'}}
                    />
                ))}
            </Masonry>
        {/* </div> */}
        {user && (
          <motion.button whileHover={{ scale: 1.1 }} className="upload-button" onClick={handleUploadButtonClick}>
            <img style={{ width: '50px', paddingRight: '10px' }} src={uploadIcon} alt="Upload" /> Upload
          </motion.button>
        )}
      </div>
      <motion.div
        className="modal-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: modalIsOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Upload Artwork</h2>
          <form>
            <div className="form-group">
              <h3>Title :</h3>
              <input placeholder="title" className="form-input" type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <h3>Category :</h3>
              <select className="form-input" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="">Select Category</option>
                <option value="Painting">Painting</option>
                <option value="Drawing">Drawing</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Photography">Photography</option>
              </select>
            </div>
            <div className="form-group">
              <h3>Image :</h3>
              <div {...getRootProps()} className="dropzone" style={{ backgroundColor: 'white', border: '2px dashed #0087F7', borderRadius: '4px', padding: '20px 8px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '150px', height: '50px', marginBottom: '10px' }} />}
                {imagePreview ? null : <p>Drag 'n' drop some files here, or select files</p>}
              </div>
            </div>
            <div className="form-group">
              <h3>Description :</h3>
              <textarea placeholder="description" name="description" className="description-input" type="text" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} type="button" onClick={handleUpload}>Upload</motion.button>
          </form>
        </Modal>
      </motion.div>
    </>
  );
};

export default ArtworkGrid;
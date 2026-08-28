import React, { useRef, useEffect, useState } from 'react';
import pic from '../assets/1.png';
import man from '../assets/pic1.png'
import '../index.css'
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { Box, Text } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';

const Home = () => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [users, setUsers] = useState([]);
  const parallaxRef = useRef();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTestimonials = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/testimonials`);
        const responseUsers = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`);
        setTestimonials(responseTestimonials.data);
        setUsers(responseUsers.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    parallaxRef.current.scrollTo(0);
  }, []);

  const handleAnimationEnd = () => {
    setAnimationCompleted(true);
  };

  return (
    <div>
      <div>
        <Parallax pages={2.85} ref={parallaxRef} className='main'>
          <ParallaxLayer offset={0} speed={1}>
            <h6>WHERE IMAGINATION TAKES SHAPE, VIRTUALLY</h6>
            <h1>ARTIZEN</h1>
          </ParallaxLayer>
          <ParallaxLayer offset={0.08} speed={2}>
            <img src={pic} alt="" className={animationCompleted ? "fade-in final-state" : "fade-in"} onAnimationEnd={handleAnimationEnd} />
          </ParallaxLayer>
          <ParallaxLayer offset={0.99} speed={1}>
            <div className="discover-section" style={{ color: 'white' }}>
              <div>
                <img src={man} alt="" />
              </div>
              <div className='discover-section-text'>
                <h2 className='sub-heading'>DISCOVER</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Commodo morbi egestas lectus ultrices sem vel. 
                  Id sem sollicitudin mi tristique duis parturient consequat aenean ut. 
                  Scelerisque id donec potenti dui aliquet. Enim ac habitant vivamus mattis egestas nisi sagittis. 
                  Id dui venenatis sed
                </p>
              </div>
            </div>
            </ParallaxLayer>
          <ParallaxLayer offset={1.2} speed={1}>
            <div className="featured-section" style={{ color: 'white' }}>
              <div className='featured-section-text'>
                <h2 className='sub-heading'>FEATURED</h2>
                <h5>Top Artworks</h5>
              </div>
                <div className='frame-div'>
                  <div className='frame'><img src="https://preview.redd.it/l4bpx9gkial71.jpg?width=640&crop=smart&auto=webp&s=c449fba5dc6dd76d61ee34786afdf7d9ddbc5fb7" alt="" style={{height:'100%',width:'100%'}} /></div>
                  <div className='frame'><img src="https://www.topalski.com/wp-content/uploads/2016/04/Fine-Art-Eventide-Sea-and-Waves-Original-Oil-Painting-on-Canvas-by-artist-Darko-Topalski1.jpg" alt="" style={{height:'100%',width:'100%'}} /></div>
                  <div className='frame'><img src="https://i.pinimg.com/originals/db/9b/a1/db9ba1d9f4adfcf0626fc97a3a97193c.jpg" alt="" style={{height:'100%',width:'100%'}} /></div>
              </div>
            </div>
            </ParallaxLayer>
          <ParallaxLayer offset={1.999} speed={1}>
            <div className="testimonial-section" style={{ color: 'white' }}>
              <div className='testimonial-section-text'>
                <h2 className='sub-heading'>TESTIMONIALS</h2>
                <h5>From Users</h5>
                <Carousel ref={carouselRef} key={testimonials.length} className='carousel-div' showStatus={false} showArrows={false} interval={3000} infiniteLoop autoPlay centerMode centerSlidePercentage={60}>
                  {testimonials.map((testimonial, index) => (
                    <div
                      className='home-testimonial-container'
                      onClick={(e) => {
                        e.stopPropagation();
                        carouselRef.current.moveTo(index);
                      }}
                    >
                    <div key={index}>
                      <div className='home-testimonial-container-header'>
                      {users.map(user => user.username === testimonial.author && (
                        <img
                          key={user.username}
                          src={user.pfp}
                          alt="Profile"
                          style={{ width: '3vw', borderRadius: '50%', height: '5.6vh' }}
                          className="profile-picture"
                        />
                      ))}
                      {testimonial.author}
                      </div>
                      <div className='home-testimonial-container-body'>
                        <div className='home-testimonial-title'>{testimonial.title}</div>
                        <div className='home-testimonial-content'>{testimonial.testimonial}</div>
                      </div>
                      <div className='testimonial-box-rating'>
                        <Rating readonly initialValue={testimonial.likes} size={20} />
                      </div>
                    </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </ParallaxLayer>
          <ParallaxLayer offset={2.2} speed={1}>
            <Box as="footer" textAlign="center" py="4" color="white" fontFamily='heverly' letterSpacing='3px'>
              <Text>© 2024 Artizen. All Rights Reserved.</Text>
            </Box>
          </ParallaxLayer>
        </Parallax>
      </div>
    </div>
  );
}

export default Home;
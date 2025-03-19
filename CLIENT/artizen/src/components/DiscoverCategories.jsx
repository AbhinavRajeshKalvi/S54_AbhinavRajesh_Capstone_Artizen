import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const DiscoverCategories = () => {
  const popularCards = [
    { title: 'Digital Art', id: 1 },
    { title: 'Drawing', id: 2 },
    { title: 'Photography', id: 3 }
  ];
  
  const mediumCards = [
    { title: 'Painting', id: 1 },
    { title: 'Drawing', id: 2 },
    { title: 'Sculpture', id: 3 },
    { title: 'Digital Art', id: 4 },
    { title: 'Photography', id: 5 }
  ];

  return (
    <div className='discover-categories-page'>
      <h1 className="discover-hero-text">Discover the best of Artizen</h1>
      
      <h5 className='discover-categories-popular-subtitle'>Discover popular</h5>
      <div className='discover-popular-container'>
        {popularCards.map(card => (
          <div key={card.id} className={`discover-popular-card discover-popular-card-${card.id}`}>
            <h4 className='discover-popular-card-title'>{card.title}</h4>
            <div className='discover-popular-card-overlay'>
              <Link to={`/discover?category=${card.title}`}>
                <motion.button whileHover={{ scale: 1.1 }} className='discover-popular-card-button'>
                  Search
                </motion.button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className='discover-medium'>
        <h5 className='discover-categories-popular-subtitle'>Discover medium</h5>
        <div className='discover-medium-container'>
          {mediumCards.map(card => (
            <Link key={card.id} to={`/discover?category=${card.title}`}>
              <div className={`discover-medium-card discover-medium-card-${card.id}`}>
                <h4 className='discover-medium-card-title'>{card.title}</h4>
                <div className='discover-medium-card-overlay'></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <Link to={`/discover`}>
          <motion.button whileHover={{ scale: 1.1 }} className='discover-explore-btn'>
            Explore
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default DiscoverCategories;

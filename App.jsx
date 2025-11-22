import React from 'react';
import PixelTrail from './PixelTrail';
import './styles.css';

const App = () => {
  return (
    <div className="app-container">
      {/* Background PixelTrail effect */}
      <div className="background-effect">
        <PixelTrail
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#ff9ed8"
          gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
        />
      </div>

      <div className="container">
        <div className="profile">
          <img src="dazey.webp" alt="Dazey Do Profile" className="profile-img" />
          <h1>@dazeydo</h1>
          <p>Where the fun begins 💕</p>
        </div>
        
        <div className="links">
          <a 
            href="#" 
            className="link-card onlyfans nsfw-link" 
            data-url="https://onlyfans.com/dazeydo"
            onClick={(e) => {
              e.preventDefault();
              const modal = document.getElementById('nsfw-modal');
              modal.classList.add('show');
              window.currentNsfwUrl = "https://onlyfans.com/dazeydo";
            }}
          >
            <i className="fa-solid fa-fire"></i>
            <span>OnlyFans 😈🔥</span>
            <div className="nsfw-tag">NSFW 18+</div>
          </a>
          
          <a href="https://discord.gg/rUrRG99B8M" target="_blank" rel="noopener noreferrer" className="link-card discord">
            <i className="fab fa-discord"></i>
            <span>Discord 📲</span>
          </a>
          
          <a 
            href="#" 
            className="link-card chaturbate nsfw-link" 
            data-url="https://chaturbate.com/dazeydo/"
            onClick={(e) => {
              e.preventDefault();
              const modal = document.getElementById('nsfw-modal');
              modal.classList.add('show');
              window.currentNsfwUrl = "https://chaturbate.com/dazeydo/";
            }}
          >
            <i className="fa-solid fa-video"></i>
            <span>Chaturbate 😈</span>
            <div className="nsfw-tag">NSFW 18+</div>
          </a>
          
          <a href="https://www.instagram.com/doitlikedazey/" target="_blank" rel="noopener noreferrer" className="link-card instagram">
            <i className="fab fa-instagram"></i>
            <span>Instagram 📸</span>
          </a>
          
          <a href="https://kick.com/dazey-do" target="_blank" rel="noopener noreferrer" className="link-card kick">
            <i className="fa-solid fa-play"></i>
            <span>Kick 📽️🔆</span>
          </a>
          
          <a href="https://www.twitch.tv/dazey_do" target="_blank" rel="noopener noreferrer" className="link-card twitch">
            <i className="fab fa-twitch"></i>
            <span>Twitch 📹🔅</span>
          </a>
          
          <a href="https://throne.com/dazeydo" target="_blank" rel="noopener noreferrer" className="link-card wishlist">
            <i className="fa-solid fa-gift"></i>
            <span>Wishlist 🎁</span>
          </a>
          
          <a href="https://cash.app/$dazeydo" target="_blank" rel="noopener noreferrer" className="link-card gift">
            <i className="fa-solid fa-heart"></i>
            <span>Send a gift 💝</span>
          </a>
        </div>

        {/* NSFW Warning Modal */}
        <div id="nsfw-modal" className="modal">
          <div className="modal-content">
            <span 
              className="close-modal"
              onClick={() => {
                const modal = document.getElementById('nsfw-modal');
                modal.classList.remove('show');
              }}
            >
              &times;
            </span>
            <h2>Adult Content Warning</h2>
            <p>You are about to visit a site that contains adult content intended for individuals 18 years of age or older.</p>
            <p>By clicking "Continue", you confirm that you are at least 18 years old and willing to view adult content.</p>
            <div className="modal-buttons">
              <button 
                id="cancel-nsfw"
                onClick={() => {
                  const modal = document.getElementById('nsfw-modal');
                  modal.classList.remove('show');
                }}
              >
                Cancel
              </button>
              <button 
                id="confirm-nsfw"
                onClick={() => {
                  if (window.currentNsfwUrl) {
                    window.open(window.currentNsfwUrl, '_blank');
                  }
                  const modal = document.getElementById('nsfw-modal');
                  modal.classList.remove('show');
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        
        <footer>
          <p>© {new Date().getFullYear()} Dazey Do • <a href="https://linktr.ee/s/privacy-policy-cookie-notice" target="_blank" rel="noopener noreferrer" className="cookie-link">Cookie Preferences</a></p>
        </footer>
      </div>
    </div>
  );
};

export default App; 
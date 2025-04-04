/**
 * Tilted Card Effect
 * A vanilla JavaScript implementation inspired by the React/Framer Motion component
 */

class TiltedCard {
  constructor({
    selector,
    imageSrc,
    altText = "Tilted card image",
    captionText = "",
    containerHeight = "300px",
    containerWidth = "300px",
    imageHeight = "300px",
    imageWidth = "300px",
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showTooltip = true
  }) {
    this.config = {
      selector,
      imageSrc,
      altText,
      captionText,
      containerHeight,
      containerWidth,
      imageHeight,
      imageWidth,
      scaleOnHover,
      rotateAmplitude,
      showTooltip
    };
    
    this.lastY = 0;
    this.springConfig = {
      duration: 700,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    };
    
    this.init();
  }
  
  init() {
    const container = document.querySelector(this.config.selector);
    if (!container) {
      console.error(`Element with selector ${this.config.selector} not found`);
      return;
    }
    
    // Create and append the card elements
    container.innerHTML = `
      <figure class="tilted-card-figure" style="height: ${this.config.containerHeight}; width: ${this.config.containerWidth};">
        <div class="tilted-card-inner" style="width: ${this.config.imageWidth}; height: ${this.config.imageHeight};">
          <img 
            src="${this.config.imageSrc}" 
            alt="${this.config.altText}" 
            class="tilted-card-img"
            style="width: ${this.config.imageWidth}; height: ${this.config.imageHeight};"
          />
          <div class="tilted-card-overlay">
            <p class="tilted-card-demo-text">${this.config.captionText}</p>
          </div>
        </div>
        ${this.config.showTooltip ? `<figcaption class="tilted-card-caption">${this.config.captionText}</figcaption>` : ''}
      </figure>
    `;
    
    this.figureEl = container.querySelector('.tilted-card-figure');
    this.innerEl = container.querySelector('.tilted-card-inner');
    this.captionEl = container.querySelector('.tilted-card-caption');
    
    // Add event listeners
    this.figureEl.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.figureEl.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.figureEl.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }
  
  handleMouseMove(e) {
    const rect = this.figureEl.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    const rotationX = (offsetY / (rect.height / 2)) * -this.config.rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * this.config.rotateAmplitude;
    
    // Apply rotation transform with spring animation
    this.innerEl.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
    this.innerEl.style.transform = `perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${this.config.scaleOnHover})`;
    
    if (this.config.showTooltip && this.captionEl) {
      // Move the caption to follow the cursor
      this.captionEl.style.left = `${e.clientX - rect.left}px`;
      this.captionEl.style.top = `${e.clientY - rect.top}px`;
      
      // Calculate caption rotation based on velocity
      const velocityY = offsetY - this.lastY;
      this.captionEl.style.transform = `rotate(${-velocityY * 0.3}deg)`;
      this.lastY = offsetY;
    }
  }
  
  handleMouseEnter() {
    // Scale up and show caption
    this.innerEl.style.transform = `perspective(800px) scale(${this.config.scaleOnHover})`;
    
    if (this.config.showTooltip && this.captionEl) {
      this.captionEl.style.opacity = '1';
    }
  }
  
  handleMouseLeave() {
    // Reset all transforms with spring animation
    this.innerEl.style.transition = this.springConfig.duration + 'ms ' + this.springConfig.easing;
    this.innerEl.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    
    if (this.config.showTooltip && this.captionEl) {
      this.captionEl.style.opacity = '0';
      this.captionEl.style.transform = 'rotate(0)';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // The tiltedCard will be initialized from script.js
});

// Make it available globally
window.TiltedCard = TiltedCard; 
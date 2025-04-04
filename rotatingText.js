// RotatingText component - Vanilla JS version
document.addEventListener('DOMContentLoaded', function() {
  class RotatingText {
    constructor(options = {}) {
      // Default options
      this.options = {
        container: options.container || document.getElementById('rotating-text-container'),
        texts: options.texts || ['Where the fun begins 💕', 'Gaming 🎮', 'Streaming 📱', 'Creating content 💫'],
        rotationInterval: options.rotationInterval || 2000,
        splitBy: options.splitBy || 'characters',
        staggerFrom: options.staggerFrom || 'last',
        staggerDuration: options.staggerDuration || 0.025,
        initialDelay: options.initialDelay || 300,
        loop: options.loop !== undefined ? options.loop : true,
        auto: options.auto !== undefined ? options.auto : true,
      };

      // State
      this.currentTextIndex = 0;
      this.elements = [];
      this.intervalId = null;
      this.container = this.options.container;
      
      // Initialize
      this.init();
      
      // Start animation
      if (this.options.auto) {
        this.startRotation();
      }
    }
    
    splitIntoCharacters(text) {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), segment => segment.segment);
      }
      return Array.from(text);
    }
    
    prepareElements(text) {
      if (this.options.splitBy === 'characters') {
        const words = text.split(' ');
        return words.map((word, i) => ({
          characters: this.splitIntoCharacters(word),
          needsSpace: i !== words.length - 1
        }));
      }
      
      if (this.options.splitBy === 'words') {
        return text.split(' ').map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1
        }));
      }
      
      if (this.options.splitBy === 'lines') {
        return text.split('\n').map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1
        }));
      }
      
      // For a custom separator
      return text.split(this.options.splitBy).map((part, i, arr) => ({
        characters: [part],
        needsSpace: i !== arr.length - 1
      }));
    }
    
    getStaggerDelay(index, totalChars) {
      const total = totalChars;
      const { staggerFrom, staggerDuration } = this.options;
      
      if (staggerFrom === 'first') return index * staggerDuration * 1000;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration * 1000;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration * 1000;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration * 1000;
      }
      
      return Math.abs(staggerFrom - index) * staggerDuration * 1000;
    }
    
    createSpan(text, className = '', styles = {}) {
      const span = document.createElement('span');
      span.textContent = text;
      span.className = className;
      Object.assign(span.style, styles);
      return span;
    }
    
    init() {
      // Create main container
      this.container.innerHTML = '';
      this.container.classList.add('text-rotate');
      
      // Create screen reader text
      const srSpan = this.createSpan(
        this.options.texts[this.currentTextIndex],
        'text-rotate-sr-only'
      );
      this.container.appendChild(srSpan);
      
      // Display the first text
      this.displayText();
    }
    
    displayText() {
      // Remove previous text animation
      const existingText = this.container.querySelector('.text-rotate-content');
      if (existingText) {
        existingText.classList.add('exit');
        
        // Remove after animation completes
        setTimeout(() => {
          if (existingText.parentNode) {
            existingText.parentNode.removeChild(existingText);
          }
        }, 500); // Match with CSS transition time
      }
      
      // Update screen reader text
      const srSpan = this.container.querySelector('.text-rotate-sr-only');
      if (srSpan) {
        srSpan.textContent = this.options.texts[this.currentTextIndex];
      }
      
      // Create new text content
      const currentText = this.options.texts[this.currentTextIndex];
      const elements = this.prepareElements(currentText);
      
      // Create content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'text-rotate-content';
      contentDiv.setAttribute('aria-hidden', 'true');
      
      // Calculate total characters for stagger
      const totalChars = elements.reduce(
        (sum, wordObj) => sum + wordObj.characters.length, 
        0
      );
      
      // Create elements for each word/character
      let charCount = 0;
      elements.forEach((wordObj, wordIndex) => {
        const wordSpan = this.createSpan('', 'text-rotate-word');
        
        wordObj.characters.forEach((char, charIndex) => {
          const charSpan = this.createSpan(
            char, 
            'text-rotate-element',
            {
              transform: 'translateY(100%)',
              opacity: '0',
              display: 'inline-block',
              transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease',
              transitionDelay: `${this.getStaggerDelay(charCount, totalChars)}ms`
            }
          );
          
          wordSpan.appendChild(charSpan);
          charCount++;
          
          // Animate after a small delay
          setTimeout(() => {
            charSpan.style.transform = 'translateY(0)';
            charSpan.style.opacity = '1';
          }, this.options.initialDelay);
        });
        
        if (wordObj.needsSpace) {
          wordSpan.appendChild(this.createSpan(' ', 'text-rotate-space'));
        }
        
        contentDiv.appendChild(wordSpan);
      });
      
      this.container.appendChild(contentDiv);
    }
    
    next() {
      this.currentTextIndex = 
        this.currentTextIndex === this.options.texts.length - 1
          ? this.options.loop ? 0 : this.currentTextIndex
          : this.currentTextIndex + 1;
      
      this.displayText();
    }
    
    prev() {
      this.currentTextIndex = 
        this.currentTextIndex === 0
          ? this.options.loop ? this.options.texts.length - 1 : this.currentTextIndex
          : this.currentTextIndex - 1;
      
      this.displayText();
    }
    
    jumpTo(index) {
      const validIndex = Math.max(0, Math.min(index, this.options.texts.length - 1));
      if (validIndex !== this.currentTextIndex) {
        this.currentTextIndex = validIndex;
        this.displayText();
      }
    }
    
    reset() {
      if (this.currentTextIndex !== 0) {
        this.currentTextIndex = 0;
        this.displayText();
      }
    }
    
    startRotation() {
      this.stopRotation();
      this.intervalId = setInterval(() => {
        this.next();
      }, this.options.rotationInterval);
    }
    
    stopRotation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    
    destroy() {
      this.stopRotation();
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }
  
  // Initialize RotatingText with desired options
  const rotatingText = new RotatingText({
    container: document.getElementById('rotating-text-container'),
    texts: ['Where the fun begins 💕', 'Gaming 🎮', 'Streaming 📱', 'Creating content 💫'],
    rotationInterval: 2000,
    staggerFrom: 'last',
    staggerDuration: 0.025,
    splitBy: 'characters'
  });
  
  // Make it globally accessible if needed
  window.rotatingText = rotatingText;
  
  // Add CSS transitions
  const style = document.createElement('style');
  style.textContent = `
    .text-rotate-content {
      display: flex;
      position: relative;
      overflow: hidden;
    }
    
    .text-rotate-content.exit {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transform: translateY(-120%);
      opacity: 0;
      transition: transform 0.5s ease, opacity 0.5s ease;
    }
  `;
  document.head.appendChild(style);
}); 
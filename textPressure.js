// TextPressure component - Vanilla JS version
document.addEventListener('DOMContentLoaded', function() {
  class TextPressure {
    constructor(options = {}) {
      // Default options
      this.options = {
        container: options.container || document.getElementById('text-pressure-container'),
        text: options.text || '@dazeydo',
        fontFamily: options.fontFamily || 'Compressa VF',
        width: options.width !== undefined ? options.width : true,
        weight: options.weight !== undefined ? options.weight : true,
        italic: options.italic !== undefined ? options.italic : true,
        alpha: options.alpha !== undefined ? options.alpha : false,
        flex: options.flex !== undefined ? options.flex : true,
        stroke: options.stroke !== undefined ? options.stroke : false,
        scale: options.scale !== undefined ? options.scale : false,
        textColor: options.textColor || 'var(--primary-color)',
        strokeColor: options.strokeColor || 'rgba(255, 158, 216, 0.4)',
        minFontSize: options.minFontSize || 36
      };
      
      // Initialize variables
      this.mouse = { x: 0, y: 0 };
      this.cursor = { x: 0, y: 0 };
      this.chars = this.options.text.split('');
      this.spans = [];
      this.fontSize = this.options.minFontSize;
      this.scaleY = 1;
      this.lineHeight = 1;
      this.rafId = null;
      
      // Create elements
      this.init();
      
      // Start animation
      this.bindEvents();
      this.animate();
    }
    
    init() {
      // Create container
      const container = this.options.container;
      container.classList.add('text-pressure-container');
      
      // Create title
      const title = document.createElement('h1');
      title.classList.add('text-pressure-title');
      
      if (this.options.flex) {
        title.classList.add('text-pressure-flex');
      }
      
      if (this.options.stroke) {
        title.classList.add('text-pressure-stroke');
      }
      
      // Set title styles
      Object.assign(title.style, {
        fontFamily: this.options.fontFamily,
        fontSize: `${this.fontSize}px`,
        lineHeight: this.lineHeight,
        transform: `scale(1, ${this.scaleY})`,
        transformOrigin: 'center top',
        color: this.options.textColor,
        background: 'var(--primary-gradient)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent'
      });
      
      // Create spans for each character
      this.chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.setAttribute('data-char', char);
        title.appendChild(span);
        this.spans.push(span);
      });
      
      // Add title to container
      container.appendChild(title);
      this.titleElement = title;
      
      // Set initial size
      this.setSize();
    }
    
    bindEvents() {
      // Mouse and touch events
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      window.addEventListener('resize', this.setSize.bind(this));
      
      // Initialize mouse position near center of container
      const rect = this.options.container.getBoundingClientRect();
      this.mouse.x = rect.left + rect.width / 2;
      this.mouse.y = rect.top + rect.height / 2;
      this.cursor.x = this.mouse.x;
      this.cursor.y = this.mouse.y;
    }
    
    handleMouseMove(e) {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    }
    
    handleTouchMove(e) {
      const t = e.touches[0];
      this.cursor.x = t.clientX;
      this.cursor.y = t.clientY;
      e.preventDefault();
    }
    
    dist(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    setSize() {
      const container = this.options.container;
      if (!container || !this.titleElement) return;
      
      const containerRect = container.getBoundingClientRect();
      
      let newFontSize = containerRect.width / (this.chars.length * 0.8);
      newFontSize = Math.max(newFontSize, this.options.minFontSize);
      
      this.fontSize = newFontSize;
      this.scaleY = 1;
      this.lineHeight = 1;
      
      this.titleElement.style.fontSize = `${this.fontSize}px`;
      this.titleElement.style.lineHeight = `${this.lineHeight}`;
      this.titleElement.style.transform = `scale(1, ${this.scaleY})`;
      
      // Additional scaling if needed
      if (this.options.scale) {
        requestAnimationFrame(() => {
          const textRect = this.titleElement.getBoundingClientRect();
          if (textRect.height > 0) {
            const yRatio = containerRect.height / textRect.height;
            this.scaleY = yRatio;
            this.lineHeight = yRatio;
            this.titleElement.style.lineHeight = `${this.lineHeight}`;
            this.titleElement.style.transform = `scale(1, ${this.scaleY})`;
          }
        });
      }
    }
    
    animate() {
      this.mouse.x += (this.cursor.x - this.mouse.x) / 15;
      this.mouse.y += (this.cursor.y - this.mouse.y) / 15;
      
      if (this.titleElement) {
        const titleRect = this.titleElement.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        
        this.spans.forEach(span => {
          if (!span) return;
          
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
          
          const d = this.dist(this.mouse, charCenter);
          
          const getAttr = (distance, minVal, maxVal) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };
          
          const wdth = this.options.width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = this.options.weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = this.options.italic ? getAttr(d, 0, 1).toFixed(2) : 0;
          const alphaVal = this.options.alpha ? getAttr(d, 0, 1).toFixed(2) : 1;
          
          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }
      
      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }
    
    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('resize', this.setSize);
      
      if (this.options.container) {
        this.options.container.innerHTML = '';
      }
    }
  }
  
  // Initialize TextPressure with desired options
  const textPressure = new TextPressure({
    container: document.getElementById('text-pressure-container'),
    text: '@dazeydo',
    flex: true,
    alpha: false,
    stroke: true,
    width: true,
    weight: true,
    italic: true,
    textColor: 'transparent',
    strokeColor: 'rgba(94, 51, 182, 0.4)',
    minFontSize: 36
  });
  
  // Make it globally accessible if needed
  window.textPressure = textPressure;
}); 
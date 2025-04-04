document.addEventListener('DOMContentLoaded', () => {
    // Initialize the tilted card
    const tiltedCard = new TiltedCard({
        selector: '#tilted-card-container',
        imageSrc: 'dazey.webp',
        altText: 'Profile Image',
        captionText: '',
        containerHeight: '150px',
        containerWidth: '150px',
        imageHeight: '150px',
        imageWidth: '150px',
        scaleOnHover: 1.2,
        rotateAmplitude: 12,
        showTooltip: false
    });

    // NSFW Toggle Functionality
    const nsfwToggle = document.getElementById('nsfw-toggle-checkbox');
    const nsfwContent = document.querySelectorAll('.nsfw-content');
    
    // Toggle NSFW content visibility
    nsfwToggle.addEventListener('change', function() {
        nsfwContent.forEach(item => {
            if (this.checked) {
                item.classList.add('hidden');
            } else {
                item.classList.remove('hidden');
            }
        });
        
        // Save preference to localStorage
        localStorage.setItem('hideNsfw', this.checked);
    });
    
    // Check if user has a saved preference
    const savedHideNsfw = localStorage.getItem('hideNsfw') === 'true';
    nsfwToggle.checked = savedHideNsfw;
    
    // Apply saved preference
    if (savedHideNsfw) {
        nsfwContent.forEach(item => {
            item.classList.add('hidden');
        });
    } else {
        nsfwContent.forEach(item => {
            item.classList.remove('hidden');
        });
    }

    // Animate links on page load
    const links = document.querySelectorAll('.link-card');
    
    // Stagger animation for links
    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Add click effect
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Animate profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('mouseover', () => {
            profileImg.style.transform = 'scale(1.1)';
            profileImg.style.transition = 'transform 0.3s ease';
        });
        
        profileImg.addEventListener('mouseout', () => {
            profileImg.style.transform = 'scale(1)';
        });
    }
    
    // Add dynamic year to footer
    const footerYear = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    if (currentYear > 2025) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }
    
    // NSFW Warning Modal Functionality
    const modal = document.getElementById('nsfw-modal');
    const nsfwLinks = document.querySelectorAll('.nsfw-link');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-nsfw');
    const confirmBtn = document.getElementById('confirm-nsfw');
    
    let currentNsfwUrl = '';
    
    // Show modal when NSFW link is clicked
    nsfwLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentNsfwUrl = link.getAttribute('data-url');
            showModal();
        });
    });
    
    // Close modal when X is clicked
    closeModal.addEventListener('click', () => {
        hideModal();
    });
    
    // Close modal when Cancel is clicked
    cancelBtn.addEventListener('click', () => {
        hideModal();
    });
    
    // Open NSFW site in new tab when Confirm is clicked
    confirmBtn.addEventListener('click', () => {
        if (currentNsfwUrl) {
            window.open(currentNsfwUrl, '_blank');
        }
        hideModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
    
    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
});

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('script.js: DOM content loaded');
    
    // Avoid duplicate initialization if already initialized
    if (window.daisyInitialized) {
        console.log('script.js: Avoiding duplicate initialization');
        return;
    }
    window.daisyInitialized = true;
    
    // Check device size and redirect if needed
    const isMobileDevice = window.innerWidth < 768;
    const isDesktopVersion = !window.location.href.includes('mobile.html');
    
    if (isMobileDevice && isDesktopVersion) {
        if (!localStorage.getItem('preferDesktop')) {
            window.location.href = 'mobile.html';
        }
    }
    
    // Verify Google Analytics
    verifyGoogleAnalytics();
    
    // Initialize NSFW toggle
    initializeNSFWToggle();
    
    // Initialize social sharing
    initializeSocialSharing();
    
    // Add page transition for internal links
    initializePageTransitions();
    
    // Add translations for loading state if they don't exist
    if (typeof translations !== 'undefined') {
        for (const lang in translations) {
            if (!translations[lang]['loading']) {
                switch(lang) {
                    case 'en':
                        translations[lang]['loading'] = 'Loading...';
                        break;
                    case 'es':
                        translations[lang]['loading'] = 'Cargando...';
                        break;
                    case 'fr':
                        translations[lang]['loading'] = 'Chargement...';
                        break;
                    case 'de':
                        translations[lang]['loading'] = 'Laden...';
                        break;
                }
            }
        }
    }
});

// Verify Google Analytics is loaded
function verifyGoogleAnalytics() {
    if (typeof gtag === 'function') {
        console.log('Google Analytics (gtag) is properly loaded');
        
        // Send a test event
        gtag('event', 'test_event', {
            'event_category': 'testing',
            'event_label': 'gtag_verification'
        });
        console.log('Test event sent to Google Analytics');
        
        // Track page view explicitly
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
        console.log('Page view event sent to Google Analytics');
        
        // Add tracking to all hyperlinks
        addLinkTracking();
    } else {
        console.error('Google Analytics (gtag) is not loaded properly!');
    }
}

// Add tracking to all hyperlinks
function addLinkTracking() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        // Skip links that already have click listeners for tracking
        if (link.getAttribute('data-ga-tracked') === 'true') {
            return;
        }
        
        link.setAttribute('data-ga-tracked', 'true');
        
        // Store original click handler if it exists
        const originalOnClick = link.onclick;
        
        link.onclick = function(e) {
            const href = this.getAttribute('href');
            const isExternal = href && href.indexOf('http') === 0 && href.indexOf(window.location.hostname) === -1;
            const linkText = this.textContent.trim();
            const linkClass = this.className;
            
            // Determine the social network or link type
            let linkType = 'other';
            if (linkClass.includes('discord')) linkType = 'discord';
            else if (linkClass.includes('instagram')) linkType = 'instagram';
            else if (linkClass.includes('twitch')) linkType = 'twitch';
            else if (linkClass.includes('kick')) linkType = 'kick';
            else if (linkClass.includes('onlyfans')) linkType = 'onlyfans';
            else if (linkClass.includes('chaturbate')) linkType = 'chaturbate';
            else if (linkClass.includes('twitter') || linkClass.includes('x-btn')) linkType = 'twitter';
            else if (linkClass.includes('facebook')) linkType = 'facebook';
            else if (linkClass.includes('whatsapp')) linkType = 'whatsapp';
            else if (linkClass.includes('linkedin')) linkType = 'linkedin';
            else if (linkClass.includes('pinterest')) linkType = 'pinterest';
            else if (linkClass.includes('email')) linkType = 'email';
            else if (linkClass.includes('copy')) linkType = 'copy_link';
            
            // Track the click with more specific information
            gtag('event', 'link_click', {
                'event_category': isExternal ? 'external_link' : 'internal_link',
                'event_label': linkType + ': ' + (linkText || href),
                'link_type': linkType,
                'link_text': linkText,
                'link_url': href,
                'link_class': linkClass,
                'outbound': isExternal
            });
            
            console.log(`Link click tracked: ${linkType} - ${linkText || href} (${isExternal ? 'external' : 'internal'})`);
            
            // If it's an external link with target="_blank", allow default behavior
            if (isExternal && this.getAttribute('target') === '_blank') {
                // Call original onclick if it exists
                if (originalOnClick) {
                    return originalOnClick.call(this, e);
                }
                return true;
            }
            
            // For internal links or links that don't open in new tab
            if (!isExternal || this.getAttribute('target') !== '_blank') {
                // Prevent default navigation
                e.preventDefault();
                
                // Navigate after a short delay to allow event to be sent
                setTimeout(() => {
                    if (originalOnClick) {
                        originalOnClick.call(this, e);
                    } else {
                        window.location.href = href;
                    }
                }, 100);
                
                return false;
            }
        };
    });
    
    console.log(`Added tracking to ${links.length} links`);
}

// Initialize NSFW toggle
function initializeNSFWToggle() {
    const toggleCheckbox = document.getElementById('nsfw-toggle-checkbox');
    const nsfwContent = document.querySelectorAll('.nsfw-content');
    const nsfwModal = document.getElementById('nsfw-modal');
    const confirmBtn = document.getElementById('confirm-nsfw');
    const cancelBtn = document.getElementById('cancel-nsfw');
    const closeModal = document.querySelector('.close-modal');
    
    // Log what we found for debugging
    console.log(`NSFW toggle found: ${!!toggleCheckbox}, NSFW content count: ${nsfwContent.length}, Modal found: ${!!nsfwModal}`);
    
    if (!toggleCheckbox) {
        console.warn('NSFW toggle checkbox not found');
        return;
    }
    
    // Use a consistent key for localStorage going forward
    const NSFW_STORAGE_KEY = 'hideNSFW';
    
    // Check both possible localStorage keys to support existing user preferences
    // This handles both 'hideNSFW' (new) and 'hideNsfw' (old) keys for backward compatibility
    const nsfwHidden = localStorage.getItem(NSFW_STORAGE_KEY) === 'true' || 
                       localStorage.getItem('hideNsfw') === 'true';
    
    console.log(`NSFW state from localStorage: ${nsfwHidden}`);
    
    // Initialize toggle state based on saved preference
    toggleCheckbox.checked = nsfwHidden;
    
    // Apply initial state to all NSFW content
    applyNsfwVisibility(nsfwHidden);
    
    // Handle toggle changes
    toggleCheckbox.addEventListener('change', function() {
        const isHidden = this.checked;
        
        // Save preference to localStorage (use consistent key going forward)
        localStorage.setItem(NSFW_STORAGE_KEY, isHidden.toString());
        // Also set old key for backward compatibility
        localStorage.setItem('hideNsfw', isHidden.toString());
        
        console.log(`NSFW preference saved: ${isHidden}`);
        
        // Apply the visibility change
        applyNsfwVisibility(isHidden);
    });
    
    // Function to apply visibility state to all NSFW content
    function applyNsfwVisibility(isHidden) {
        nsfwContent.forEach(item => {
            if (isHidden) {
                item.classList.add('hidden');
            } else {
                item.classList.remove('hidden');
            }
        });
    }
    
    // Only setup modal if it exists
    if (nsfwModal) {
        // Handle NSFW link clicks
        const nsfwLinks = document.querySelectorAll('.nsfw-link');
        let currentURL = '';
        
        nsfwLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                currentURL = this.getAttribute('data-url') || this.getAttribute('href');
                
                if (!currentURL) {
                    console.warn('No URL found for NSFW link');
                    return;
                }
                
                // Show modal using consistent method
                nsfwModal.style.display = 'flex';
            });
        });
        
        // Modal button handlers
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                nsfwModal.style.display = 'none';
                if (currentURL) {
                    window.open(currentURL, '_blank');
                    currentURL = ''; // Clear URL after use
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                nsfwModal.style.display = 'none';
                currentURL = ''; // Clear URL after cancellation
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                nsfwModal.style.display = 'none';
                currentURL = ''; // Clear URL after cancellation
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === nsfwModal) {
                nsfwModal.style.display = 'none';
                currentURL = ''; // Clear URL after cancellation
            }
        });
    }
}

// Initialize social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const shareMessage = document.getElementById('share-message');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    console.log(`Initializing social sharing: Found ${shareButtons.length} buttons`);
    
    // Clear any previous message
    if (shareMessage) {
        shareMessage.textContent = '';
    } else {
        console.warn('Share message element not found');
    }
    
    // Add click event to each share button
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Share button clicked: ${button.className}`);
            let shareUrl = '';
            
            // X (formerly Twitter) Share
            if (button.classList.contains('x-btn')) {
                const text = encodeURIComponent('Check out this awesome website!');
                const hashtags = encodeURIComponent('dazeydo,design');
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=${hashtags}`;
                window.open(shareUrl, '_blank');
            }
            
            // Facebook Share
            else if (button.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                window.open(shareUrl, '_blank');
            }
            
            // WhatsApp Share
            else if (button.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
                window.open(shareUrl, '_blank');
            }
            
            // LinkedIn Share
            else if (button.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                window.open(shareUrl, '_blank');
            }
            
            // Pinterest Share
            else if (button.classList.contains('pinterest')) {
                const description = encodeURIComponent('Dazey Do Website');
                const imageUrl = encodeURIComponent(window.location.origin + '/dazey.webp');
                shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${description}`;
                window.open(shareUrl, '_blank');
            }
            
            // Email Share
            else if (button.classList.contains('email')) {
                const subject = encodeURIComponent('Check out this website');
                const body = encodeURIComponent(`I thought you might like this: ${window.location.href}`);
                shareUrl = `mailto:?subject=${subject}&body=${body}`;
                window.location.href = shareUrl;
            }
            
            // Copy Link
            else if (button.classList.contains('copy')) {
                copyTextToClipboard(window.location.href);
                showShareMessage('Link copied to clipboard!');
            }
        });
    });
    
    // Show temporary message
    function showShareMessage(message) {
        console.log(`Attempting to show share message: ${message}`);
        if (!shareMessage) {
            console.warn('No share message element found');
            return;
        }
        
        shareMessage.textContent = message;
        shareMessage.style.opacity = '1';
        
        setTimeout(() => {
            shareMessage.style.opacity = '0';
        }, 2000);
    }
    
    // Copy text to clipboard
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showShareMessage('Link copied to clipboard!');
            }, (err) => {
                console.error('Could not copy text: ', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    }
    
    // Fallback copy method
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            showShareMessage(successful ? 'Link copied to clipboard!' : 'Unable to copy link');
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
            showShareMessage('Unable to copy link');
        }
        
        document.body.removeChild(textArea);
    }
}

// Initialize page transitions
function initializePageTransitions() {
    const internalLinks = document.querySelectorAll('a:not([target="_blank"])');
    
    internalLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip links without href or with # (anchor links)
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
            return;
        }
        
        // Skip external links
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            return;
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Apply exit animation
            document.body.classList.remove('page-enter');
            document.body.classList.add('page-exit');
            
            // Navigate to the link after animation
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// Direct sharing functions
function shareOnTwitter() {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this awesome website!');
    const hashtags = encodeURIComponent('dazeydo,design');
    const shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=${hashtags}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'twitter',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'twitter',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - twitter');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on Twitter!');
}

function shareOnFacebook() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'facebook',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'facebook',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - facebook');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on Facebook!');
}

function shareOnWhatsApp() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    const shareUrl = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'whatsapp',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'whatsapp',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - whatsapp');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on WhatsApp!');
}

function shareOnLinkedIn() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'linkedin',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'linkedin',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - linkedin');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on LinkedIn!');
}

function shareOnPinterest() {
    const pageUrl = encodeURIComponent(window.location.href);
    const description = encodeURIComponent('Dazey Do Website');
    const imageUrl = encodeURIComponent(window.location.origin + '/dazey.webp');
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${description}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'pinterest',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'pinterest',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - pinterest');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on Pinterest!');
}

function shareViaEmail() {
    const subject = encodeURIComponent('Check out this awesome website!');
    const body = encodeURIComponent(`I found this website and thought you might like it: ${window.location.href}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'email',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'email',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - email');
    
    window.location.href = mailtoLink;
    showShareMessage('Email created!');
}

function copyPageLink() {
    copyTextToClipboard(window.location.href);
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'copy_link',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'share_platform': 'clipboard',
        'action': 'share_button_click'
    });
    console.log('GA Event tracked: share - copy_link');
    
    showShareMessage('Link copied to clipboard!');
}

// Global function to show share message (used by both social sharing init and direct share functions)
function showShareMessage(message) {
    console.log(`Attempting to show share message: ${message}`);
    const shareMessage = document.getElementById('share-message');
    
    if (!shareMessage) {
        console.warn('No share message element found');
        return;
    }
    
    shareMessage.textContent = message;
    shareMessage.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
        shareMessage.style.opacity = '0';
    }, 2000);
}

// Copy to clipboard function used by copyPageLink
function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showShareMessage('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Fallback for copy to clipboard 
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        showShareMessage(successful ? 'Link copied to clipboard!' : 'Unable to copy link');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showShareMessage('Unable to copy link');
    }
    
    document.body.removeChild(textArea);
} 
// Mobile version main script
console.log('Mobile.js: Script loading');

// Single DOMContentLoaded event to prevent conflicts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile.js: DOM content loaded');
    
    // Avoid duplicate initialization if already initialized
    if (window.mobileInitialized) {
        console.log('Mobile.js: Avoiding duplicate initialization');
        return;
    }
    window.mobileInitialized = true;
    
    // IMMEDIATELY force display the content
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    const container = document.querySelector('.container');
    const appContainer = document.querySelector('.app-container');
    
    if (container) {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        console.log('Mobile.js: Container display forced');
    }
    
    if (appContainer) {
        appContainer.style.display = 'block';
        appContainer.style.visibility = 'visible';
        appContainer.style.opacity = '1';
        console.log('Mobile.js: App container display forced');
    }
    
    // Fix for 100vh issue on mobile browsers
    function setAppHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    setAppHeight();
    
    // Verify Google Analytics
    verifyGoogleAnalytics();
    
    // Animate links on page load
    const links = document.querySelectorAll('.link-card');
    
    // Stagger animation for links
    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 50 * index);
    });
    
    // Add touch ripple effect
    links.forEach(link => {
        link.addEventListener('touchstart', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Initialize components with error handling
    try {
        initializeNSFWToggle();
        console.log('Mobile.js: NSFW toggle initialized');
    } catch (e) {
        console.error('Mobile.js: Error initializing NSFW toggle', e);
    }
    
    try {
        initializeSocialSharing();
        console.log('Mobile.js: Social sharing initialized');
    } catch (e) {
        console.error('Mobile.js: Error initializing social sharing', e);
    }
    
    try {
        initializePageTransitions();
        console.log('Mobile.js: Page transitions initialized');
    } catch (e) {
        console.error('Mobile.js: Error initializing page transitions', e);
    }
    
    // Handle desktop version link with transition
    const desktopLink = document.querySelector('.view-desktop-link a');
    if (desktopLink) {
        desktopLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store desktop preference
            localStorage.setItem('preferDesktop', 'true');
            
            // Apply exit animation
            document.body.classList.remove('page-enter');
            document.body.classList.add('page-exit');
            
            // Navigate to desktop version after animation
            setTimeout(() => {
                window.location.href = 'index.html?from=mobile';
            }, 500);
        });
        console.log('Mobile.js: Desktop link handler added');
    }
    
    // Add active state to buttons for better touch feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.classList.add('active');
        });
        
        button.addEventListener('touchend', () => {
            button.classList.remove('active');
        });
    });
    
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
    
    // Force hide preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
        console.log('Mobile.js: Preloader forcibly hidden');
    }
});

// Verify Google Analytics is loaded
function verifyGoogleAnalytics() {
    if (typeof gtag === 'function') {
        console.log('Mobile: Google Analytics (gtag) is properly loaded');
        
        // Send a test event
        gtag('event', 'test_event', {
            'event_category': 'testing',
            'event_label': 'mobile_gtag_verification',
            'device': 'mobile'
        });
        console.log('Mobile: Test event sent to Google Analytics');
        
        // Track page view explicitly
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname,
            'device': 'mobile'
        });
        console.log('Mobile: Page view event sent to Google Analytics');
        
        // Add tracking to all hyperlinks
        addLinkTracking();
    } else {
        console.error('Mobile: Google Analytics (gtag) is not loaded properly!');
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
                'outbound': isExternal,
                'device': 'mobile'
            });
            
            console.log(`Mobile link click tracked: ${linkType} - ${linkText || href} (${isExternal ? 'external' : 'internal'})`);
            
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
    
    console.log(`Mobile: Added tracking to ${links.length} links`);
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
    console.log(`Mobile NSFW toggle found: ${!!toggleCheckbox}, NSFW content count: ${nsfwContent.length}, Modal found: ${!!nsfwModal}`);
    
    if (!toggleCheckbox) {
        console.warn('Mobile: NSFW toggle checkbox not found');
        return;
    }
    
    // Use a consistent key for localStorage going forward
    const NSFW_STORAGE_KEY = 'hideNSFW';
    
    // Check both possible localStorage keys to support existing user preferences
    // This handles both 'hideNSFW' (new) and 'hideNsfw' (old) keys for backward compatibility
    const nsfwHidden = localStorage.getItem(NSFW_STORAGE_KEY) === 'true' || 
                       localStorage.getItem('hideNsfw') === 'true';
    
    console.log(`Mobile: NSFW state from localStorage: ${nsfwHidden}`);
    
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
        
        console.log(`Mobile: NSFW preference saved: ${isHidden}`);
        
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
                    console.warn('Mobile: No URL found for NSFW link');
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
    
    console.log(`Mobile initializing social sharing: Found ${shareButtons.length} buttons`);
    
    // Clear any previous message
    if (shareMessage) {
        shareMessage.textContent = '';
    } else {
        console.warn('Mobile share message element not found');
    }
    
    // Add click event to each share button
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Mobile share button clicked: ${button.className}`);
            let shareUrl = '';
            
            // X (formerly Twitter) Share
            if (button.classList.contains('x-btn')) {
                const text = encodeURIComponent('Check out this awesome website!');
                const hashtags = encodeURIComponent('dazeydo,design');
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=${hashtags}`;
                window.open(shareUrl, '_blank', 'width=550,height=420');
            }
            
            // Facebook Share
            else if (button.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                window.open(shareUrl, '_blank', 'width=550,height=420');
            }
            
            // WhatsApp Share
            else if (button.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
                window.open(shareUrl, '_blank');
            }
            
            // LinkedIn Share
            else if (button.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                window.open(shareUrl, '_blank', 'width=550,height=420');
            }
            
            // Pinterest Share
            else if (button.classList.contains('pinterest')) {
                const description = encodeURIComponent('Dazey Do Website');
                const imageUrl = encodeURIComponent(window.location.origin + '/dazey.webp');
                shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${description}`;
                window.open(shareUrl, '_blank', 'width=550,height=420');
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
        console.log(`Mobile attempting to show share message: ${message}`);
        if (!shareMessage) {
            console.warn('No mobile share message element found');
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
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Mobile: Clipboard write succeeded');
            })
            .catch(err => {
                console.error('Mobile: Clipboard write failed: ', err);
                fallbackCopyTextToClipboard(text);
            });
    }
    
    // Fallback copy method
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            console.log('Mobile fallback: Copying text successful');
        } catch (err) {
            console.error('Mobile fallback: Copying text failed: ', err);
        }

        document.body.removeChild(textArea);
    }
}

// Initialize page transitions
function initializePageTransitions() {
    const internalLinks = document.querySelectorAll('a:not([target="_blank"]):not(#desktop-link)');
    
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
    console.log('Mobile: Sharing on Twitter/X');
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    const shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=daisy`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'twitter',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'twitter',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - twitter');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on X');
}

function shareOnFacebook() {
    console.log('Mobile: Sharing on Facebook');
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'facebook',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'facebook',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - facebook');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on Facebook');
}

function shareOnWhatsApp() {
    console.log('Mobile: Sharing on WhatsApp');
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    const shareUrl = `https://api.whatsapp.com/send?text=${text}%20${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'whatsapp',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'whatsapp',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - whatsapp');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on WhatsApp');
}

function shareOnLinkedIn() {
    console.log('Mobile: Sharing on LinkedIn');
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'linkedin',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'linkedin',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - linkedin');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on LinkedIn');
}

function shareOnPinterest() {
    console.log('Mobile: Sharing on Pinterest');
    const pageUrl = encodeURIComponent(window.location.href);
    const img = encodeURIComponent(document.querySelector('img')?.src || '');
    const description = encodeURIComponent(document.title);
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${img}&description=${description}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'pinterest',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'pinterest',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - pinterest');
    
    window.open(shareUrl, '_blank');
    showShareMessage('Shared on Pinterest');
}

function shareViaEmail() {
    console.log('Mobile: Sharing via Email');
    const subject = encodeURIComponent(document.title);
    const body = encodeURIComponent(`Check this out: ${window.location.href}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'email',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'email',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - email');
    
    window.location.href = mailtoLink;
    showShareMessage('Email created');
}

function copyPageLink() {
    console.log('Mobile: Copying page link');
    copyTextToClipboard(window.location.href);
    
    // Track this event in Google Analytics
    gtag('event', 'share', {
        'method': 'copy_link',
        'content_type': 'page',
        'item_id': window.location.pathname,
        'device': 'mobile',
        'share_platform': 'clipboard',
        'action': 'share_button_click'
    });
    console.log('Mobile GA Event tracked: share - copy_link');
    
    showShareMessage('Link copied to clipboard');
}

// Global function to show share message (used by both social sharing init and direct share functions)
function showShareMessage(message) {
    console.log(`Mobile: Attempting to show share message: ${message}`);
    const shareMessage = document.getElementById('share-message');
    
    if (!shareMessage) {
        console.warn('Mobile: No share message element found');
        return;
    }
    
    shareMessage.textContent = message;
    shareMessage.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
        shareMessage.style.opacity = '0';
    }, 2000);
}

console.log('Mobile.js: Script loaded'); 
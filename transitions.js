// Handle page transitions and social sharing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables for translated messages
    window.twitterShareText = 'Shared on Twitter!';
    window.facebookShareText = 'Shared on Facebook!';
    window.whatsappShareText = 'Shared on WhatsApp!';
    window.copiedText = 'Link copied to clipboard!';
    
    // If translations exist, use them
    if (window.translations) {
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        if (window.translations[currentLang]) {
            window.twitterShareText = window.translations[currentLang]['shared-twitter'];
            window.facebookShareText = window.translations[currentLang]['shared-facebook'];
            window.whatsappShareText = window.translations[currentLang]['shared-whatsapp'];
            window.copiedText = window.translations[currentLang]['copied'];
        }
    }
    
    // Page transition handling
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not(.nsfw-link)');
    
    links.forEach(link => {
        link.addEventListener('click', e => {
            // Only apply transition for internal links
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Add exit animation
                document.body.classList.remove('page-enter');
                document.body.classList.add('page-exit');
                
                // Navigate after transition completes
                setTimeout(() => {
                    // Add transition parameter to track that we're coming from a transition
                    let url = new URL(href, window.location.origin);
                    url.searchParams.set('transition', 'true');
                    window.location.href = url.toString();
                }, 500); // Match this with your CSS transition duration
            }
        });
    });
    
    // Social sharing functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    const shareMessage = document.getElementById('share-message');
    
    if (shareButtons.length > 0) {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                let shareUrl = '';
                
                if (button.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
                    window.open(shareUrl, '_blank');
                    showMessage(window.twitterShareText);
                } 
                else if (button.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
                    window.open(shareUrl, '_blank');
                    showMessage(window.facebookShareText);
                } 
                else if (button.classList.contains('whatsapp')) {
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`;
                    window.open(shareUrl, '_blank');
                    showMessage(window.whatsappShareText);
                } 
                else if (button.classList.contains('copy')) {
                    copyToClipboard(pageUrl);
                    showMessage(window.copiedText);
                }
                
                // Add click animation
                button.classList.add('clicked');
                setTimeout(() => {
                    button.classList.remove('clicked');
                }, 200);
            });
        });
    }
    
    function copyToClipboard(text) {
        // Use the newer navigator.clipboard API when available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    // Fallback to the older method
                    legacyCopyToClipboard(text);
                });
        } else {
            // Fallback for browsers that don't support clipboard API
            legacyCopyToClipboard(text);
        }
    }
    
    function legacyCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    function showMessage(message) {
        if (shareMessage) {
            shareMessage.textContent = message;
            shareMessage.classList.add('show');
            
            setTimeout(() => {
                shareMessage.classList.remove('show');
            }, 2000);
        }
    }
}); 
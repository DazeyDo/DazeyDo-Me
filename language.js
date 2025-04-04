// Language Switcher Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Language translations object
    const translations = {
        en: {
            // Profile info
            'username': '@dazeydo',
            'tagline': 'Where the fun begins 💕',
            'copyright': '© 2025 Dazey Do •',
            
            // Navigation and Sections
            'socials': 'SOCIALS',
            'donate': 'DONATE',
            'share': 'Share',
            
            // Social links
            'discord': 'Discord 📲',
            'instagram': 'Instagram 📸',
            'twitch': 'Twitch 📹🔅',
            'kick': 'Kick 📽️🔆',
            'onlyfans': 'OnlyFans 😈🔥',
            'chaturbate': 'Chaturbate 😈',
            
            // Donation links
            'wishlist': 'Wishlist 🎁',
            'send-gift': 'Send a gift 💝',
            
            // NSFW related
            'nsfw': 'NSFW 18+',
            'hide-nsfw': 'Hide NSFW',
            'adult-warning': 'Adult Content Warning',
            'adult-warning-text-1': 'You are about to visit a site that contains adult content intended for individuals 18 years of age or older.',
            'adult-warning-text-2': 'By clicking "Continue", you confirm that you are at least 18 years old and willing to view adult content.',
            
            // Buttons and misc
            'cancel': 'Cancel',
            'continue': 'Continue',
            'cookie-preferences': 'Cookie Preferences',
            'visitors': 'visitors',
            'loading': 'Loading...',
            'desktop-link': 'Switch to Desktop Version',
            'copied': 'Link copied to clipboard!',
            'shared-twitter': 'Shared on Twitter!',
            'shared-facebook': 'Shared on Facebook!',
            'shared-whatsapp': 'Shared on WhatsApp!',
            
            // Cookie consent
            'cookie-message': 'This website uses cookies to ensure you get the best experience on our website.',
            'accept-cookies': 'Accept Cookies',
            'reject-cookies': 'Reject'
        },
        es: {
            // Profile info
            'username': '@dazeydo',
            'tagline': 'Donde comienza la diversión 💕',
            'copyright': '© 2025 Dazey Do •',
            
            // Navigation and Sections
            'socials': 'REDES SOCIALES',
            'donate': 'DONAR',
            'share': 'Compartir',
            
            // Social links
            'discord': 'Discord 📲',
            'instagram': 'Instagram 📸',
            'twitch': 'Twitch 📹🔅',
            'kick': 'Kick 📽️🔆',
            'onlyfans': 'OnlyFans 😈🔥',
            'chaturbate': 'Chaturbate 😈',
            
            // Donation links
            'wishlist': 'Lista de deseos 🎁',
            'send-gift': 'Enviar un regalo 💝',
            
            // NSFW related
            'nsfw': 'NSFW 18+',
            'hide-nsfw': 'Ocultar NSFW',
            'adult-warning': 'Advertencia de contenido para adultos',
            'adult-warning-text-1': 'Estás a punto de visitar un sitio que contiene contenido para adultos destinado a personas mayores de 18 años.',
            'adult-warning-text-2': 'Al hacer clic en "Continuar", confirmas que tienes al menos 18 años y estás dispuesto a ver contenido para adultos.',
            
            // Buttons and misc
            'cancel': 'Cancelar',
            'continue': 'Continuar',
            'cookie-preferences': 'Preferencias de cookies',
            'visitors': 'visitantes',
            'loading': 'Cargando...',
            'desktop-link': 'Cambiar a versión de escritorio',
            'copied': '¡Enlace copiado al portapapeles!',
            'shared-twitter': '¡Compartido en Twitter!',
            'shared-facebook': '¡Compartido en Facebook!',
            'shared-whatsapp': '¡Compartido en WhatsApp!',
            
            // Cookie consent
            'cookie-message': 'Este sitio web utiliza cookies para garantizar que obtenga la mejor experiencia en nuestro sitio web.',
            'accept-cookies': 'Aceptar Cookies',
            'reject-cookies': 'Rechazar'
        },
        fr: {
            // Profile info
            'username': '@dazeydo',
            'tagline': 'Là où le plaisir commence 💕',
            'copyright': '© 2025 Dazey Do •',
            
            // Navigation and Sections
            'socials': 'RÉSEAUX SOCIAUX',
            'donate': 'DONS',
            'share': 'Partager',
            
            // Social links
            'discord': 'Discord 📲',
            'instagram': 'Instagram 📸',
            'twitch': 'Twitch 📹🔅',
            'kick': 'Kick 📽️🔆',
            'onlyfans': 'OnlyFans 😈🔥',
            'chaturbate': 'Chaturbate 😈',
            
            // Donation links
            'wishlist': 'Liste de souhaits 🎁',
            'send-gift': 'Envoyer un cadeau 💝',
            
            // NSFW related
            'nsfw': 'NSFW 18+',
            'hide-nsfw': 'Masquer NSFW',
            'adult-warning': 'Avertissement de contenu pour adultes',
            'adult-warning-text-1': 'Vous êtes sur le point de visiter un site contenant du contenu pour adultes destiné aux personnes âgées de 18 ans ou plus.',
            'adult-warning-text-2': 'En cliquant sur "Continuer", vous confirmez que vous avez au moins 18 ans et que vous souhaitez consulter du contenu pour adultes.',
            
            // Buttons and misc
            'cancel': 'Annuler',
            'continue': 'Continuer',
            'cookie-preferences': 'Préférences de cookies',
            'visitors': 'visiteurs',
            'loading': 'Chargement...',
            'desktop-link': 'Passer à la version bureau',
            'copied': 'Lien copié dans le presse-papiers !',
            'shared-twitter': 'Partagé sur Twitter !',
            'shared-facebook': 'Partagé sur Facebook !',
            'shared-whatsapp': 'Partagé sur WhatsApp !',
            
            // Cookie consent
            'cookie-message': 'Ce site Web utilise des cookies pour vous garantir la meilleure expérience sur notre site Web.',
            'accept-cookies': 'Accepter les Cookies',
            'reject-cookies': 'Refuser'
        },
        de: {
            // Profile info
            'username': '@dazeydo',
            'tagline': 'Wo der Spaß beginnt 💕',
            'copyright': '© 2025 Dazey Do •',
            
            // Navigation and Sections
            'socials': 'SOZIALE MEDIEN',
            'donate': 'SPENDEN',
            'share': 'Teilen',
            
            // Social links
            'discord': 'Discord 📲',
            'instagram': 'Instagram 📸',
            'twitch': 'Twitch 📹🔅',
            'kick': 'Kick 📽️🔆',
            'onlyfans': 'OnlyFans 😈🔥',
            'chaturbate': 'Chaturbate 😈',
            
            // Donation links
            'wishlist': 'Wunschliste 🎁',
            'send-gift': 'Geschenk senden 💝',
            
            // NSFW related
            'nsfw': 'NSFW 18+',
            'hide-nsfw': 'NSFW ausblenden',
            'adult-warning': 'Warnung vor Inhalten für Erwachsene',
            'adult-warning-text-1': 'Sie sind dabei, eine Website mit Inhalten für Erwachsene zu besuchen, die für Personen ab 18 Jahren bestimmt sind.',
            'adult-warning-text-2': 'Indem Sie auf "Fortfahren" klicken, bestätigen Sie, dass Sie mindestens 18 Jahre alt sind und Inhalte für Erwachsene ansehen möchten.',
            
            // Buttons and misc
            'cancel': 'Abbrechen',
            'continue': 'Fortfahren',
            'cookie-preferences': 'Cookie-Einstellungen',
            'visitors': 'Besucher',
            'loading': 'Laden...',
            'desktop-link': 'Zur Desktop-Version wechseln',
            'copied': 'Link in die Zwischenablage kopiert!',
            'shared-twitter': 'Auf Twitter geteilt!',
            'shared-facebook': 'Auf Facebook geteilt!',
            'shared-whatsapp': 'Auf WhatsApp geteilt!',
            
            // Cookie consent
            'cookie-message': 'Diese Website verwendet Cookies, um sicherzustellen, dass Sie die beste Erfahrung auf unserer Website erhalten.',
            'accept-cookies': 'Cookies akzeptieren',
            'reject-cookies': 'Ablehnen'
        }
    };

    // Make translations globally available
    window.translations = translations;

    // Get language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Get saved language or default to English
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Function to apply translations
    function applyTranslations(lang) {
        // Save selected language
        localStorage.setItem('selectedLanguage', lang);
        
        // Update buttons UI
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('current');
            } else {
                btn.classList.remove('current');
            }
        });
        
        // Apply translations to all elements with data-lang-key
        const elements = document.querySelectorAll('[data-lang-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = element.tagName === 'A' || element.tagName === 'SPAN' || element.tagName === 'P' || element.tagName === 'DIV' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'BUTTON' ? 
                    translations[lang][key] : element.textContent;
            }
        });

        // Update share message translations
        updateShareMessageTranslations(lang);
    }
    
    // Function to update share messages for the correct language
    function updateShareMessageTranslations(lang) {
        // Update the share message functions if they exist
        if (window.showShareMessage) {
            window.twitterShareText = translations[lang]['shared-twitter'];
            window.facebookShareText = translations[lang]['shared-facebook'];
            window.whatsappShareText = translations[lang]['shared-whatsapp'];
            window.copiedText = translations[lang]['copied'];
        }
    }
    
    // Add click event to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) {
                applyTranslations(lang);
                
                // Add a small animation to indicate language change
                document.querySelectorAll('[data-lang-key]').forEach(el => {
                    el.classList.add('lang-changed');
                    setTimeout(() => {
                        el.classList.remove('lang-changed');
                    }, 700);
                });
            }
        });
    });
    
    // Apply saved language on page load
    applyTranslations(savedLang);
    
    // Add CSS for transition effect
    const style = document.createElement('style');
    style.textContent = `
        [data-lang-key] {
            transition: opacity 0.3s ease;
        }
        
        .lang-changed {
            opacity: 0.7;
            animation: pulse-text 0.7s ease;
        }
        
        @keyframes pulse-text {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}); 
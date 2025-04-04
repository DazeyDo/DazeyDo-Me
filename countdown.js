// Countdown Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase references if available
    let eventRef;
    // Flag to track whether data has been loaded from Firebase
    let dataLoaded = false;
    
    // Get countdown elements
    const countdownContainer = document.getElementById('countdown-container');
    const countdownWrapper = document.getElementById('countdown-wrapper');
    
    // Hide countdown container immediately to prevent flash on reload
    if (countdownContainer) {
        countdownContainer.style.display = 'none';
        countdownContainer.style.visibility = 'hidden';
        countdownContainer.style.opacity = '0';
        countdownContainer.style.margin = '0';
        countdownContainer.style.padding = '0';
        countdownContainer.style.height = '0';
        countdownContainer.style.overflow = 'hidden';
        countdownContainer.style.position = 'absolute';
        countdownContainer.style.pointerEvents = 'none';
        countdownContainer.style.zIndex = '-1';
        countdownContainer.style.transform = 'scale(0)';
        countdownContainer.classList.add('hidden');
    }
    
    // Make sure wrapper doesn't take up space if timer is hidden
    if (countdownWrapper) {
        countdownWrapper.style.height = '0';
        countdownWrapper.style.margin = '0';
        countdownWrapper.style.padding = '0';
        countdownWrapper.style.overflow = 'hidden';
        countdownWrapper.style.display = 'block';
        countdownWrapper.style.lineHeight = '0';
        countdownWrapper.style.fontSize = '0';
        countdownWrapper.style.position = 'relative';
    }
    
    // Add style to ensure countdown remains hidden until explicitly shown
    const style = document.createElement('style');
    style.textContent = `
        #countdown-container.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
    
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    const eventTitle = document.getElementById('event-title');
    const timerLabelElement = document.querySelector('.countdown-header span');
    
    // Exit early if countdown container doesn't exist
    if (!countdownContainer) {
        return;
    }
    
    try {
        if (firebase && firebase.database) {
            eventRef = firebase.database().ref('siteContent/upcomingEvent');
        }
    } catch (e) {
        console.warn('Firebase not initialized for countdown timer', e);
    }
    
    // Default event date (fallback if Firebase is not available)
    // Default to 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setHours(20, 0, 0, 0); // 8:00 PM
    
    let eventData = {
        date: defaultDate.getTime(),
        title: 'Special Stream!',
        label: 'Next Stream',
        completionMessage: 'Event has started! Use promo code: DAZEY25',
        showCompletionMessage: true,
        enabled: false // Default to disabled until Firebase data confirms it's enabled
    };
    
    // Create completion message element if it doesn't exist
    let completionMessageElement = document.getElementById('countdown-completion');
    if (!completionMessageElement) {
        completionMessageElement = document.createElement('div');
        completionMessageElement.id = 'countdown-completion';
        completionMessageElement.className = 'countdown-completion';
        completionMessageElement.style.display = 'none';
        countdownContainer.appendChild(completionMessageElement);
    }
    
    // Create date display element if it doesn't exist
    let dateDisplayElement = document.getElementById('countdown-date-display');
    if (!dateDisplayElement) {
        dateDisplayElement = document.createElement('div');
        dateDisplayElement.id = 'countdown-date-display';
        dateDisplayElement.className = 'countdown-date-display';
        
        // Insert after countdown timer but before title
        const timerElements = countdownContainer.querySelector('.countdown-timer');
        if (timerElements && timerElements.nextSibling) {
            countdownContainer.insertBefore(dateDisplayElement, timerElements.nextSibling);
        } else {
            countdownContainer.appendChild(dateDisplayElement);
        }
    }
    
    // Format date for display
    function formatEventDate(timestamp) {
        const eventDate = new Date(timestamp);
        const options = { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return eventDate.toLocaleDateString('en-US', options);
    }
    
    // Function to update the countdown timer
    function updateCountdown() {
        // Get current time
        const now = new Date().getTime();
        
        // Check if countdown container exists
        if (!countdownContainer) {
            return; // Exit if container doesn't exist
        }
        
        // Only proceed if we have loaded data from Firebase
        if (!dataLoaded) {
            return;
        }
        
        // Check if timer is enabled at all
        if (!eventData.enabled) {
            // Hide countdown container
            countdownContainer.classList.add('hidden');
            countdownContainer.setAttribute('aria-hidden', 'true');
            countdownContainer.style.display = 'none';
            countdownContainer.style.visibility = 'hidden';
            countdownContainer.style.opacity = '0';
            countdownContainer.style.margin = '0';
            countdownContainer.style.padding = '0';
            countdownContainer.style.height = '0';
            countdownContainer.style.overflow = 'hidden';
            countdownContainer.style.position = 'absolute';
            countdownContainer.style.pointerEvents = 'none';
            countdownContainer.style.zIndex = '-1';
            countdownContainer.style.transform = 'scale(0)';
            
            // Also collapse the wrapper
            if (countdownWrapper) {
                countdownWrapper.style.height = '0';
                countdownWrapper.style.margin = '0';
                countdownWrapper.style.padding = '0';
                countdownWrapper.style.overflow = 'hidden';
                countdownWrapper.style.display = 'block';
                countdownWrapper.style.lineHeight = '0';
                countdownWrapper.style.fontSize = '0';
                countdownWrapper.style.position = 'relative';
            }
            
            return;
        } else {
            // Show countdown container
            countdownContainer.classList.remove('hidden');
            countdownContainer.removeAttribute('aria-hidden');
            countdownContainer.style.display = 'block';
            countdownContainer.style.visibility = 'visible';
            countdownContainer.style.opacity = '1';
            countdownContainer.style.margin = '20px 0';
            countdownContainer.style.padding = '15px';
            countdownContainer.style.height = 'auto';
            countdownContainer.style.overflow = 'visible';
            countdownContainer.style.position = 'relative';
            countdownContainer.style.pointerEvents = 'auto';
            countdownContainer.style.zIndex = 'auto';
            countdownContainer.style.transform = 'scale(1)';
            
            // Make wrapper take up space again
            if (countdownWrapper) {
                countdownWrapper.style.height = 'auto';
                countdownWrapper.style.margin = '0';
                countdownWrapper.style.padding = '0';
                countdownWrapper.style.overflow = 'visible';
                countdownWrapper.style.display = 'block';
                countdownWrapper.style.lineHeight = 'normal';
                countdownWrapper.style.fontSize = 'inherit';
                countdownWrapper.style.position = 'relative';
            }
        }
        
        // Calculate time remaining
        const distance = eventData.date - now;
        
        // If the date is in the past, show completion message instead of hiding
        if (distance < 0) {
            // Hide the countdown elements
            const timerElements = countdownContainer.querySelector('.countdown-timer');
            if (timerElements) timerElements.style.display = 'none';
            
            // Hide date display
            if (dateDisplayElement) dateDisplayElement.style.display = 'none';
            
            // Show completion message if enabled
            if (eventData.showCompletionMessage) {
                completionMessageElement.textContent = eventData.completionMessage || 'Event has started!';
                completionMessageElement.style.display = 'block';
                
                // Keep the title but update it if needed
                if (eventTitle) {
                    eventTitle.textContent = eventData.completionTitle || eventData.title;
                }
                
                // Keep the container visible
                countdownContainer.classList.remove('hidden');
                countdownContainer.removeAttribute('aria-hidden');
                countdownContainer.style.display = 'block';
                countdownContainer.style.visibility = 'visible';
                countdownContainer.style.opacity = '1';
                countdownContainer.style.margin = '20px 0';
                countdownContainer.style.padding = '15px';
                countdownContainer.style.height = 'auto';
                countdownContainer.style.overflow = 'visible';
                countdownContainer.style.position = 'relative';
                countdownContainer.style.pointerEvents = 'auto';
                countdownContainer.style.zIndex = 'auto';
                countdownContainer.style.transform = 'scale(1)';
            } else {
                // If completion message is disabled and timer is expired, hide the container
                countdownContainer.classList.add('hidden');
                countdownContainer.setAttribute('aria-hidden', 'true');
                countdownContainer.style.display = 'none';
                countdownContainer.style.visibility = 'hidden';
                countdownContainer.style.opacity = '0';
                countdownContainer.style.margin = '0';
                countdownContainer.style.padding = '0';
                countdownContainer.style.height = '0';
                countdownContainer.style.overflow = 'hidden';
                countdownContainer.style.position = 'absolute';
                countdownContainer.style.pointerEvents = 'none';
                countdownContainer.style.zIndex = '-1';
                countdownContainer.style.transform = 'scale(0)';
            }
            return;
        } else {
            // Show normal countdown
            countdownContainer.classList.remove('hidden');
            
            // Hide completion message
            completionMessageElement.style.display = 'none';
            
            // Show timer
            const timerElements = countdownContainer.querySelector('.countdown-timer');
            if (timerElements) timerElements.style.display = 'flex';
            
            // Show and update date display
            if (dateDisplayElement) {
                dateDisplayElement.style.display = 'block';
                dateDisplayElement.textContent = formatEventDate(eventData.date);
            }
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the countdown elements
        countdownDays.textContent = days.toString().padStart(2, '0');
        countdownHours.textContent = hours.toString().padStart(2, '0');
        countdownMinutes.textContent = minutes.toString().padStart(2, '0');
        countdownSeconds.textContent = seconds.toString().padStart(2, '0');
        
        // Update event title
        if (eventTitle && eventData.title) {
            eventTitle.textContent = eventData.title;
        }
        
        // Update timer label
        if (timerLabelElement && eventData.label) {
            timerLabelElement.textContent = eventData.label;
        }
    }
    
    // If Firebase is available, listen for event updates
    if (eventRef) {
        eventRef.on('value', function(snapshot) {
            const data = snapshot.val();
            dataLoaded = true; // Mark data as loaded even if data is null
            
            if (data) {
                console.log("Countdown data received:", data); // Debug log
                eventData = {
                    date: data.date || defaultDate.getTime(),
                    title: data.title || 'Special Stream!',
                    label: data.label || 'Next Stream',
                    completionMessage: data.completionMessage || 'Event has started! Use promo code: DAZEY25',
                    completionTitle: data.completionTitle,
                    showCompletionMessage: data.showCompletionMessage !== undefined ? data.showCompletionMessage : true,
                    enabled: data.enabled !== undefined ? data.enabled : false // Default to false if not specified
                };
                updateCountdown();
            } else {
                // No data in Firebase, ensure countdown is hidden
                eventData.enabled = false;
                if (countdownContainer) {
                    countdownContainer.classList.add('hidden');
                    countdownContainer.style.display = 'none';
                    countdownContainer.style.visibility = 'hidden';
                    countdownContainer.style.opacity = '0';
                    countdownContainer.style.margin = '0';
                    countdownContainer.style.padding = '0';
                    countdownContainer.style.height = '0';
                    countdownContainer.style.overflow = 'hidden';
                    countdownContainer.style.position = 'absolute';
                    countdownContainer.style.pointerEvents = 'none';
                    countdownContainer.style.zIndex = '-1';
                    countdownContainer.style.transform = 'scale(0)';
                }
            }
        });
        
        // Add a timeout to handle Firebase connection issues
        setTimeout(function() {
            if (!dataLoaded && countdownContainer) {
                console.warn("Firebase data for countdown didn't load within timeout");
                dataLoaded = true; // Mark as loaded to prevent flashing later
                eventData.enabled = false; // Ensure it's disabled
                countdownContainer.classList.add('hidden');
                countdownContainer.style.display = 'none';
                countdownContainer.style.visibility = 'hidden';
                countdownContainer.style.opacity = '0';
                countdownContainer.style.margin = '0';
                countdownContainer.style.padding = '0';
                countdownContainer.style.height = '0';
                countdownContainer.style.overflow = 'hidden';
                countdownContainer.style.position = 'absolute';
                countdownContainer.style.pointerEvents = 'none';
                countdownContainer.style.zIndex = '-1';
                countdownContainer.style.transform = 'scale(0)';
            }
        }, 3000); // 3 second timeout
    } else {
        // No Firebase, ensure countdown is hidden
        dataLoaded = true; // Mark as loaded to prevent issues
        eventData.enabled = false;
        if (countdownContainer) {
            countdownContainer.classList.add('hidden');
            countdownContainer.style.display = 'none';
            countdownContainer.style.visibility = 'hidden';
            countdownContainer.style.opacity = '0';
            countdownContainer.style.margin = '0';
            countdownContainer.style.padding = '0';
            countdownContainer.style.height = '0';
            countdownContainer.style.overflow = 'hidden';
            countdownContainer.style.position = 'absolute';
            countdownContainer.style.pointerEvents = 'none';
            countdownContainer.style.zIndex = '-1';
            countdownContainer.style.transform = 'scale(0)';
        }
    }
    
    // Update countdown every second but only if it's enabled and data is loaded
    setInterval(function() {
        if (dataLoaded && eventData && eventData.enabled) {
            updateCountdown();
        }
    }, 1000);
    
    // Initial update only if enabled in default config and data is loaded
    if (dataLoaded && eventData.enabled) {
        updateCountdown();
    }
}); 
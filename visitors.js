// Real Visitor Counter using CountAPI with Admin Controls
document.addEventListener('DOMContentLoaded', () => {
    console.log("Visitor tracking script loaded");
    
    // Add Firebase SDK
    loadFirebaseSDK().then(() => {
        console.log("Firebase SDK loaded successfully");
        initializeVisitorTracking();
    }).catch(error => {
        console.error("Error loading Firebase SDK:", error);
        // Continue with visitor counter even if Firebase fails
        initVisitorCountOnly();
    });
    
    // Add this variable at the top of the script, after the first few lines
    let lastValidVisitorCount = 0;
    
    // Function to dynamically load Firebase SDK
    function loadFirebaseSDK() {
        console.log("Attempting to load Firebase SDK");
        return new Promise((resolve, reject) => {
            if (window.firebase) {
                console.log("Firebase already loaded");
                resolve();
                return;
            }
            
            // Load Firebase App (core) script
            const firebaseApp = document.createElement('script');
            firebaseApp.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
            firebaseApp.onload = () => {
                console.log("Firebase core loaded");
                // Load Firebase Database script after core loads
                const firebaseDB = document.createElement('script');
                firebaseDB.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
                firebaseDB.onload = () => {
                    console.log("Firebase database loaded");
                    // Load config file
                    const configScript = document.createElement('script');
                    configScript.src = 'config.js';
                    configScript.onload = () => {
                        console.log("Config loaded");
                        try {
                            firebase.initializeApp(firebaseConfig);
                            console.log("Firebase initialized successfully");
                            resolve();
                        } catch (err) {
                            console.error("Firebase initialization error:", err);
                            reject(err);
                        }
                    };
                    configScript.onerror = (err) => {
                        console.error("Failed to load config:", err);
                        reject(err);
                    };
                    document.head.appendChild(configScript);
                };
                firebaseDB.onerror = (err) => {
                    console.error("Failed to load Firebase database:", err);
                    reject(err);
                };
                document.head.appendChild(firebaseDB);
            };
            firebaseApp.onerror = (err) => {
                console.error("Failed to load Firebase core:", err);
                reject(err);
            };
            document.head.appendChild(firebaseApp);
        });
    }
    
    // Function to check if the preloader exists and create it if not
    function ensurePreloaderExists() {
        console.log("Checking if preloader exists");
        let preloader = document.getElementById('hard-preloader');
        
        if (!preloader) {
            console.log("Preloader not found, creating it");
            preloader = document.createElement('div');
            preloader.id = 'hard-preloader';
            preloader.style.position = 'fixed';
            preloader.style.top = '0';
            preloader.style.left = '0';
            preloader.style.width = '100%';
            preloader.style.height = '100%';
            preloader.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)';
            preloader.style.zIndex = '99999';
            preloader.style.display = 'flex';
            preloader.style.justifyContent = 'center';
            preloader.style.alignItems = 'center';
            preloader.style.transition = 'opacity 0.5s';
            preloader.style.opacity = '0'; // Start hidden
            
            const preloaderContent = document.createElement('div');
            preloaderContent.className = 'preloader-content';
            preloaderContent.style.textAlign = 'center';
            
            const preloaderImage = document.createElement('img');
            preloaderImage.src = 'dazey.webp';
            preloaderImage.alt = 'Dazey Do';
            preloaderImage.className = 'preloader-image';
            preloaderImage.style.width = '120px';
            preloaderImage.style.height = '120px';
            preloaderImage.style.borderRadius = '50%';
            preloaderImage.style.marginBottom = '15px';
            preloaderImage.style.border = '3px solid transparent';
            preloaderImage.style.background = 'linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%)';
            preloaderImage.style.backgroundOrigin = 'border-box';
            preloaderImage.style.backgroundClip = 'content-box, border-box';
            
            const preloaderText = document.createElement('div');
            preloaderText.className = 'preloader-text';
            preloaderText.innerHTML = 'Loading...';
            preloaderText.style.background = 'linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%)';
            preloaderText.style.webkitBackgroundClip = 'text';
            preloaderText.style.backgroundClip = 'text';
            preloaderText.style.color = 'transparent';
            preloaderText.style.webkitTextFillColor = 'transparent';
            preloaderText.style.fontFamily = 'Arial, sans-serif';
            preloaderText.style.marginBottom = '15px';
            
            const preloaderSpinner = document.createElement('div');
            preloaderSpinner.className = 'preloader-spinner';
            preloaderSpinner.style.width = '40px';
            preloaderSpinner.style.height = '40px';
            preloaderSpinner.style.border = '3px solid rgba(255, 255, 255, 0.3)';
            preloaderSpinner.style.borderRadius = '50%';
            preloaderSpinner.style.borderTopColor = '#fff';
            preloaderSpinner.style.animation = 'spin 1s linear infinite';
            preloaderSpinner.style.margin = '0 auto';
            
            // Add the spinner keyframes if they don't exist
            if (!document.getElementById('spinner-animation')) {
                const style = document.createElement('style');
                style.id = 'spinner-animation';
                style.textContent = `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            preloaderContent.appendChild(preloaderImage);
            preloaderContent.appendChild(preloaderText);
            preloaderContent.appendChild(preloaderSpinner);
            preloader.appendChild(preloaderContent);
            
            document.body.appendChild(preloader);
            console.log("Preloader created and added to the body");
        } else {
            console.log("Preloader found:", preloader);
        }
        
        return preloader;
    }
    
    // Initialize visitor counter only (fallback if Firebase fails)
    function initVisitorCountOnly() {
        const visitorCountElement = document.getElementById('visitor-count');
        if (!visitorCountElement) return;
        
        visitorCountElement.innerHTML = '<span class="loading-dots"></span>';
        
        // Display a fallback message since we're not using CountAPI anymore
        visitorCountElement.textContent = 'Firebase connection failed';
    }
    
    // Add this at the beginning of the script, before any other code
    // Immediately hide content and show a blocking element to prevent content flashing
    (function() {
        // Create and append a blocker element right away
        const blocker = document.createElement('div');
        blocker.id = 'content-blocker';
        blocker.style.position = 'fixed';
        blocker.style.top = '0';
        blocker.style.left = '0';
        blocker.style.width = '100%';
        blocker.style.height = '100%';
        blocker.style.backgroundColor = '#000';
        blocker.style.zIndex = '999999'; // Ultra high z-index
        blocker.style.display = 'block';
        
        // Add this to the document as early as possible
        if (document.body) {
            document.body.appendChild(blocker);
            checkForceLoading();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(blocker);
                checkForceLoading();
            });
        }
        
        function checkForceLoading() {
            // Check localStorage for force loading state while Firebase loads
            const cachedState = localStorage.getItem('forceLoadingState');
            if (cachedState === 'true') {
                // Keep the blocker visible and prevent any content from showing
                console.log("Using cached force loading state: ENABLED - BLOCKING ACCESS");
                
                // Create an absolute overlay that can't be bypassed
                blocker.innerHTML = `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <img src="dazey.webp" alt="Dazey Do" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid transparent; background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); background-origin: border-box; background-clip: content-box, border-box; margin-bottom: 15px;">
                        <div style="background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; font-family: Arial, sans-serif; margin-bottom: 15px;">Site Access Restricted</div>
                        <div style="background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; font-family: Arial, sans-serif; margin-top: 20px;">This site is currently unavailable.</div>
                    </div>
                `;
                
                // Add spinner
                const spinnerStyle = document.createElement('style');
                spinnerStyle.textContent = `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .block-spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: #fff;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    }
                `;
                document.head.appendChild(spinnerStyle);
                
                const spinner = document.createElement('div');
                spinner.className = 'block-spinner';
                blocker.querySelector('div').appendChild(spinner);
                
                // Add a final protection - override some methods that might be used to hide the blocker
                const originalRemoveChild = Element.prototype.removeChild;
                Element.prototype.removeChild = function(child) {
                    if (child === blocker) {
                        console.warn("Attempt to remove blocker prevented");
                        return child;
                    }
                    return originalRemoveChild.call(this, child);
                };
                
                // Override visibility and display style setters for the blocker
                Object.defineProperty(blocker.style, 'display', {
                    set: function(value) {
                        if (localStorage.getItem('forceLoadingState') === 'true') {
                            console.warn("Attempt to hide blocker prevented");
                            this.setProperty('display', 'block');
                        } else {
                            this.setProperty('display', value);
                        }
                    },
                    get: function() {
                        return this.getPropertyValue('display');
                    }
                });
            } else {
                // Hide the blocker after a very short delay
                setTimeout(function() {
                    blocker.style.display = 'none';
                }, 50);
                console.log("Using cached force loading state: disabled");
            }
        }
    })();
    
    // Main initialization function with admin controls
    function initializeVisitorTracking() {
        console.log("Initializing visitor tracking and admin controls");
        
        // Get visitor count element
        const visitorCountElement = document.getElementById('visitor-count');
        
        // Create a unique visitor ID if one doesn't exist
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitorId', visitorId);
        }
        
        // Get database reference
        const database = firebase.database();
        
        // Hide all content immediately - this is a secondary check in case the immediate blocker fails
        const appContainer = document.querySelector('.app-container, .content-container, main, #content');
        if (appContainer) {
            appContainer.style.opacity = '0';
        }
        document.body.style.overflow = 'hidden';
        
        // Check force loading state immediately
        database.ref('siteControls/forceLoading').once('value')
            .then(snapshot => {
                const isForceLoading = snapshot.val() || false;
                
                // Store the state in localStorage for immediate access on reload
                localStorage.setItem('forceLoadingState', isForceLoading.toString());
                
                const blocker = document.getElementById('content-blocker');
                
                if (isForceLoading) {
                    console.log("Force loading is enabled, showing loading screen");
                    // Keep the blocker visible
                    if (blocker) blocker.style.display = 'block';
                    showLoadingScreen();
                } else {
                    // Only show content if force loading is not enabled
                    if (appContainer) {
                        appContainer.style.opacity = '1';
                    }
                    document.body.style.overflow = 'auto';
                    // Hide the blocker
                    if (blocker) blocker.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error checking force loading state:", error);
                // In case of error, show content to prevent site from being stuck
                if (appContainer) {
                    appContainer.style.opacity = '1';
                }
                document.body.style.overflow = 'auto';
                
                // Hide the blocker in case of error
                const blocker = document.getElementById('content-blocker');
                if (blocker) blocker.style.display = 'none';
            });
        
        // Update active visitor status with more detailed info
        if (visitorId) {
            // Create a database reference for this specific visitor
            const visitorRef = database.ref(`activeVisitors/${visitorId}`);
            
            // Handle connection state changes for accurate presence detection
            const connectedRef = database.ref('.info/connected');
            
            connectedRef.on('value', (snap) => {
                // When we lose or establish a connection
                const connected = snap.val();
                
                if (connected === false) {
                    console.log('Disconnected from Firebase');
                    return;
                }
                
                console.log('Connected to Firebase - setting up presence');
                
                // Initial visitor data
                const visitorData = {
                    lastActive: firebase.database.ServerValue.TIMESTAMP,
                    status: 'online',
                    joinedAt: firebase.database.ServerValue.TIMESTAMP,
                    page: window.location.pathname,
                    referrer: document.referrer || 'direct',
                    userAgent: navigator.userAgent,
                    screenSize: `${window.screen.width}x${window.screen.height}`,
                    language: navigator.language || navigator.userLanguage
                };
                
                // When this client disconnects, update the status to offline
                visitorRef.onDisconnect().update({
                    status: 'offline',
                    leftAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                // Set the initial online status
                visitorRef.set(visitorData);
                
                // Send regular "heartbeat" updates while the visitor is active
                const heartbeatInterval = setInterval(() => {
                    // Check if the user is interacting with the page
                    const isActive = document.visibilityState === 'visible';
                    
                    const updatedData = {
                        lastActive: firebase.database.ServerValue.TIMESTAMP,
                        status: isActive ? 'online' : 'idle',
                        page: window.location.pathname // Update in case of SPA navigation
                    };
                    
                    visitorRef.update(updatedData).catch(error => {
                        console.error("Error updating visitor heartbeat:", error);
                    });
                }, 30000); // Update every 30 seconds
                
                // Set up visibility change detection for more accurate status
                document.addEventListener('visibilitychange', () => {
                    const isVisible = document.visibilityState === 'visible';
                    console.log(`Page visibility changed to: ${document.visibilityState}`);
                    
                    visitorRef.update({
                        status: isVisible ? 'online' : 'idle',
                        lastActive: firebase.database.ServerValue.TIMESTAMP
                    }).catch(error => {
                        console.error("Error updating visitor visibility status:", error);
                    });
                });
                
                // Handle tab/window closing
                window.addEventListener('beforeunload', () => {
                    console.log('Page unloading - marking visitor as offline');
                    
                    // Clear the heartbeat interval
                    clearInterval(heartbeatInterval);
                    
                    // Use synchronous approach to ensure this completes before the page unloads
                    const offlineData = {
                        status: 'offline',
                        leftAt: firebase.database.ServerValue.TIMESTAMP
                    };
                    
                    // Use navigator.sendBeacon for more reliable data sending during page unload
                    if (navigator.sendBeacon) {
                        const blob = new Blob([JSON.stringify(offlineData)], { type: 'application/json' });
                        navigator.sendBeacon(`${firebaseConfig.databaseURL}/activeVisitors/${visitorId}.json`, blob);
                    } else {
                        // Fallback to synchronous XHR if sendBeacon isn't available
                        const xhr = new XMLHttpRequest();
                        xhr.open('PATCH', `${firebaseConfig.databaseURL}/activeVisitors/${visitorId}.json`, false); // false makes it synchronous
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(offlineData));
                    }
                    
                    // Cancel the disconnect operation since we're handling it manually
                    try {
                        visitorRef.onDisconnect().cancel();
                    } catch (e) {
                        console.error('Error canceling onDisconnect:', e);
                    }
                });
                
                // Check if this is a new session and update session counter
                const lastSessionTime = localStorage.getItem('lastSessionTime');
                const currentTime = Date.now();
                
                // Consider a new session if:
                // 1. No previous session time exists
                // 2. Last session was more than 30 minutes ago
                if (!lastSessionTime || (currentTime - parseInt(lastSessionTime)) > 30 * 60 * 1000) {
                    console.log("Recording new session in Firebase");
                    
                    // Increment the sessions counter in Firebase
                    database.ref('sessionsCount').transaction(currentCount => {
                        return (currentCount || 0) + 1;
                    })
                    .then(() => {
                        console.log("Session counter updated in Firebase");
                    })
                    .catch(error => {
                        console.error("Error updating session counter:", error);
                    });
                    
                    // Update last session time
                    localStorage.setItem('lastSessionTime', currentTime.toString());
                }
            });
        }
        
        // Set up real-time listeners for admin controls
        setupAdminControlListeners(database);
        
        // Initialize visitor counter if element exists
        if (visitorCountElement) {
            // Add loading animation
            visitorCountElement.innerHTML = '<span class="loading-dots"></span>';
            
            // Function to display the count with animation
            const displayCount = (count) => {
                // Format the number with commas
                visitorCountElement.textContent = count.toLocaleString();
                
                // Add a quick highlight animation to show updated count
                visitorCountElement.classList.add('count-updated');
                setTimeout(() => {
                    visitorCountElement.classList.remove('count-updated');
                }, 1500);
            };
            
            // Set up real-time listener for active visitors instead of using sessionsCount
            const setupLiveCounter = () => {
                console.log("Setting up live visitor counter");
                
                // Try to get cached count from localStorage
                try {
                    const cachedCount = localStorage.getItem('lastKnownVisitorCount');
                    if (cachedCount && !isNaN(parseInt(cachedCount))) {
                        lastValidVisitorCount = parseInt(cachedCount);
                        displayCount(lastValidVisitorCount);
                    }
                } catch (e) {
                    console.error("Error accessing localStorage:", e);
                }
                
                // Create a reference to active visitors that are currently online
                database.ref('activeVisitors').orderByChild('status').equalTo('online').on('value', snapshot => {
                    const activeVisitors = snapshot.val() || {};
                    const visitorCount = Object.keys(activeVisitors).length;
                    
                    // Only update if count is valid (greater than 0 or we have no previous valid count)
                    if (visitorCount > 0 || lastValidVisitorCount === 0) {
                        displayCount(visitorCount);
                        lastValidVisitorCount = visitorCount;
                        
                        // Store this count for future reference
                        try {
                            localStorage.setItem('lastKnownVisitorCount', visitorCount.toString());
                        } catch (e) {
                            console.error("Error saving to localStorage:", e);
                        }
                        
                        console.log(`Live visitor count updated: ${visitorCount} active visitors`);
                    } else {
                        // If we get a zero count but had a previous count, keep the previous count
                        console.log(`Got zero count, using last valid count: ${lastValidVisitorCount}`);
                        displayCount(lastValidVisitorCount);
                    }
                });
                
                // Add an error handler
                database.ref('activeVisitors').on('error', error => {
                    console.error("Error with visitor counter:", error);
                    
                    // Display the last known count from localStorage if available
                    const cachedCount = localStorage.getItem('lastKnownVisitorCount');
                    if (cachedCount && !isNaN(parseInt(cachedCount))) {
                        const count = parseInt(cachedCount);
                        displayCount(count);
                        console.log(`Using cached visitor count due to error: ${count}`);
                    }
                });
            };
            
            // Also show total visit count for reference
            database.ref('sessionsCount').once('value')
                .then(snapshot => {
                    const sessionsCount = snapshot.val() || 0;
                    // Store last seen count in localStorage as a fallback
                    localStorage.setItem('lastKnownVisitorCount', sessionsCount.toString());
                    
                    // Set up the live counter after getting the total
                    setupLiveCounter();
                })
                .catch(error => {
                    console.error('Error getting visitor count:', error);
                    
                    // Try to use the last known count as a fallback
                    const lastKnownCount = localStorage.getItem('lastKnownVisitorCount');
                    if (lastKnownCount) {
                        displayCount(parseInt(lastKnownCount, 10));
                    } else {
                        // If all else fails, show a fallback message
                        visitorCountElement.textContent = '—';
                    }
                    
                    // Try to set up the live counter anyway
                    setupLiveCounter();
                });
        }
    }
    
    // Set up listeners for admin controls that update in real-time
    function setupAdminControlListeners(database) {
        console.log("Setting up admin control listeners");
        
        // Listen for force loading changes
        database.ref('siteControls/forceLoading').on('value', snapshot => {
            console.log("Force loading update detected:", snapshot.val());
            const isForceLoading = snapshot.val() || false;
            
            // Update localStorage state
            localStorage.setItem('forceLoadingState', isForceLoading.toString());
            
            // Show/hide the content blocker
            const blocker = document.getElementById('content-blocker');
            if (blocker) {
                if (isForceLoading) {
                    blocker.style.display = 'block';
                    
                    // Force refresh the page to ensure the blocker takes effect immediately
                    if (!blocker.hasAttribute('data-reload-triggered')) {
                        blocker.setAttribute('data-reload-triggered', 'true');
                        // Small timeout to ensure the localStorage value is saved before reload
                        setTimeout(() => {
                            // Check if we already reloaded for this force loading session
                            const lastReloadTime = localStorage.getItem('forceLoadingLastReload');
                            const currentTime = Date.now();
                            
                            // Only reload if we haven't reloaded in the last 10 seconds
                            if (!lastReloadTime || (currentTime - parseInt(lastReloadTime)) > 10000) {
                                localStorage.setItem('forceLoadingLastReload', currentTime.toString());
                                window.location.reload();
                            } else {
                                console.log("Preventing rapid reloads - last reload was too recent");
                            }
                        }, 100);
                    }
                } else {
                    blocker.style.display = 'none';
                    // Clear reload flags when force loading is disabled
                    localStorage.removeItem('forceLoadingLastReload');
                    if (blocker.hasAttribute('data-reload-triggered')) {
                        blocker.removeAttribute('data-reload-triggered');
                    }
                }
            }
            
            handleForceLoading(isForceLoading, database);
        });
        
        // Listen for force reload command
        database.ref('siteControls/forceReload').on('value', snapshot => {
            const command = snapshot.val();
            if (command && command.triggered) {
                console.log("Force reload command received");
                // Clear the command immediately to prevent infinite reload
                database.ref('siteControls/forceReload').set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    triggered: false
                }).then(() => {
                    window.location.reload();
                });
            }
        });
        
        // Listen for force close command
        database.ref('siteControls/forceClose').on('value', snapshot => {
            const command = snapshot.val();
            if (command && command.triggered) {
                console.log("Force close command received");
                
                // Create a modal dialog asking user to close the tab
                const modal = document.createElement('div');
                modal.id = 'close-tab-modal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                modal.style.zIndex = '9999999'; // Ultra high z-index
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.flexDirection = 'column';
                modal.style.color = '#fff';
                modal.style.fontFamily = 'Arial, sans-serif';
                modal.style.textAlign = 'center';
                
                // Add message and close button
                const message = command.message || 'The site administrator has requested that you close this tab.';
                modal.innerHTML = `
                    <div style="background-color: #222; padding: 30px; border-radius: 10px; max-width: 500px; width: 80%;">
                        <img src="dazey.webp" alt="Dazey Do" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid transparent; background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); background-origin: border-box; background-clip: content-box, border-box; margin-bottom: 15px;">
                        <h2 style="background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; margin-bottom: 20px;">Please Close This Tab</h2>
                        <p style="margin-bottom: 25px; line-height: 1.5;">${message}</p>
                        <button id="close-tab-btn" style="background: linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%); color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Close Tab</button>
                    </div>
                `;
                
                // Add to document
                document.body.appendChild(modal);
                
                // Add click handler for close button
                document.getElementById('close-tab-btn').addEventListener('click', function() {
                    // Try to close the tab (will usually fail due to browser security)
                    try {
                        window.close();
                    } catch (e) {
                        console.log("Browser prevented tab from closing");
                    }
                    
                    // If tab didn't close, show a fallback message
                    setTimeout(() => {
                        const button = document.getElementById('close-tab-btn');
                        if (button) {
                            button.textContent = 'Please close tab manually';
                            button.style.background = 'linear-gradient(90deg, #ff3131, #ff5757)';
                        }
                    }, 1000);
                });
                
                // Prevent any interaction with page content
                document.body.style.overflow = 'hidden';
            } else {
                // If triggered is false, remove the modal if it exists
                const existingModal = document.getElementById('close-tab-modal');
                if (existingModal) {
                    existingModal.remove();
                    document.body.style.overflow = 'auto';
                    console.log("Close tab message dismissed");
                }
            }
        });
        
        // Listen for maintenance mode changes
        database.ref('siteControls/maintenanceMode').on('value', snapshot => {
            console.log("Maintenance mode update detected");
            const maintenanceSettings = snapshot.val() || { enabled: false };
            
            if (maintenanceSettings.enabled) {
                console.log("Maintenance mode is ON, showing banner with message:", maintenanceSettings.message);
                showMaintenanceBanner(maintenanceSettings.message || 'Site under maintenance. Please check back later.');
            } else {
                console.log("Maintenance mode is OFF, hiding banner");
                hideMaintenanceBanner();
            }
        });
        
        // Listen for appearance changes
        database.ref('siteAppearance').on('value', snapshot => {
            console.log("Appearance update detected");
            const appearance = snapshot.val();
            if (appearance) {
                applySiteAppearance(appearance);
            }
        });
        
        // Listen for real-time notifications
        listenForNotifications(database);
        
        // Check if paths exist and initialize if they don't
        initializeRequiredPaths(database);
    }
    
    // Listen for and display real-time notifications
    function listenForNotifications(database) {
        console.log("Setting up notification listener");
        
        // Reference to the last 5 notifications, ordered by timestamp
        const notificationsRef = database.ref('siteNotifications')
            .orderByChild('timestamp')
            .limitToLast(1);
        
        // Listen for new notifications
        notificationsRef.on('child_added', (snapshot) => {
            const notification = snapshot.val();
            const notificationId = snapshot.key;
            
            console.log("New notification received:", notification);
            
            // Only show notifications from the last 30 seconds
            const thirtySecondsAgo = Date.now() - (30 * 1000);
            if (notification.timestamp > thirtySecondsAgo) {
                showNotification(notification, notificationId);
            }
        });
    }
    
    // Display a notification to the user
    function showNotification(notification, notificationId) {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.bottom = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            notificationContainer.style.width = '300px';
            document.body.appendChild(notificationContainer);
        }
        
        // Create the notification element
        const notificationElement = document.createElement('div');
        notificationElement.className = `site-notification notification-${notification.type || 'info'}`;
        notificationElement.id = `notification-${notificationId}`;
        notificationElement.style.backgroundColor = getNotificationColor(notification.type);
        notificationElement.style.color = '#fff';
        notificationElement.style.borderRadius = '5px';
        notificationElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notificationElement.style.padding = '10px 15px';
        notificationElement.style.marginBottom = '10px';
        notificationElement.style.position = 'relative';
        notificationElement.style.animation = 'slideIn 0.5s forwards';
        
        // Add notification content
        notificationElement.innerHTML = `
            <div style="margin-right: 20px;">${notification.message}</div>
            <span style="position: absolute; top: 5px; right: 10px; cursor: pointer; font-weight: bold;" 
                  onclick="this.parentElement.remove();">&times;</span>
        `;
        
        // Add to container
        notificationContainer.appendChild(notificationElement);
        
        // Auto-remove after the specified duration
        const duration = notification.duration || 5;
        setTimeout(() => {
            const element = document.getElementById(`notification-${notificationId}`);
            if (element) {
                element.style.animation = 'slideOut 0.5s forwards';
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }, 500);
            }
        }, duration * 1000);
        
        // Add animation keyframes if they don't exist
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Get color based on notification type
    function getNotificationColor(type) {
        switch (type) {
            case 'success':
                return '#4caf50';
            case 'warning':
                return '#ff9800';
            case 'error':
                return '#f44336';
            case 'info':
            default:
                return '#2196f3';
        }
    }
    
    // Initialize all required database paths
    function initializeRequiredPaths(database) {
        console.log("Initializing required database paths");
        
        // Check siteControls path
        database.ref('siteControls').once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    console.log("Creating siteControls path");
                    return database.ref('siteControls').set({
                        forceLoading: false,
                        loadingDuration: 1500,
                        maintenanceMode: {
                            enabled: false,
                            message: 'Site under maintenance. Please check back later.'
                        }
                    });
                }
                
                // Make sure all required subpaths exist
                const controls = snapshot.val();
                let updates = {};
                
                if (!controls.hasOwnProperty('forceLoading')) {
                    updates['forceLoading'] = false;
                }
                
                if (!controls.hasOwnProperty('loadingDuration')) {
                    updates['loadingDuration'] = 1500;
                }
                
                if (!controls.hasOwnProperty('maintenanceMode')) {
                    updates['maintenanceMode'] = {
                        enabled: false,
                        message: 'Site under maintenance. Please check back later.'
                    };
                }
                
                if (Object.keys(updates).length > 0) {
                    return database.ref('siteControls').update(updates);
                }
            })
            .catch(error => {
                console.error("Error initializing siteControls path:", error);
            });
        
        // Check siteAppearance path
        database.ref('siteAppearance').once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    console.log("Creating siteAppearance path");
                    return database.ref('siteAppearance').set({
                        primaryColor: '#ff9ed8',
                        backgroundTheme: 'default'
                    });
                }
            })
            .catch(error => {
                console.error("Error initializing siteAppearance path:", error);
            });
            
        // Check sessionsCount path and initialize if it doesn't exist
        database.ref('sessionsCount').once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    console.log("Creating sessionsCount path");
                    // Initialize with 0 since we're not using CountAPI anymore
                    return database.ref('sessionsCount').set(0);
                }
            })
            .catch(error => {
                console.error("Error checking sessionsCount:", error);
            });
            
        // Clean up expired active visitors (inactive for more than 30 minutes)
        database.ref('activeVisitors').once('value')
            .then(snapshot => {
                const activeVisitors = snapshot.val() || {};
                const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
                let updates = {};
                
                Object.entries(activeVisitors).forEach(([visitorId, visitorData]) => {
                    // Remove visitors that are inactive or have explicitly left
                    if ((visitorData.lastActive && visitorData.lastActive < thirtyMinutesAgo) || 
                        (visitorData.status === 'offline')) {
                        updates[visitorId] = null; // Mark for deletion
                    }
                });
                
                if (Object.keys(updates).length > 0) {
                    console.log(`Cleaning up ${Object.keys(updates).length} inactive visitors`);
                    return database.ref('activeVisitors').update(updates);
                }
            })
            .catch(error => {
                console.error("Error cleaning up expired visitors:", error);
            });
            
        // Set up a cleanup task to run every 5 minutes
        setInterval(() => {
            console.log("Running scheduled visitor cleanup");
            database.ref('activeVisitors').once('value')
                .then(snapshot => {
                    const activeVisitors = snapshot.val() || {};
                    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000); // 6 hours
                    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000); // 30 minutes
                    let updates = {};
                    
                    Object.entries(activeVisitors).forEach(([visitorId, visitorData]) => {
                        // Completely remove very old offline visitors (6+ hours)
                        if (visitorData.status === 'offline' && visitorData.leftAt && visitorData.leftAt < sixHoursAgo) {
                            updates[visitorId] = null; // Mark for deletion
                        }
                        // Mark as offline any visitors that haven't sent a heartbeat in 30 minutes
                        else if (visitorData.status === 'online' && visitorData.lastActive && visitorData.lastActive < thirtyMinutesAgo) {
                            updates[visitorId] = {
                                status: 'offline',
                                leftAt: firebase.database.ServerValue.TIMESTAMP,
                                autoDisconnected: true
                            };
                        }
                    });
                    
                    if (Object.keys(updates).length > 0) {
                        console.log(`Scheduled cleanup: processing ${Object.keys(updates).length} visitors`);
                        return database.ref('activeVisitors').update(updates);
                    }
                })
                .catch(error => {
                    console.error("Error in scheduled visitor cleanup:", error);
                });
        }, 5 * 60 * 1000); // Run every 5 minutes
    }
    
    // Reset all settings to default in case of critical errors
    function resetToDefaultSettings(database) {
        console.log("RESETTING ALL SETTINGS TO DEFAULT");
        
        try {
            // Reset site controls
            database.ref('siteControls').set({
                forceLoading: false,
                loadingDuration: 1500,
                maintenanceMode: {
                    enabled: false,
                    message: 'Site under maintenance. Please check back later.'
                }
            }).catch(error => {
                console.error("Error resetting siteControls:", error);
            });
            
            // Reset site appearance
            database.ref('siteAppearance').set({
                primaryColor: '#ff9ed8',
                backgroundTheme: 'default'
            }).catch(error => {
                console.error("Error resetting siteAppearance:", error);
            });
            
            // Don't reset site content as it might contain important user data
            
            // Reset any UI elements that might be stuck
            const preloader = document.getElementById('hard-preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                preloader.style.display = 'none';
            }
            
            document.body.style.overflow = 'auto';
            
            // Remove maintenance banner if present
            const banner = document.getElementById('maintenance-banner');
            if (banner) {
                banner.style.display = 'none';
                document.body.style.paddingTop = '0';
            }
            
            // Show site content
            const appContainer = document.querySelector('.app-container, .content-container, main, #content');
            if (appContainer) {
                appContainer.style.opacity = '1';
            }
            
            // Reset body styling
            document.body.style.backgroundColor = '';
            document.body.style.background = '';
            document.body.classList.remove('dark-theme', 'gradient-theme', 'minimalist-theme');
            
            console.log("Reset to default settings completed");
            
            // Show a notification to the user
            const notification = {
                message: "Settings have been reset due to an error. Please try again.",
                type: "warning",
                duration: 5
            };
            showNotification(notification, "system-reset");
            
            return true;
        } catch (error) {
            console.error("Error during reset to defaults:", error);
            return false;
        }
    }
    
    // Add global error handler to detect and fix critical issues
    window.addEventListener('error', function(event) {
        console.error("Global error caught:", event.error);
        
        // Check if error is related to our admin features
        const errorString = event.error?.toString() || '';
        if (errorString.includes('firebase') || 
            errorString.includes('preloader') || 
            errorString.includes('maintenance') ||
            errorString.includes('appearance')) {
            
            console.log("Error appears to be related to admin features, attempting reset");
            
            // Get database reference
            if (window.firebase && firebase.database) {
                resetToDefaultSettings(firebase.database());
            }
        }
    });
    
    // Handle force loading status changes
    function handleForceLoading(isForceLoading, database) {
        console.log("handleForceLoading called with:", isForceLoading);
        
        try {
            // Use a static variable to track interval
            if (typeof handleForceLoading.interval === 'undefined') {
                handleForceLoading.interval = null;
            }
            
            if (isForceLoading) {
                // If force loading is enabled, keep the preloader visible
                console.log("Force loading is enabled");
                const preloader = ensurePreloaderExists();
                const appContainer = document.querySelector('.app-container, .content-container, main, #content');
                
                if (preloader) {
                    // Make the preloader visible
                    preloader.style.display = 'flex';
                    preloader.style.opacity = '1';
                    preloader.style.visibility = 'visible';
                    document.body.style.overflow = 'hidden';
                    
                    // Hide all content
                    if (appContainer) {
                        appContainer.style.opacity = '0';
                    }
                    
                    // Add a message to the preloader if it doesn't have one
                    let adminMessage = preloader.querySelector('.admin-message');
                    if (!adminMessage) {
                        adminMessage = document.createElement('div');
                        adminMessage.className = 'admin-message';
                        adminMessage.innerHTML = 'Site temporarily unavailable. Please wait...';
                        adminMessage.style.color = '#ff9ed8';
                        adminMessage.style.marginTop = '20px';
                        adminMessage.style.fontFamily = 'Arial, sans-serif';
                        adminMessage.style.textAlign = 'center';
                        const preloaderContent = preloader.querySelector('.preloader-content');
                        if (preloaderContent) {
                            preloaderContent.appendChild(adminMessage);
                        }
                    }
                    
                    // Continue checking for updates
                    if (handleForceLoading.interval) {
                        clearInterval(handleForceLoading.interval);
                    }
                    
                    console.log("Setting up interval to check for force loading updates");
                    handleForceLoading.interval = setInterval(() => {
                        database.ref('siteControls/forceLoading').once('value')
                            .then(snapshot => {
                                if (!(snapshot.val() || false)) {
                                    clearInterval(handleForceLoading.interval);
                                    handleForceLoading.interval = null;
                                    handleForceLoading(false, database);
                                }
                            })
                            .catch(error => {
                                console.error("Error checking force loading status:", error);
                            });
                    }, 5000);
                }
            } else {
                // If force loading is disabled, allow normal behavior
                console.log("Force loading is disabled");
                if (handleForceLoading.interval) {
                    clearInterval(handleForceLoading.interval);
                    handleForceLoading.interval = null;
                }
                
                // Check if we should hide the preloader (if it's still visible)
                const preloader = document.getElementById('hard-preloader');
                if (preloader && (preloader.style.opacity === '1' || preloader.style.visibility === 'visible')) {
                    // Get the loading duration preference
                    database.ref('siteControls/loadingDuration').once('value')
                        .then(snapshot => {
                            const duration = snapshot.val() || 1500;
                            console.log(`Using loading duration: ${duration}ms`);
                            
                            // Hide the preloader after the specified duration
                            setTimeout(() => {
                                preloader.style.opacity = '0';
                                preloader.style.visibility = 'hidden';
                                document.body.style.overflow = 'auto';
                                
                                // Show content
                                const appContainer = document.querySelector('.app-container, .content-container, main, #content');
                                if (appContainer) {
                                    appContainer.style.opacity = '1';
                                }
                                
                                // Remove preloader after transition
                                setTimeout(() => {
                                    preloader.style.display = 'none';
                                }, 500);
                            }, duration);
                        })
                        .catch(error => {
                            console.error("Error getting loading duration:", error);
                            // Fallback in case of error
                            preloader.style.opacity = '0';
                            preloader.style.visibility = 'hidden';
                            document.body.style.overflow = 'auto';
                        });
                }
            }
        } catch (error) {
            console.error("Error in handleForceLoading:", error);
        }
    }
    
    // Create and show maintenance banner
    function showMaintenanceBanner(message) {
        console.log("Showing maintenance banner with message:", message);
        let banner = document.getElementById('maintenance-banner');
        
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'maintenance-banner';
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.padding = '10px';
            banner.style.background = 'linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%)';
            banner.style.color = 'white';
            banner.style.textAlign = 'center';
            banner.style.zIndex = '9998';
            banner.style.fontFamily = 'Arial, sans-serif';
            banner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            document.body.prepend(banner);
            console.log("Created new maintenance banner");
        }
        
        banner.textContent = message;
        banner.style.display = 'block';
        
        // Adjust body padding to prevent content from being hidden behind banner
        const bannerHeight = banner.offsetHeight;
        console.log("Banner height:", bannerHeight);
        document.body.style.paddingTop = bannerHeight + 'px';
        
        // Add a close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.right = '10px';
        closeButton.style.top = '50%';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';
        closeButton.style.fontWeight = 'bold';
        closeButton.onclick = function() {
            // Only hide for this session
            banner.style.display = 'none';
            document.body.style.paddingTop = '0';
            console.log("User closed maintenance banner");
        };
        banner.style.position = 'relative';
        banner.appendChild(closeButton);
    }
    
    // Hide maintenance banner
    function hideMaintenanceBanner() {
        const banner = document.getElementById('maintenance-banner');
        
        if (banner) {
            console.log("Hiding maintenance banner");
            banner.style.display = 'none';
            document.body.style.paddingTop = '0';
        } else {
            console.log("No maintenance banner found to hide");
        }
    }
    
    // Apply site appearance settings
    function applySiteAppearance(appearance) {
        console.log("Applying site appearance:", appearance);
        
        try {
            // Inject CSS variables if they don't exist
            let styleElement = document.getElementById('site-variables');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'site-variables';
                document.head.appendChild(styleElement);
            }
            
            // Apply primary color as CSS variable
            if (appearance.primaryColor) {
                styleElement.textContent = `
                    :root {
                        --primary-color: ${appearance.primaryColor};
                        --highlight-color: ${appearance.primaryColor};
                        --accent-color: ${appearance.primaryColor};
                        --theme-color: ${appearance.primaryColor};
                        --brand-color: ${appearance.primaryColor};
                    }
                `;
                
                console.log("Applied primary color:", appearance.primaryColor);
                
                // Apply color to elements with specific data attributes
                const elements = document.querySelectorAll('[data-dynamic-color="primary"]');
                elements.forEach(el => {
                    el.style.color = appearance.primaryColor;
                });
                
                const bgElements = document.querySelectorAll('[data-dynamic-bg="primary"]');
                bgElements.forEach(el => {
                    el.style.backgroundColor = appearance.primaryColor;
                });
                
                // Target common site elements for color - make this more specific to avoid conflicts
                const commonColorElements = document.querySelectorAll('h1.title, h2.heading, h3.subtitle, .highlight, .accent, button.primary, .btn.primary');
                commonColorElements.forEach(el => {
                    if (!el.hasAttribute('data-preserve-color')) {
                        el.style.color = appearance.primaryColor;
                    }
                });
                
                // Target buttons and links for background - make this more specific
                const buttonElements = document.querySelectorAll('button.primary, .btn.primary, .cta-button');
                buttonElements.forEach(el => {
                    if (!el.hasAttribute('data-preserve-bg')) {
                        el.style.backgroundColor = appearance.primaryColor;
                        el.style.borderColor = appearance.primaryColor;
                    }
                });
                
                // Add a class to the body to indicate that custom appearance is applied
                document.body.classList.add('custom-appearance');
            }
            
            // Apply background theme
            if (appearance.backgroundTheme) {
                const body = document.body;
                
                // First remove any existing theme classes
                body.classList.remove('dark-theme', 'gradient-theme', 'minimalist-theme', 'default-theme');
                
                switch(appearance.backgroundTheme) {
                    case 'dark':
                        body.classList.add('dark-theme');
                        body.style.backgroundColor = '#0a0a0a';
                        body.style.color = '#ffffff';
                        console.log("Applied dark theme");
                        break;
                    case 'gradient':
                        body.classList.add('gradient-theme');
                        body.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)';
                        body.style.color = '#ffffff';
                        console.log("Applied gradient theme");
                        break;
                    case 'minimalist':
                        body.classList.add('minimalist-theme');
                        body.style.backgroundColor = '#ffffff';
                        body.style.color = '#333333';
                        console.log("Applied minimalist theme");
                        break;
                    default:
                        body.classList.add('default-theme');
                        body.style.backgroundColor = '';
                        body.style.background = '';
                        body.style.color = '';
                        console.log("Applied default theme");
                        break;
                }
            }
        } catch (error) {
            console.error("Error applying site appearance:", error);
        }
    }
    
    // Add CSS for the loading animation and count update effect
    const style = document.createElement('style');
    style.textContent = `
        .loading-dots:after {
            content: '.';
            animation: dots 1.5s steps(5, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60% { content: '...'; }
            80%, 100% { content: ''; }
        }
        
        .count-updated {
            animation: highlight 1.5s ease;
        }
        
        @keyframes highlight {
            0% { color: inherit; }
            30% { color: #ff9ed8; }
            100% { color: inherit; }
        }
    `;
    document.head.appendChild(style);
    
    // Show loading screen
    function showLoadingScreen() {
        const preloader = ensurePreloaderExists();
        if (preloader) {
            preloader.style.display = 'flex';
            preloader.style.opacity = '1';
            preloader.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            
            // Only proceed with automatic hiding if force loading is NOT enabled
            try {
                const cachedForceLoading = localStorage.getItem('forceLoadingState');
                if (cachedForceLoading === 'true') {
                    console.log("Force loading is enabled, keeping loading screen visible");
                    // Update the message to indicate admin control
                    let adminMessage = preloader.querySelector('.admin-message');
                    if (!adminMessage) {
                        adminMessage = document.createElement('div');
                        adminMessage.className = 'admin-message';
                        adminMessage.innerHTML = 'Site access is currently restricted by administrator.';
                        adminMessage.style.background = 'linear-gradient(90deg, #5647ff 0%, #6389ff 35%, #5e33b6 67%, #4C2574 100%)';
                        adminMessage.style.webkitBackgroundClip = 'text';
                        adminMessage.style.backgroundClip = 'text';
                        adminMessage.style.color = 'transparent';
                        adminMessage.style.webkitTextFillColor = 'transparent';
                        adminMessage.style.marginTop = '20px';
                        adminMessage.style.fontFamily = 'Arial, sans-serif';
                        adminMessage.style.textAlign = 'center';
                        const preloaderContent = preloader.querySelector('.preloader-content');
                        if (preloaderContent) {
                            preloaderContent.appendChild(adminMessage);
                        }
                    }
                    return; // Exit early, don't hide the preloader
                }
                
                // Get the loading duration preference only if force loading is NOT enabled
                database.ref('siteControls/loadingDuration').once('value')
                    .then(snapshot => {
                        const duration = snapshot.val() || 1500;
                        console.log(`Using loading duration: ${duration}ms`);
                        
                        // Double-check force loading state from database
                        database.ref('siteControls/forceLoading').once('value')
                            .then(forceSnapshot => {
                                const isForceLoading = forceSnapshot.val() || false;
                                
                                // Update localStorage for consistency
                                localStorage.setItem('forceLoadingState', isForceLoading.toString());
                                
                                if (!isForceLoading) {
                                    // Only hide if force loading is still disabled
                                    setTimeout(() => {
                                        // Triple-check force loading before hiding
                                        const finalCheck = localStorage.getItem('forceLoadingState');
                                        if (finalCheck !== 'true') {
                                            preloader.style.opacity = '0';
                                            preloader.style.visibility = 'hidden';
                                            document.body.style.overflow = 'auto';
                                            
                                            // Show content
                                            const appContainer = document.querySelector('.app-container, .content-container, main, #content');
                                            if (appContainer) {
                                                appContainer.style.opacity = '1';
                                            }
                                            
                                            // Remove preloader after transition
                                            setTimeout(() => {
                                                preloader.style.display = 'none';
                                            }, 500);
                                            
                                            // Also hide the content blocker
                                            const blocker = document.getElementById('content-blocker');
                                            if (blocker) blocker.style.display = 'none';
                                        }
                                    }, duration);
                                }
                            });
                    })
                    .catch(error => {
                        console.error("Error getting loading duration:", error);
                        
                        // Final safety check - only proceed if force loading is NOT enabled
                        const finalCheck = localStorage.getItem('forceLoadingState');
                        if (finalCheck !== 'true') {
                            // Fallback in case of error
                            preloader.style.opacity = '0';
                            preloader.style.visibility = 'hidden';
                            document.body.style.overflow = 'auto';
                            
                            // Also hide the content blocker
                            const blocker = document.getElementById('content-blocker');
                            if (blocker) blocker.style.display = 'none';
                        }
                    });
            } catch (error) {
                console.error("Error in showLoadingScreen:", error);
                // Don't hide preloader on error - better to keep site inaccessible than expose content
            }
        }
    }
}); 
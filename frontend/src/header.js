// Header component
const Header = {
    render() {
        const headerHTML = `
            <!-- Skip link pour accessibilité -->
            <a href="#app" class="skip-link">Skip to main content</a>
            
            <!-- Header avec langue et accessibilité -->
            <header class="site-header fixed top-0 left-0 right-0 z-50">
                <div class="header-content flex justify-between items-center">
                    <div class="header-left">
                        <h1 class="site-logo text-2xl font-bold">FT_TRANSCENDENCE</h1>
                    </div>
                    
                    <div class="header-right flex gap-3 items-center">
                        <!-- Sélecteur de langue -->
                        <div class="language-selector relative">
                            <button id="langBtn" class="header-btn px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all" aria-label="Select language">
                                <span id="currentLang">🇬🇧 EN</span>
                            </button>
                            <div id="langMenu" class="dropdown-menu hidden absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl">
                                <button onclick="setLanguage('en')" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                    <span class="flag">🇬🇧</span> English
                                </button>
                                <button onclick="setLanguage('fr')" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                    <span class="flag">🇫🇷</span> Français
                                </button>
                                <button onclick="setLanguage('es')" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                    <span class="flag">🇪🇸</span> Español
                                </button>
                            </div>
                        </div>
                        
                        <!-- Bouton accessibilité -->
                        <button id="a11yBtn" class="header-btn px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-xl" aria-label="Accessibility options">
                            ♿
                        </button>
                        <div id="a11yMenu" class="dropdown-menu hidden absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl">
                            <button onclick="toggleHighContrast()" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                <span>🎨</span> <span data-i18n="nav.highContrast">High Contrast</span>
                            </button>
                            <button onclick="increaseFontSize()" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                <span>🔍+</span> <span data-i18n="nav.increaseFontSize">Increase Text Size</span>
                            </button>
                            <button onclick="decreaseFontSize()" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                <span>🔍-</span> <span data-i18n="nav.decreaseFontSize">Decrease Text Size</span>
                            </button>
                            <button onclick="resetFontSize()" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                <span>↺</span> <span data-i18n="nav.resetFontSize">Reset Text Size</span>
                            </button>
                        </div>
                        
                        <!-- Bouton authentification -->
                        <button id="authBtn" class="header-btn px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all" aria-label="Sign in">
                            <span>👤</span>
                            <span data-i18n="nav.signIn">Sign in</span>
                        </button>
                        <div id="authMenu" class="dropdown-menu hidden absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl min-w-[200px]">
                            <!-- Menu pour utilisateur NON connecté -->
                            <div id="authMenuLogin" class="hidden">
                                <div class="px-4 py-2 text-slate-400 text-sm border-b border-slate-700">
                                    Sign in with
                                </div>
                                <button id="googleLoginBtn" class="dropdown-item flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    <span>Google</span>
                                </button>
                                <button id="githubLoginBtn" class="dropdown-item flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span>GitHub</span>
                                </button>
                            </div>
                            
                            <!-- Menu pour utilisateur CONNECTÉ -->
                            <div id="authMenuUser" class="hidden">
                                <button onclick="Router.navigate('settings')" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                    <span>⚙️</span> <span>Settings</span>
                                </button>
                                <button id="logoutBtn" class="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors">
                                    <span>🚪</span> <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        // Injecter le header au début du body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        
        // Initialiser les événements
        this.initEvents();
        
        // Charger l'utilisateur connecté
        loadCurrentUser();
    },
    
    initEvents() {
        // Toggle language menu
        const langBtn = document.getElementById('langBtn');
        const langMenu = document.getElementById('langMenu');
        
        if (langBtn) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langMenu.classList.toggle('hidden');
                document.getElementById('a11yMenu')?.classList.add('hidden');
                document.getElementById('authMenu')?.classList.add('hidden');
            });
        }

        // Toggle accessibility menu
        const a11yBtn = document.getElementById('a11yBtn');
        const a11yMenu = document.getElementById('a11yMenu');

        if (a11yBtn) {
            a11yBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleAccessibilityMenu();
            });
        }

        // Auth button
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const authMenu = document.getElementById('authMenu');
                const authMenuLogin = document.getElementById('authMenuLogin');
                const authMenuUser = document.getElementById('authMenuUser');
                
                // Afficher le bon menu selon l'état de connexion
                if (window.currentUser) {
                    authMenuLogin.classList.add('hidden');
                    authMenuUser.classList.remove('hidden');
                } else {
                    authMenuUser.classList.add('hidden');
                    authMenuLogin.classList.remove('hidden');
                }
                
                authMenu.classList.toggle('hidden');
                document.getElementById('langMenu')?.classList.add('hidden');
                document.getElementById('a11yMenu')?.classList.add('hidden');
            });
        }

        // Google login button
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Show loading indicator
                const authMenu = document.getElementById('authMenu');
                authMenu.classList.add('hidden');

                // Open in popup instead of redirect
                const popup = window.open(
                    'https://localhost:8443/api/auth/login',
                    'Google Login',
                    'width=500,height=600,left=' + (screen.width + 100) + ',top=0'
                );
                // Optional: Check if popup was blocked
                if (!popup) {
                    alert('⚠️ Popup blocked! Please allow popups for this site.');
                }
            });
        }

        // GitHub login button
        const githubLoginBtn = document.getElementById('githubLoginBtn');
        if (githubLoginBtn) {
            githubLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Open in popup instead of redirect
                const popup = window.open(
                    'https://localhost:8443/api/auth/github/login',
                    'GitHub Login',
                    'width=500,height=600,left=' + (screen.width + 100) + ',top=0'
                );
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
            });
        }

        // Fermer les menus en cliquant ailleurs
        document.addEventListener('click', () => {
            langMenu?.classList.add('hidden');
            a11yMenu?.classList.add('hidden');
            document.getElementById('authMenu')?.classList.add('hidden');
        });

        // Mettre à jour le drapeau actuel
        this.updateCurrentLanguage();
    },
    
    updateCurrentLanguage() {
        const currentLang = document.getElementById('currentLang');
        if (currentLang) {
            const flags = {
                'en': '🇬🇧 EN',
                'fr': '🇫🇷 FR',
                'es': '🇪🇸 ES'
            };
            currentLang.textContent = flags[currentLanguage] || '🇬🇧 EN';
        }
    }
};

// ===== FONCTIONS D'ACCESSIBILITÉ =====
let fontSizeMultiplier = 1.0;

function toggleAccessibilityMenu() {
    const a11yMenu = document.getElementById('a11yMenu');
    const langMenu = document.getElementById('langMenu');
    const authMenu = document.getElementById('authMenu');
    
    if (a11yMenu) {
        a11yMenu.classList.toggle('hidden');
        langMenu?.classList.add('hidden');
        authMenu?.classList.add('hidden');
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
    document.getElementById('a11yMenu')?.classList.add('hidden');
}

function increaseFontSize() {
    if (fontSizeMultiplier < 1.5) {
        fontSizeMultiplier += 0.1;
        applyFontSize();
        localStorage.setItem('fontSizeMultiplier', fontSizeMultiplier);
    }
    document.getElementById('a11yMenu')?.classList.add('hidden');
}

function decreaseFontSize() {
    if (fontSizeMultiplier > 0.8) {
        fontSizeMultiplier -= 0.1;
        applyFontSize();
        localStorage.setItem('fontSizeMultiplier', fontSizeMultiplier);
    }
    document.getElementById('a11yMenu')?.classList.add('hidden');
}

function resetFontSize() {
    fontSizeMultiplier = 1.0;
    applyFontSize();
    localStorage.setItem('fontSizeMultiplier', fontSizeMultiplier);
    document.getElementById('a11yMenu')?.classList.add('hidden');
}

function applyFontSize() {
    document.documentElement.style.fontSize = (16 * fontSizeMultiplier) + 'px';
}

function loadAccessibilityPreferences() {
    const highContrast = localStorage.getItem('highContrast') === 'true';
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    const savedFontSize = localStorage.getItem('fontSizeMultiplier');
    if (savedFontSize) {
        fontSizeMultiplier = parseFloat(savedFontSize);
        applyFontSize();
    }
}

// ===== AUTHENTIFICATION JWT =====
window.currentUser = null;

async function loadCurrentUser() {
    try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
            window.currentUser = null;
            updateAuthButton();
            return;
        }
        
        const response = await fetch('https://localhost:8443/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.status === 401) {
            // Token expired, clear auth
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.currentUser = null;
            updateAuthButton();
            return;
        }
        
        const data = await response.json();
        
        if (data.authenticated && data.user) {
            window.currentUser = data.user;
        } else {
            window.currentUser = null;
        }
        
        updateAuthButton();
    } catch (error) {
        console.error('Error loading user:', error);
        window.currentUser = null;
        updateAuthButton();
    }
}

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    
    if (!authBtn) return;
    
    if (window.currentUser) {
        authBtn.innerHTML = `
            <img src="${window.currentUser.avatar_url}" alt="" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
            <span>${window.currentUser.username}</span>
        `;
        authBtn.style.display = 'flex';
        authBtn.style.alignItems = 'center';
    } else {
        authBtn.innerHTML = `
            <span>👤</span>
            <span data-i18n="nav.signIn">${t('nav.signIn')}</span>
        `;
        authBtn.style.display = '';
        authBtn.style.alignItems = '';
    }
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.currentUser = null;
    updateAuthButton();
    
    if (window.Router) {
        window.Router.navigate('home');
    } else {
        window.location.href = '/';
    }
}

// Charger les préférences d'accessibilité
loadAccessibilityPreferences();

// Listen for OAuth success (postMessage from callback page)
window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'auth_success') {
        console.log('✅ OAuth success, storing tokens');
        localStorage.setItem('accessToken', event.data.tokens.accessToken);
        localStorage.setItem('refreshToken', event.data.tokens.refreshToken);
        window.currentUser = event.data.user;
        updateAuthButton();
        window.location.reload();
    } else if (event.data.type === 'auth_2fa_required') {
        console.log('⚠️ 2FA required');
        show2FALoginModal(event.data.tempToken);
    }
});

// ===== 2FA LOGIN MODAL =====
let tempTwoFactorToken = null;

function show2FALoginModal(tempToken) {
    tempTwoFactorToken = tempToken;
    document.getElementById('twoFactorLoginModal').classList.remove('hidden');
    document.getElementById('loginTwoFactorCode').value = '';
    document.getElementById('loginTwoFactorCode').focus();
}

function close2FALoginModal() {
    document.getElementById('twoFactorLoginModal').classList.add('hidden');
    tempTwoFactorToken = null;
}

async function verify2FALogin() {
    const code = document.getElementById('loginTwoFactorCode').value;
    
    if (code.length !== 6) {
        alert('Please enter a 6-digit code');
        return;
    }
    
    try {
        const response = await fetch('https://localhost:8443/api/auth/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tempToken: tempTwoFactorToken,
                code: code
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            window.currentUser = data.data.user;
            
            close2FALoginModal();
            updateAuthButton();
            
            if (data.data.usedBackupCode) {
                alert('⚠️ Backup code used! Please generate new backup codes in Settings.');
            }
            
            window.location.reload();
        } else {
            alert('❌ Invalid code. Please try again.');
        }
    } catch (error) {
        console.error('2FA error:', error);
        alert('❌ Error. Please try again.');
    }
}

async function verify2FABackupLogin() {
    const code = document.getElementById('loginBackupCode').value;
    
    if (!code || code.length === 0) {
        alert('Please enter a backup code');
        return;
    }
    
    try {
        const response = await fetch('https://localhost:8443/api/auth/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tempToken: tempTwoFactorToken,
                code: code
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            window.currentUser = data.data.user;
            
            close2FALoginModal();
            updateAuthButton();
            
            alert('⚠️ Backup code used!');
            
            window.location.reload();
        } else {
            alert('❌ Invalid backup code. Please try again.');
        }
    } catch (error) {
        console.error('Backup code error:', error);
        alert('❌ Error. Please try again.');
    }
}


function show2FACodeInput() {
    document.getElementById('2FACodeSection').classList.remove('hidden');
    document.getElementById('2FABackupCodeSection').classList.add('hidden');
    document.getElementById('loginTwoFactorCode').value = '';
    document.getElementById('loginTwoFactorCode').focus();
}

function show2FABackupCodeInput() {
    document.getElementById('2FACodeSection').classList.add('hidden');
    document.getElementById('2FABackupCodeSection').classList.remove('hidden');
    document.getElementById('loginBackupCode').value = '';
    document.getElementById('loginBackupCode').focus();
}

function use2FABackupCode() {
    show2FABackupCodeInput();
}

// Attach 2FA event listeners when DOM is ready
setTimeout(() => {
    const verify2FABtn = document.getElementById('verify2FALoginBtn');
    if (verify2FABtn) {
        verify2FABtn.addEventListener('click', verify2FALogin);
    }
    
    const codeInput = document.getElementById('loginTwoFactorCode');
    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verify2FALogin();
        });
    }

    const verify2FABackupCodeBtn = document.getElementById('verify2FABackupCodeBtn');
    if (verify2FABackupCodeBtn) {
        verify2FABackupCodeBtn.addEventListener('click', verify2FABackupLogin);
    }

    const backupCodeInput = document.getElementById('loginBackupCode');
    if (backupCodeInput) {
        backupCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verify2FABackupLogin();
        });
    }
}, 100);
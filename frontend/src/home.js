// Home View
const Home = {
    render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="view">
                <header>
                    <h1 data-i18n="home.title">${t('home.title')}</h1>
                    <p class="subtitle" data-i18n="home.subtitle">${t('home.subtitle')}</p>
                    <p class="tagline" data-i18n="home.tagline">${t('home.tagline')}</p>
                </header>

                <div class="cards-grid">
                    <!-- Game Card -->
                    <div class="card" onclick="Router.navigate('game')" tabindex="0" role="button" aria-label="${t('home.playGame.title')}" onkeypress="if(event.key==='Enter') Router.navigate('game')">
                        <span class="card-badge" data-i18n="home.playGame.badge">${t('home.playGame.badge')}</span>
                        <svg class="card-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" stroke="url(#gradient1)" stroke-width="3" fill="rgba(102, 126, 234, 0.1)"/>
                            <rect x="20" y="40" width="10" height="30" rx="2" fill="url(#gradient1)"/>
                            <rect x="70" y="40" width="10" height="30" rx="2" fill="url(#gradient1)"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div>
                            <h2 class="card-title" data-i18n="home.playGame.title">${t('home.playGame.title')}</h2>
                            <p class="card-description" data-i18n="home.playGame.description">${t('home.playGame.description')}</p>
                        </div>
                    </div>

                    <!-- Leaderboard Card -->
                    <div class="card" onclick="Router.navigate('leaderboard')" tabindex="0" role="button" aria-label="Leaderboard" onkeypress="if(event.key==='Enter') Router.navigate('leaderboard')">
                        <span class="card-badge" data-i18n="home.leaderboard.badge">LIVE</span>
                        <svg class="card-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 25 L30 15 L70 15 L70 25" stroke="url(#gradient2)" stroke-width="3" fill="none"/>
                            <path d="M35 25 L35 45 Q35 55 50 55 Q65 55 65 45 L65 25 Z" stroke="url(#gradient2)" stroke-width="3" fill="rgba(118, 75, 162, 0.1)"/>
                            <rect x="45" y="55" width="10" height="20" fill="url(#gradient2)"/>
                            <rect x="35" y="75" width="30" height="5" rx="2" fill="url(#gradient2)"/>
                            <circle cx="50" cy="38" r="6" fill="#ffd700"/>
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#764ba2;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#4facfe;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div>
                            <h2 class="card-title" data-i18n="home.leaderboard.title">${t('home.leaderboard.title')}</h2>
                            <p class="card-description" data-i18n="home.leaderboard.description">${t('home.leaderboard.description')}</p>
                        </div>
                    </div>

                    <!-- Tournament Card -->
                    <div class="card" onclick="Router.navigate('tournament')" tabindex="0" role="button" aria-label="Tournament" onkeypress="if(event.key==='Enter') Router.navigate('tournament')">
                        <span class="card-badge">NEW</span>
                        <svg class="card-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 30 H40 V70 H20" stroke="url(#gradient3)" stroke-width="3" fill="none"/>
                            <path d="M80 30 H60 V70 H80" stroke="url(#gradient3)" stroke-width="3" fill="none"/>
                            <line x1="40" y1="50" x2="60" y2="50" stroke="url(#gradient3)" stroke-width="3"/>
                            <circle cx="50" cy="50" r="5" fill="url(#gradient3)"/>
                            <defs>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div>
                            <h2 class="card-title">Tournament</h2>
                            <p class="card-description">4-Player Local Tournament</p>
                        </div>
                    </div>

                    <!-- Settings Card -->
                    <div class="card" onclick="Router.navigate('settings')" tabindex="0" role="button" aria-label="${t('home.settings.title')}" onkeypress="if(event.key==='Enter') Router.navigate('settings')">
                        <span class="card-badge">GDPR</span>
                        <svg class="card-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="20" stroke="url(#gradient4)" stroke-width="3" fill="rgba(76, 175, 80, 0.1)"/>
                            <circle cx="50" cy="50" r="10" fill="url(#gradient4)"/>
                            <rect x="48" y="20" width="4" height="15" rx="2" fill="url(#gradient4)"/>
                            <rect x="48" y="65" width="4" height="15" rx="2" fill="url(#gradient4)"/>
                            <rect x="20" y="48" width="15" height="4" rx="2" fill="url(#gradient4)"/>
                            <rect x="65" y="48" width="15" height="4" rx="2" fill="url(#gradient4)"/>
                            <defs>
                                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#8bc34a;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div>
                            <h2 class="card-title" data-i18n="home.settings.title">${t('home.settings.title')}</h2>
                            <p class="card-description" data-i18n="home.settings.description">${t('home.settings.description')}</p>
                        </div>
                    </div>
                </div>

                <footer>
                    <p data-i18n="home.footer">${t('home.footer')}</p>
                </footer>
            </div>
        `;
    }
};
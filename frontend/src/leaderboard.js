// leaderboard.js - Vue Leaderboard
const Leaderboard = {
    async render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="view">
                <button class="back-btn" onclick="Router.navigate('home')">← Back to Home</button>
                
                <div class="leaderboard-header">
                    <h2 class="leaderboard-title" data-i18n="leaderboardPage.title">🏆 Leaderboard</h2>
                    <p class="leaderboard-subtitle" data-i18n="leaderboardPage.subtitle">Top Players Rankings</p>
                </div>

                <div id="leaderboardContent" class="leaderboard-container">
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <p data-i18n="leaderboardPage.loading">Loading leaderboard...</p>
                    </div>
                </div>
            </div>
        `;

        // Appliquer les traductions
        updatePageTranslations();

        // Charger le leaderboard
        await this.loadLeaderboard();
    },

    async loadLeaderboard() {
        const container = document.getElementById('leaderboardContent');
        
        try {
            const response = await fetch('https://localhost:8443/api/leaderboard');
            const data = await response.json();

            if (!data.success || data.leaderboard.length === 0) {
                container.innerHTML = `
                    <div class="empty-leaderboard">
                        <div class="empty-icon">🎮</div>
                        <p data-i18n="leaderboardPage.noScores">No scores yet. Be the first to play!</p>
                        <button onclick="Router.navigate('game')" class="play-btn" data-i18n="leaderboardPage.playNow">Play Now</button>
                    </div>
                `;
                updatePageTranslations();
                return;
            }

            // Générer le tableau du leaderboard
            const leaderboardHTML = data.leaderboard.map((player, index) => {
                const position = index + 1;
                const medal = this.getMedal(position);
                const positionClass = position <= 3 ? 'top-three' : '';

                return `
                    <div class="leaderboard-row ${positionClass}" data-position="${position}">
                        <div class="position-cell ${positionClass}">
                            <span class="position-number">${medal ? medal : `#${position}`}</span>
                        </div>
                        <div class="player-cell">
                            <div class="player-name">${this.escapeHtml(player.player_name)}</div>
                            <div class="player-stats">
                                <span class="stat wins" title="Wins">
                                    <span class="stat-icon">✓</span>
                                    <span class="stat-value">${player.wins}</span>
                                </span>
                                <span class="stat losses" title="Losses">
                                    <span class="stat-icon">✗</span>
                                    <span class="stat-value">${player.losses}</span>
                                </span>
                                <span class="stat games" title="Total Games">
                                    <span class="stat-icon">🎮</span>
                                    <span class="stat-value">${player.total_games}</span>
                                </span>
                            </div>
                        </div>
                        <div class="winrate-cell ${this.getWinRateClass(player.win_rate)}">
                            <div class="winrate-value">${player.win_rate.toFixed(1)}%</div>
                            <div class="winrate-bar">
                                <div class="winrate-fill" style="width: ${player.win_rate}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="leaderboard-table">
                    <div class="leaderboard-header-row">
                        <div class="header-position" data-i18n="leaderboardPage.rank">Rank</div>
                        <div class="header-player" data-i18n="leaderboardPage.player">Player</div>
                        <div class="header-winrate" data-i18n="leaderboardPage.winRate">Win Rate</div>
                    </div>
                    ${leaderboardHTML}
                </div>
            `;

            // Appliquer les traductions après avoir généré le HTML
            updatePageTranslations();

        } catch (error) {
            console.error('Error loading leaderboard:', error);
            container.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">❌</div>
                    <p data-i18n="leaderboardPage.error">Failed to load leaderboard</p>
                    <button onclick="Leaderboard.loadLeaderboard()" class="retry-btn" data-i18n="leaderboardPage.retry">Retry</button>
                </div>
            `;
            updatePageTranslations();
        }
    },

    getMedal(position) {
        switch(position) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    },

    getWinRateClass(winRate) {
        if (winRate >= 70) return 'excellent';
        if (winRate >= 50) return 'good';
        if (winRate >= 30) return 'average';
        return 'low';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Fonction pour mettre à jour le leaderboard après une partie
async function updateLeaderboardScore(playerName, won) {
    try {
        const response = await fetch('https://localhost:8443/api/leaderboard/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                won: won
            })
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        return false;
    }
}
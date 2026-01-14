// Router - Gere la navigation entre les vues
const Router = {
    routes: {
        'home': Home,
        'game': Game,
        'tournament': Tournament,
        'leaderboard': Leaderboard,
        'settings': Settings
    },

    init() {
        // Generate starfield
        this.generateStarfield();

        // Handle initial route
        const hash = window.location.hash.slice(1) || 'home';
        this.navigate(hash);

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigate(hash, false);
        });
    },

    navigate(route, pushState = true) {
        const app = document.getElementById('app');
        
        if (this.routes[route]) {
            // Clear current content
            app.innerHTML = '';
            
            // Render new view
            this.routes[route].render();
            
            // Update URL if needed
            if (pushState) {
                window.location.hash = route;
            }
        }
    },

    generateStarfield() {
        const starsContainer = document.getElementById('stars');
        const numberOfStars = 150;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            starsContainer.appendChild(star);
        }
    }
};
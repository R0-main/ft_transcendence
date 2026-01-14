-- Table Leaderboard pour stocker les scores des joueurs
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL UNIQUE,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les requêtes
CREATE INDEX IF NOT EXISTS idx_wins ON leaderboard(wins DESC);
CREATE INDEX IF NOT EXISTS idx_win_rate ON leaderboard(win_rate DESC);

-- Fonction pour calculer automatiquement le win_rate
CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_games := NEW.wins + NEW.losses;
    IF NEW.total_games > 0 THEN
        NEW.win_rate := (NEW.wins::DECIMAL / NEW.total_games::DECIMAL) * 100;
    ELSE
        NEW.win_rate := 0;
    END IF;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement les stats
DROP TRIGGER IF EXISTS trigger_update_leaderboard_stats ON leaderboard;
CREATE TRIGGER trigger_update_leaderboard_stats
BEFORE INSERT OR UPDATE ON leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_stats();

-- Insérer quelques données de test
INSERT INTO leaderboard (player_name, wins, losses) VALUES
    ('Alice', 15, 5),
    ('Bob', 12, 8),
    ('Charlie', 10, 10),
    ('Diana', 8, 12),
    ('Eve', 5, 15)
ON CONFLICT (player_name) DO NOTHING;
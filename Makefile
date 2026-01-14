# Makefile pour ft_transcendence

NAME = ft_transcendence

all: build up

build:
	@echo "🔨 Building containers..."
	docker compose build

rebuild:
	@echo "🔨 Rebuilding containers without cache..."
	docker compose build --no-cache

up:
	@echo "🚀 Starting containers..."
	docker compose up -d --build
	@echo "✅ Services started!"
	@echo "🌐 Frontend: https://localhost:8443"
	@echo "🔧 Backend: https://localhost:8443/api/health"

down:
	@echo "🛑 Stopping containers..."
	docker compose down

logs:
	docker compose logs -f

clean:
	@echo "🧹 Cleaning containers and volumes..."
	docker compose down -v

fclean: clean
	@echo "🗑️  Removing images..."
	docker system prune -af --volumes

re: fclean all

status:
	@echo "📊 Container status:"
	docker compose ps

.PHONY: all build up down logs clean fclean re status

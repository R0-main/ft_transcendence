// Systeme de traduction i18n
const translations = {
  fr: {
    nav: {
        language: "Langue",
        accessibility: "Accessibilité",
        signIn: 'Se connecter',
        highContrast: "Contraste élevé",
        increaseFontSize: 'Agrandir le Texte',
        decreaseFontSize: 'Diminuer le Texte',
        resetFontSize: 'Réinitialiser la taille du Texte'
    },
    home: {
        title: "ft_transcendence",
        subtitle: "L'Expérience Pong Ultime",
        tagline: "• Joue & rivalise •",
        playGame: {
            badge: "JOUER MAINTENANT",
            title: "Jouer",
            description: "Défie tes amis !"
        },
        leaderboard: {
            badge: "BIENTÔT",
            title: "Classement",
            description: "Grimpe dans les rangs !"
        },
        profile: {
            badge: "BIENTÔT",
            title: "Profil",
            description: "Voir tes stats & accomplissements"
        },
        settings: {
            badge: "BIENTÔT",
            title: "Paramètres",
            description: "Gérer les préférences"
        },
        footer: "© 2025 ft_transcendence"
    },
    game: {
        title: " utilise ton téléphone comme une manette",
        selectPlayers: "Sélectionner le nombre de joueurs",
        players2: "2 JOUEURS",
        players3: "3 JOUEURS",
        players4: "4 JOUEURS",
        settings: {
            title: "Paramètres de Partie",
            paddleSize: "Taille de Raquette",
            paddleSizeHint: "Petites / Moyennes / Grandes raquettes",
            ballSpeed: "Vitesse de Balle",
            ballSpeedHint: "Très Lent / Lent / Normal / Rapide / Très Rapide",
            ballSpeedVals: ["Très Lent", "Lent", "Normal", "Rapide", "Très Rapide"],
            winScore: "Points pour Gagner",
            winScoreHint: "Premier à atteindre ce score",
            createGame: "Créer la Partie →"
        },
        lobby: {
            scanQR: "Scanne le QR code avec ton téléphone",
            player: "Joueur",
            waiting: "En attente...",
            connected: "Connecté",
            startGame: "DÉMARRER LA PARTIE"
        },
        pause: {
            title: "EN PAUSE",
            hint: "Appuie sur ESC pour reprendre",
            resume: "Reprendre",
            settings: "Paramètres",
            home: "Retour à l'Accueil",
            settingsTitle: "Paramètres de Partie",
            settingsHint: "Les changements s'appliqueront au prochain round",
            apply: "Appliquer",
            cancel: "Annuler",
            notification: "Les paramètres s'appliqueront au prochain round !"
        }
    },
    leaderboardPage: {
        title: "🏆 Classement",
        subtitle: "Classement des Meilleurs Joueurs",
        rank: "Rang",
        player: "Joueur",
        winRate: "Taux de Victoire",
        noScores: "Aucun score pour le moment. Sois le premier à jouer !",
        playNow: "Jouer Maintenant",
        loading: "Chargement du classement...",
        error: "Échec du chargement du classement",
        retry: "Réessayer"
    },
    settingsPage: {
        title: "⚙️ Parametres du Compte",
        subtitle: "Gerer vos donnees personnelles et confidentialite",
        backBtn: "← Retour à l'Accueil",
        downloadTitle: "Telecharger Mes Donnees",
        downloadDesc: "Obtenir une copie de toutes vos informations personnelles",
        downloadBtn: "Telecharger",
        downloadProgress: "Telechargement...",
        downloadSuccess: "✅ Donnees telechargees avec succes !",
        downloadError: "❌ Erreur lors du telechargement. Reessayez.",
        deleteTitle: "Supprimer le Compte",
        deleteDesc: "Supprimer definitivement votre compte et toutes les donnees",
        deleteBtn: "Supprimer",
        deleteConfirm: "⚠️ SUPPRIMER LE COMPTE\n\nEtes-vous sur ? Cela supprimera definitivement :\n\n• Votre profil et statistiques\n• Tout votre historique de jeu\n• Tout ce qui est associe à votre compte\n\nCette action est irreversible.",
        deleteSuccess: "✅ Compte supprime avec succes. Au revoir !",
        deleteError: "❌ Erreur lors de la suppression. Reessayez.",
        privacyTitle: "🔒 Votre Confidentialite",
        privacyItem1: "Vos donnees sont stockees en toute securite sur nos serveurs",
        privacyItem2: "Nous ne partageons jamais vos donnees avec des tiers",
        privacyItem3: "Vous pouvez telecharger ou supprimer vos donnees a tout moment",
        privacyItem4: "Conformite RGPD complete",
        // 2FA Section
        twoFactorTitle: "Authentification à Deux Facteurs (2FA)",
        twoFactorEnabled: "2FA Activée",
        twoFactorDisabled: "2FA Désactivée",
        enable2FA: "Activer 2FA",
        disable2FA: "Désactiver 2FA",
        setup2FATitle: "Configurer 2FA",
        setup2FAStep1: "1. Scannez ce QR code avec votre application d'authentification",
        setup2FAStep2: "2. Entrez le code de vérification à 6 chiffres",
        setup2FAApps: "Applications recommandées : Google Authenticator, Authy, Microsoft Authenticator",
        verificationCode: "Code de vérification",
        verifyAndEnable: "Vérifier et Activer",
        backupCodesTitle: "Codes de Secours",
        backupCodesDesc: "Sauvegardez ces codes dans un endroit sûr. Chaque code ne peut être utilisé qu'une fois.",
        backupCodesWarning: "⚠️ Ces codes ne seront affichés qu'une seule fois !",
        downloadBackupCodes: "Télécharger les Codes",
        copyBackupCodes: "Copier les Codes",
        closeModal: "Fermer",
        cancel: "Annuler",
        twoFactorSuccess: "✅ 2FA activée avec succès !",
        twoFactorDisableSuccess: "✅ 2FA désactivée avec succès",
        twoFactorError: "❌ Erreur lors de la configuration 2FA",
        invalidCode: "❌ Code invalide. Réessayez.",
        enterCodePrompt: "Entrez votre code 2FA pour désactiver",
        twoFactorRequired: "Code 2FA Requis",
        twoFactorLogin: "Entrez le code de votre application d'authentification",
        useBackupCode: "Utiliser un code de secours",
        backupCodeUsed: "Code de secours utilisé. Générez de nouveaux codes !",
        verify: "Vérifier"
      }
    },
  
  en: {
    nav: {
        language: "Language",
        accessibility: "Accessibility",
        signIn: 'Sign in',
        highContrast: "High Contrast",
        increaseFontSize: 'Increase Text',
        decreaseFontSize: 'Decrease Text',
        resetFontSize: 'Reset Text Size'
    },
    home: {
        title: "ft_transcendence",
        subtitle: "The Ultimate Pong Experience",
        tagline: "• Play & Compete •",
        playGame: {
            badge: "PLAY NOW",
            title: "Play Game",
            description: "Challenge your friends!"
        },
        leaderboard: {
            badge: "COMING SOON",
            title: "Leaderboard",
            description: "Climb the ranks!"
        },
        profile: {
            badge: "COMING SOON",
            title: "Profile",
            description: "View your stats & achievements"
        },
        settings: {
            badge: "COMING SOON",
            title: "Settings",
            description: "Manage preferences"
        },
        footer: "© 2025 ft_transcendence"
    },
    game: {
        title: " use your phones as controllers",
        selectPlayers: "Select number of players",
        players2: "2 PLAYERS",
        players3: "3 PLAYERS",
        players4: "4 PLAYERS",
        settings: {
            title: "Game Settings",
            paddleSize: "Paddle Size",
            paddleSizeHint: "Small / Medium / Large paddles",
            ballSpeed: "Ball Speed",
            ballSpeedHint: "Very Slow / Slow / Normal / Fast / Very Fast",
            ballSpeedVals: ["Very Slow", "Slow", "Normal", "Fast", "Very Fast"],
            winScore: "Points to Win",
            winScoreHint: "First to reach this score",
            createGame: "Create Game →"
        },
        lobby: {
            scanQR: "Scan the QR code with your phone",
            player: "Player",
            waiting: "Waiting...",
            connected: "Connected",
            startGame: "START GAME"
        },
        pause: {
            title: "PAUSED",
            hint: "Press ESC to resume",
            resume: "Continue",
            settings: "Settings",
            home: "Back to Home",
            settingsTitle: "Game Settings",
            settingsHint: "Changes will apply to the next round",
            apply: "Apply",
            cancel: "Cancel",
            notification: "Settings will apply next round!"
        }
    },
    leaderboardPage: {
        title: "🏆 Leaderboard",
        subtitle: "Top Players Rankings",
        rank: "Rank",
        player: "Player",
        winRate: "Win Rate",
        noScores: "No scores yet. Be the first to play!",
        playNow: "Play Now",
        loading: "Loading leaderboard...",
        error: "Failed to load leaderboard",
        retry: "Retry"
    },
    settingsPage: {
        title: "⚙️ Account Settings",
        subtitle: "Manage your personal data and privacy",
        backBtn: "← Back to Home",
        
        downloadTitle: "Download My Data",
        downloadDesc: "Get a copy of all your personal information",
        downloadBtn: "Download",
        downloadProgress: "Downloading...",
        downloadSuccess: "✅ Data downloaded successfully!",
        downloadError: "❌ Error downloading data. Please try again.",
        
        deleteTitle: "Delete Account",
        deleteDesc: "Permanently delete your account and all data",
        deleteBtn: "Delete",
        deleteConfirm: "⚠️ DELETE ACCOUNT\n\nAre you sure? This will permanently delete:\n\n• Your profile and stats\n• All your game history\n• Everything associated with your account\n\nThis action cannot be undone.",
        deleteSuccess: "✅ Account deleted successfully. Goodbye!",
        deleteError: "❌ Error deleting account. Please try again.",
        
        privacyTitle: "🔒 Your Privacy",
        privacyItem1: "Your data is stored securely on our servers",
        privacyItem2: "We never share your data with third parties",
        privacyItem3: "You can download or delete your data anytime",
        privacyItem4: "Full GDPR compliance",
        // 2FA Section
        twoFactorTitle: "Two-Factor Authentication (2FA)",
        twoFactorEnabled: "2FA Enabled",
        twoFactorDisabled: "2FA Disabled",
        enable2FA: "Enable 2FA",
        disable2FA: "Disable 2FA",
        setup2FATitle: "Setup 2FA",
        setup2FAStep1: "1. Scan this QR code with your authenticator app",
        setup2FAStep2: "2. Enter the 6-digit verification code",
        setup2FAApps: "Recommended apps: Google Authenticator, Authy, Microsoft Authenticator",
        verificationCode: "Verification Code",
        verifyAndEnable: "Verify and Enable",
        backupCodesTitle: "Backup Codes",
        backupCodesDesc: "Save these codes in a safe place. Each code can only be used once.",
        backupCodesWarning: "⚠️ These codes will only be shown once!",
        downloadBackupCodes: "Download Codes",
        copyBackupCodes: "Copy Codes",
        closeModal: "Close",
        cancel: "Cancel",
        twoFactorSuccess: "✅ 2FA enabled successfully!",
        twoFactorDisableSuccess: "✅ 2FA disabled successfully",
        twoFactorError: "❌ Error setting up 2FA",
        invalidCode: "❌ Invalid code. Please try again.",
        enterCodePrompt: "Enter your 2FA code to disable",
        twoFactorRequired: "2FA Code Required",
        twoFactorLogin: "Enter the code from your authenticator app",
        useBackupCode: "Use a backup code",
        backupCodeUsed: "Backup code used. Generate new codes!",
        verify: "Verify"
    }
},
  
  es: {
    nav: {
        language: "Idioma",
        accessibility: "Accesibilidad",
        signIn: 'Iniciar sesión',
        highContrast: "Alto Contraste",
        increaseFontSize: 'Aumentar el Texto',
        decreaseFontSize: 'Disminuir el Texto',
        resetFontSize: 'Restablecer el Texto'
    },
    home: {
        title: "ft_transcendence",
        subtitle: "La Experiencia Pong Definitiva",
        tagline: "• Jugar y Competir •",
        playGame: {
            badge: "JUGAR AHORA",
            title: "Jugar",
            description: "¡Desafía a tus amigos!"
        },
        leaderboard: {
            badge: "PRÓXIMAMENTE",
            title: "Clasificación",
            description: "¡Sube en el ranking!"
        },
        profile: {
            badge: "PRÓXIMAMENTE",
            title: "Perfil",
            description: "Ver tus estadísticas y logros"
        },
        settings: {
            badge: "PRÓXIMAMENTE",
            title: "Configuración",
            description: "Gestionar preferencias"
        },
        footer: "© 2025 ft_transcendence"
    },
    game: {
        title: " usa tus teléfonos como controles",
        selectPlayers: "Seleccionar número de jugadores",
        players2: "2 JUGADORES",
        players3: "3 JUGADORES",
        players4: "4 JUGADORES",
        settings: {
            title: "Configuración de Juego",
            paddleSize: "Tamaño de Paleta",
            paddleSizeHint: "Paletas pequeñas / medianas / grandes",
            ballSpeed: "Velocidad de Pelota",
            ballSpeedHint: "Muy Lenta / Lenta / Normal / Rápida / Muy Rápida",
            ballSpeedVals: ["Muy Lenta", "Lenta", "Normal", "Rápida", "Muy Rápida"],
            winScore: "Puntos para Ganar",
            winScoreHint: "Primero en alcanzar este puntaje",
            createGame: "Crear Juego →"
        },
        lobby: {
            scanQR: "Escanea el código QR con tu teléfono",
            player: "Jugador",
            waiting: "Esperando...",
            connected: "Conectado",
            startGame: "INICIAR JUEGO"
        },
        pause: {
            title: "EN PAUSA",
            hint: "Presiona ESC para reanudar",
            resume: "Reanudar Juego",
            settings: "Configuración",
            home: "Volver al Inicio",
            settingsTitle: "Configuración de Juego",
            settingsHint: "Los cambios se aplicarán en la siguiente ronda",
            apply: "Aplicar",
            cancel: "Cancelar",
            notification: "¡La configuración se aplicará en la siguiente ronda!"
        }
    },
    leaderboardPage: {
        title: "🏆 Clasificación",
        subtitle: "Ranking de Mejores Jugadores",
        rank: "Rango",
        player: "Jugador",
        winRate: "Tasa de Victoria",
        noScores: "¡Aún no hay puntajes. Sé el primero en jugar!",
        playNow: "Jugar Ahora",
        loading: "Cargando clasificación...",
        error: "Error al cargar la clasificación",
        retry: "Reintentar"
    },
    settingsPage: {
        title: "⚙️ Configuración de Cuenta",
        subtitle: "Gestionar tus datos personales y privacidad",
        backBtn: "← Volver al Inicio",

        downloadTitle: "Descargar Mis Datos",
        downloadDesc: "Obtener una copia de toda tu información personal",
        downloadBtn: "Descargar",
        downloadProgress: "Descargando...",
        downloadSuccess: "✅ ¡Datos descargados con éxito!",
        downloadError: "❌ Error al descargar datos. Inténtalo de nuevo.",

        deleteTitle: "Eliminar Cuenta",
        deleteDesc: "Eliminar permanentemente tu cuenta y todos los datos",
        deleteBtn: "Eliminar",
        deleteConfirm: "⚠️ ELIMINAR CUENTA\n\n¿Estás seguro? Esto eliminará permanentemente:\n\n• Tu perfil y estadísticas\n• Todo tu historial de juego\n• Todo lo asociado con tu cuenta\n\nEsta acción no se puede deshacer.",
        deleteSuccess: "✅ Cuenta eliminada con éxito. ¡Adiós!",
        deleteError: "❌ Error al eliminar cuenta. Inténtalo de nuevo.",

        privacyTitle: "🔒 Tu Privacidad",
        privacyItem1: "Tus datos se almacenan de forma segura en nuestros servidores",
        privacyItem2: "Nunca compartimos tus datos con terceros",
        privacyItem3: "Puedes descargar o eliminar tus datos en cualquier momento",
        privacyItem4: "Cumplimiento total del RGPD",
        // 2FA Section
        twoFactorTitle: "Autenticación de Dos Factores (2FA)",
        twoFactorEnabled: "2FA Activado",
        twoFactorDisabled: "2FA Desactivado",
        enable2FA: "Activar 2FA",
        disable2FA: "Desactivar 2FA",
        setup2FATitle: "Configurar 2FA",
        setup2FAStep1: "1. Escanea este código QR con tu aplicación de autenticación",
        setup2FAStep2: "2. Ingresa el código de verificación de 6 dígitos",
        setup2FAApps: "Aplicaciones recomendadas: Google Authenticator, Authy, Microsoft Authenticator",
        verificationCode: "Código de Verificación",
        verifyAndEnable: "Verificar y Activar",
        backupCodesTitle: "Códigos de Respaldo",
        backupCodesDesc: "Guarda estos códigos en un lugar seguro. Cada código solo se puede usar una vez.",
        backupCodesWarning: "⚠️ ¡Estos códigos solo se mostrarán una vez!",
        downloadBackupCodes: "Descargar Códigos",
        copyBackupCodes: "Copiar Códigos",
        closeModal: "Cerrar",
        cancel: "Cancelar",
        twoFactorSuccess: "✅ ¡2FA activado con éxito!",
        twoFactorDisableSuccess: "✅ 2FA desactivado con éxito",
        twoFactorError: "❌ Error al configurar 2FA",
        invalidCode: "❌ Código inválido. Inténtalo de nuevo.",
        enterCodePrompt: "Ingresa tu código 2FA para desactivar",
        twoFactorRequired: "Código 2FA Requerido",
        twoFactorLogin: "Ingresa el código de tu aplicación de autenticación",
        useBackupCode: "Usar un código de respaldo",
        backupCodeUsed: "Código de respaldo usado. ¡Genera nuevos códigos!",
        verify: "Verificar"
      }
    }
};

// Langue courante
let currentLanguage = localStorage.getItem('language') || 'en';

// Fonction pour obtenir une traduction
function t(key) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

// Changer de langue
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Si on est sur leaderboard, le re-render manuellement
    if (window.location.hash === '#leaderboard') {
      Leaderboard.render();
    } else {
      updatePageTranslations();
    }
  }
}

// Mettre à jour toutes les traductions de la page
function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // Mettre à jour le flag de langue dans le header
  const currentLangElement = document.getElementById('currentLang');
  if (currentLangElement) {
    const flags = { 
      en: '🇬🇧 EN', 
      fr: '🇫🇷 FR', 
      es: '🇪🇸 ES' 
    };
    currentLangElement.textContent = flags[currentLanguage] || '🇬🇧 EN';
  }
}
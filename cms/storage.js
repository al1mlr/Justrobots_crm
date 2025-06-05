// Fonctions de stockage des données pour le CMS
const STORAGE = {
    // Clés de stockage
    KEYS: {
        CONFIG: 'justrobots_cms_config',
        TRANSLATIONS: 'justrobots_cms_data',
        LANGUAGE: 'justrobots_language',
        AUTH: 'justrobots_cms_auth',
        BACKUPS: 'justrobots_cms_backups'
    },
    
    // Initialisation du stockage
    init: async function() {
        try {
            // Vérification de la configuration
            if (!localStorage.getItem(this.KEYS.CONFIG)) {
                // Chargement de la configuration par défaut
                const configResponse = await fetch('../data/config.json');
                const config = await configResponse.json();
                
                // Sauvegarde de la configuration
                localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(config));
            }
            
            // Vérification des traductions
            if (!localStorage.getItem(this.KEYS.TRANSLATIONS)) {
                // Chargement des traductions par défaut
                const translations = {};
                
                const config = JSON.parse(localStorage.getItem(this.KEYS.CONFIG));
                const languages = config.availableLanguages || ['fr', 'en'];
                
                // Chargement des fichiers de traduction
                for (const lang of languages) {
                    const response = await fetch(`../locales/${lang}.json`);
                    translations[lang] = await response.json();
                }
                
                // Sauvegarde des traductions
                localStorage.setItem(this.KEYS.TRANSLATIONS, JSON.stringify(translations));
            }
            
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du stockage:', error);
            return false;
        }
    },
    
    // Récupération de la configuration
    getConfig: function() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.CONFIG)) || {};
        } catch (error) {
            console.error('Erreur lors de la récupération de la configuration:', error);
            return {};
        }
    },
    
    // Mise à jour de la configuration
    updateConfig: function(config) {
        try {
            localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la configuration:', error);
            return false;
        }
    },
    
    // Récupération des traductions
    getTranslations: function() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.TRANSLATIONS)) || {};
        } catch (error) {
            console.error('Erreur lors de la récupération des traductions:', error);
            return {};
        }
    },
    
    // Mise à jour des traductions
    updateTranslations: function(translations) {
        try {
            localStorage.setItem(this.KEYS.TRANSLATIONS, JSON.stringify(translations));
            
            // Création d'une sauvegarde si activée
            const config = this.getConfig();
            if (config.settings && config.settings.backupEnabled) {
                this.createBackup(translations);
            }
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des traductions:', error);
            return false;
        }
    },
    
    // Récupération de la langue actuelle
    getCurrentLanguage: function() {
        return localStorage.getItem(this.KEYS.LANGUAGE) || 'fr';
    },
    
    // Mise à jour de la langue actuelle
    updateCurrentLanguage: function(language) {
        localStorage.setItem(this.KEYS.LANGUAGE, language);
        return true;
    },
    
    // Création d'une sauvegarde
    createBackup: function(data) {
        try {
            // Récupération des sauvegardes existantes
            const backups = JSON.parse(localStorage.getItem(this.KEYS.BACKUPS)) || [];
            
            // Création d'une nouvelle sauvegarde
            const backup = {
                id: Date.now(),
                date: new Date().toISOString(),
                data: data
            };
            
            // Ajout de la sauvegarde
            backups.unshift(backup);
            
            // Limitation du nombre de sauvegardes
            const config = this.getConfig();
            const maxBackups = config.settings && config.settings.maxBackups ? config.settings.maxBackups : 10;
            
            if (backups.length > maxBackups) {
                backups.splice(maxBackups);
            }
            
            // Sauvegarde des sauvegardes
            localStorage.setItem(this.KEYS.BACKUPS, JSON.stringify(backups));
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la création d\'une sauvegarde:', error);
            return false;
        }
    },
    
    // Récupération des sauvegardes
    getBackups: function() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.BACKUPS)) || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des sauvegardes:', error);
            return [];
        }
    },
    
    // Restauration d'une sauvegarde
    restoreBackup: function(backupId) {
        try {
            // Récupération des sauvegardes
            const backups = this.getBackups();
            
            // Recherche de la sauvegarde
            const backup = backups.find(b => b.id === backupId);
            
            if (!backup) {
                console.error('Sauvegarde non trouvée:', backupId);
                return false;
            }
            
            // Restauration des données
            this.updateTranslations(backup.data);
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la restauration d\'une sauvegarde:', error);
            return false;
        }
    },
    
    // Exportation des données
    exportData: function() {
        try {
            // Récupération des données
            const config = this.getConfig();
            const translations = this.getTranslations();
            
            // Création de l'objet d'exportation
            const exportData = {
                config: config,
                translations: translations,
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            // Conversion en JSON
            const json = JSON.stringify(exportData, null, 2);
            
            // Création du blob
            const blob = new Blob([json], { type: 'application/json' });
            
            // Création de l'URL
            const url = URL.createObjectURL(blob);
            
            // Création du lien de téléchargement
            const a = document.createElement('a');
            a.href = url;
            a.download = `justrobots_cms_export_${new Date().toISOString().slice(0, 10)}.json`;
            
            // Déclenchement du téléchargement
            a.click();
            
            // Libération de l'URL
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            return false;
        }
    },
    
    // Importation des données
    importData: function(jsonData) {
        try {
            // Parsing des données
            const importData = JSON.parse(jsonData);
            
            // Vérification de la structure
            if (!importData.translations || !importData.config) {
                console.error('Structure de données invalide');
                return false;
            }
            
            // Mise à jour de la configuration
            this.updateConfig(importData.config);
            
            // Mise à jour des traductions
            this.updateTranslations(importData.translations);
            
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation des données:', error);
            return false;
        }
    },
    
    // Vérification de l'authentification
    checkAuth: function() {
        try {
            const auth = JSON.parse(localStorage.getItem(this.KEYS.AUTH)) || {};
            return auth.isLoggedIn === true;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            return false;
        }
    },
    
    // Connexion
    login: function(username, password) {
        try {
            // Vérification des identifiants (à remplacer par une vérification réelle)
            if (username === 'admin' && password === 'justrobots2025') {
                // Création de l'objet d'authentification
                const auth = {
                    isLoggedIn: true,
                    username: username,
                    loginDate: new Date().toISOString()
                };
                
                // Sauvegarde de l'authentification
                localStorage.setItem(this.KEYS.AUTH, JSON.stringify(auth));
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return false;
        }
    },
    
    // Déconnexion
    logout: function() {
        try {
            // Suppression de l'authentification
            localStorage.removeItem(this.KEYS.AUTH);
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return false;
        }
    }
};


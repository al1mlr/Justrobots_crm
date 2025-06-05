// Mise à jour du script d'administration avec intégration du stockage
document.addEventListener('DOMContentLoaded', async function() {
    // Initialisation du stockage
    await STORAGE.init();
    
    // Vérification de l'authentification
    if (!STORAGE.checkAuth()) {
        showLoginModal();
    }
    
    // Gestion de la connexion
    document.getElementById('login-button').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (STORAGE.login(username, password)) {
            hideLoginModal();
            loadAdminInterface();
        } else {
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = 'Identifiants incorrects';
            errorElement.style.display = 'block';
        }
    });
    
    // Gestion de la déconnexion
    document.getElementById('logout-button').addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            STORAGE.logout();
            showLoginModal();
        }
    });
    
    // Gestion du bouton "Voir le site"
    document.getElementById('view-site-button').addEventListener('click', function() {
        window.open('../index.html', '_blank');
    });
    
    // Chargement de l'interface d'administration si connecté
    if (STORAGE.checkAuth()) {
        loadAdminInterface();
    }
});

// Affichage du modal de connexion
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'block';
    
    // Réinitialisation des champs
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').style.display = 'none';
    
    // Masquage du contenu d'administration
    document.querySelector('.admin-container').style.display = 'none';
}

// Masquage du modal de connexion
function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'none';
    
    // Affichage du contenu d'administration
    document.querySelector('.admin-container').style.display = 'block';
}

// Chargement de l'interface d'administration
function loadAdminInterface() {
    // Configuration globale
    const CONFIG = {
        defaultLanguage: STORAGE.getCurrentLanguage(),
        availableLanguages: ['fr', 'en']
    };

    // État global de l'application
    let STATE = {
        currentLanguage: CONFIG.defaultLanguage,
        translations: STORAGE.getTranslations(),
        unsavedChanges: false,
        currentTab: 'general'
    };
    
    // Initialisation du sélecteur de langue
    const languageSelector = document.getElementById('admin-language-selector');
    languageSelector.value = STATE.currentLanguage;
    
    languageSelector.addEventListener('change', (e) => {
        STATE.currentLanguage = e.target.value;
        STORAGE.updateCurrentLanguage(STATE.currentLanguage);
        loadFormData(); // Recharger les données dans la langue sélectionnée
    });
    
    // Initialisation des onglets
    initTabs();
    
    // Chargement des données dans les formulaires
    loadFormData();
    
    // Chargement des sauvegardes
    loadBackups();
    
    // Initialisation des événements de sauvegarde
    initSaveEvents();
    
    // Initialisation de l'import/export
    initImportExport();
    
    // Initialisation des paramètres
    initSettings();
}

// Initialisation des onglets
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Vérifier s'il y a des changements non sauvegardés
            if (STATE.unsavedChanges) {
                if (!confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment changer d\'onglet ?')) {
                    return;
                }
            }
            
            // Mise à jour de l'onglet actif
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mise à jour du contenu d'onglet actif
            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Mise à jour de l'état
            STATE.currentTab = tabId;
            STATE.unsavedChanges = false;
        });
    });
}

// Chargement des données dans les formulaires
function loadFormData() {
    const currentLang = STATE.currentLanguage;
    const data = STATE.translations[currentLang];
    
    if (!data) {
        console.error(`Traductions non disponibles pour la langue ${currentLang}`);
        return;
    }
    
    // Chargement des champs traduisibles
    document.querySelectorAll('.translatable').forEach(element => {
        const path = element.getAttribute('data-path');
        const value = getNestedValue(data, path);
        
        if (value !== undefined) {
            element.value = value;
        }
    });
    
    // Chargement des produits
    loadProductsData(data);
    
    // Chargement des cartes de mission
    loadMissionCards(data);
}

// Chargement des données de produits
function loadProductsData(data) {
    const productsContainer = document.getElementById('products-categories');
    productsContainer.innerHTML = '';
    
    if (!data.products || !data.products.categories) return;
    
    data.products.categories.forEach((category, categoryIndex) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'edit-item category-item';
        categoryElement.innerHTML = `
            <div class="edit-item-header">
                <h3>${category.title}</h3>
                <div class="edit-item-actions">
                    <button class="btn-edit-category" data-index="${categoryIndex}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete-category" data-index="${categoryIndex}"><i class="fas fa-trash"></i></button>
                    <button class="btn-toggle-category"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>
            <div class="edit-item-content">
                <div class="form-group">
                    <label>Titre de la catégorie</label>
                    <input type="text" class="category-title" value="${category.title}" data-index="${categoryIndex}">
                </div>
                <div class="products-list">
                    <h4>Produits</h4>
                    <div class="products-items" data-category="${categoryIndex}">
                        ${category.products.map((product, productIndex) => `
                            <div class="edit-item product-item">
                                <div class="edit-item-header">
                                    <h5>${product.title}</h5>
                                    <div class="edit-item-actions">
                                        <button class="btn-edit-product" data-category="${categoryIndex}" data-index="${productIndex}"><i class="fas fa-edit"></i></button>
                                        <button class="btn-delete-product" data-category="${categoryIndex}" data-index="${productIndex}"><i class="fas fa-trash"></i></button>
                                        <button class="btn-toggle-product"><i class="fas fa-chevron-down"></i></button>
                                    </div>
                                </div>
                                <div class="edit-item-content">
                                    <div class="form-group">
                                        <label>ID du produit</label>
                                        <input type="text" class="product-id" value="${product.id}" data-category="${categoryIndex}" data-index="${productIndex}">
                                    </div>
                                    <div class="form-group">
                                        <label>Titre du produit</label>
                                        <input type="text" class="product-title" value="${product.title}" data-category="${categoryIndex}" data-index="${productIndex}">
                                    </div>
                                    <div class="form-group">
                                        <label>Spécifications</label>
                                        <input type="text" class="product-specs" value="${product.specs}" data-category="${categoryIndex}" data-index="${productIndex}">
                                    </div>
                                    <div class="form-group">
                                        <label>Description</label>
                                        <textarea class="product-description" data-category="${categoryIndex}" data-index="${productIndex}">${product.description}</textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>Image</label>
                                        <input type="text" class="product-image" value="${product.image}" data-category="${categoryIndex}" data-index="${productIndex}">
                                    </div>
                                    <div class="form-group">
                                        <label>Caractéristiques</label>
                                        <div class="product-features" data-category="${categoryIndex}" data-index="${productIndex}">
                                            ${product.features.map((feature, featureIndex) => `
                                                <div class="feature-item">
                                                    <input type="text" value="${feature}" data-category="${categoryIndex}" data-product="${productIndex}" data-index="${featureIndex}">
                                                    <button class="btn-delete-feature" data-category="${categoryIndex}" data-product="${productIndex}" data-index="${featureIndex}"><i class="fas fa-times"></i></button>
                                                </div>
                                            `).join('')}
                                            <button class="btn-add-feature" data-category="${categoryIndex}" data-product="${productIndex}">Ajouter une caractéristique</button>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Produit vedette</label>
                                        <input type="checkbox" class="product-featured" ${product.featured ? 'checked' : ''} data-category="${categoryIndex}" data-index="${productIndex}">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add-product" data-category="${categoryIndex}">Ajouter un produit</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(categoryElement);
    });
    
    // Ajout des événements pour les boutons d'édition, suppression, etc.
    addProductsEvents();
}

// Chargement des cartes de mission
function loadMissionCards(data) {
    const missionCardsContainer = document.getElementById('mission-cards');
    missionCardsContainer.innerHTML = '';
    
    if (!data.mission || !data.mission.cards) return;
    
    data.mission.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'edit-item mission-card-item';
        cardElement.innerHTML = `
            <div class="edit-item-header">
                <h5>${card.title}</h5>
                <div class="edit-item-actions">
                    <button class="btn-edit-mission-card" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete-mission-card" data-index="${index}"><i class="fas fa-trash"></i></button>
                    <button class="btn-toggle-mission-card"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>
            <div class="edit-item-content">
                <div class="form-group">
                    <label>Titre</label>
                    <input type="text" class="mission-card-title" value="${card.title}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="mission-card-description" data-index="${index}">${card.description}</textarea>
                </div>
            </div>
        `;
        
        missionCardsContainer.appendChild(cardElement);
    });
    
    // Ajout des événements pour les boutons d'édition, suppression, etc.
    addMissionCardsEvents();
}

// Chargement des sauvegardes
function loadBackups() {
    const backupsContainer = document.getElementById('backups-list');
    backupsContainer.innerHTML = '';
    
    const backups = STORAGE.getBackups();
    
    if (backups.length === 0) {
        backupsContainer.innerHTML = '<p>Aucune sauvegarde disponible</p>';
        return;
    }
    
    backups.forEach(backup => {
        const backupElement = document.createElement('div');
        backupElement.className = 'backup-item';
        backupElement.innerHTML = `
            <div class="backup-info">
                <span class="backup-date">${new Date(backup.date).toLocaleString()}</span>
                <div class="backup-actions">
                    <button class="btn-restore-backup" data-id="${backup.id}">Restaurer</button>
                </div>
            </div>
        `;
        
        backupsContainer.appendChild(backupElement);
    });
    
    // Ajout des événements pour les boutons de restauration
    document.querySelectorAll('.btn-restore-backup').forEach(button => {
        button.addEventListener('click', () => {
            const backupId = parseInt(button.getAttribute('data-id'));
            
            if (confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Toutes les modifications non sauvegardées seront perdues.')) {
                if (STORAGE.restoreBackup(backupId)) {
                    // Mise à jour des traductions
                    STATE.translations = STORAGE.getTranslations();
                    
                    // Rechargement des formulaires
                    loadFormData();
                    
                    // Affichage d'un message de succès
                    showMessage('Sauvegarde restaurée avec succès', 'success');
                } else {
                    showMessage('Erreur lors de la restauration de la sauvegarde', 'error');
                }
            }
        });
    });
}

// Initialisation des paramètres
function initSettings() {
    const config = STORAGE.getConfig();
    
    // Langue par défaut
    document.getElementById('default-language').value = config.defaultLanguage || 'fr';
    
    // Sauvegardes
    document.getElementById('backup-enabled').checked = config.settings && config.settings.backupEnabled;
    document.getElementById('max-backups').value = config.settings && config.settings.maxBackups ? config.settings.maxBackups : 10;
}

// Ajout des événements pour les produits
function addProductsEvents() {
    // Toggle pour les catégories
    document.querySelectorAll('.btn-toggle-category').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.edit-item');
            item.classList.toggle('open');
            
            const icon = button.querySelector('i');
            if (item.classList.contains('open')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Toggle pour les produits
    document.querySelectorAll('.btn-toggle-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.edit-item');
            item.classList.toggle('open');
            
            const icon = button.querySelector('i');
            if (item.classList.contains('open')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Ajout d'une catégorie
    document.getElementById('add-category').addEventListener('click', () => {
        const data = STATE.translations[STATE.currentLanguage];
        if (!data.products) data.products = {};
        if (!data.products.categories) data.products.categories = [];
        
        data.products.categories.push({
            title: 'Nouvelle catégorie',
            products: []
        });
        
        loadProductsData(data);
        STATE.unsavedChanges = true;
    });
    
    // Ajout d'un produit
    document.querySelectorAll('.btn-add-product').forEach(button => {
        button.addEventListener('click', () => {
            const categoryIndex = button.getAttribute('data-category');
            const data = STATE.translations[STATE.currentLanguage];
            
            data.products.categories[categoryIndex].products.push({
                id: `product_${Date.now()}`,
                title: 'Nouveau produit',
                specs: 'Spécifications',
                description: 'Description du produit',
                features: ['Caractéristique 1'],
                image: 'images/tech_background_1.jpg',
                featured: false
            });
            
            loadProductsData(data);
            STATE.unsavedChanges = true;
        });
    });
    
    // Suppression d'une catégorie
    document.querySelectorAll('.btn-delete-category').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie et tous ses produits ?')) {
                const categoryIndex = button.getAttribute('data-index');
                const data = STATE.translations[STATE.currentLanguage];
                
                data.products.categories.splice(categoryIndex, 1);
                
                loadProductsData(data);
                STATE.unsavedChanges = true;
            }
        });
    });
    
    // Suppression d'un produit
    document.querySelectorAll('.btn-delete-product').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                const categoryIndex = button.getAttribute('data-category');
                const productIndex = button.getAttribute('data-index');
                const data = STATE.translations[STATE.currentLanguage];
                
                data.products.categories[categoryIndex].products.splice(productIndex, 1);
                
                loadProductsData(data);
                STATE.unsavedChanges = true;
            }
        });
    });
    
    // Ajout d'une caractéristique
    document.querySelectorAll('.btn-add-feature').forEach(button => {
        button.addEventListener('click', () => {
            const categoryIndex = button.getAttribute('data-category');
            const productIndex = button.getAttribute('data-product');
            const data = STATE.translations[STATE.currentLanguage];
            
            data.products.categories[categoryIndex].products[productIndex].features.push('Nouvelle caractéristique');
            
            loadProductsData(data);
            STATE.unsavedChanges = true;
        });
    });
    
    // Suppression d'une caractéristique
    document.querySelectorAll('.btn-delete-feature').forEach(button => {
        button.addEventListener('click', () => {
            const categoryIndex = button.getAttribute('data-category');
            const productIndex = button.getAttribute('data-product');
            const featureIndex = button.getAttribute('data-index');
            const data = STATE.translations[STATE.currentLanguage];
            
            data.products.categories[categoryIndex].products[productIndex].features.splice(featureIndex, 1);
            
            loadProductsData(data);
            STATE.unsavedChanges = true;
        });
    });
    
    // Mise à jour des données lors de la modification des champs
    document.querySelectorAll('.category-title, .product-id, .product-title, .product-specs, .product-description, .product-image, .product-featured').forEach(input => {
        input.addEventListener('change', () => {
            updateProductData(input);
            STATE.unsavedChanges = true;
        });
    });
}

// Ajout des événements pour les cartes de mission
function addMissionCardsEvents() {
    // Toggle pour les cartes de mission
    document.querySelectorAll('.btn-toggle-mission-card').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.edit-item');
            item.classList.toggle('open');
            
            const icon = button.querySelector('i');
            if (item.classList.contains('open')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Ajout d'une carte de mission
    document.getElementById('add-mission-card').addEventListener('click', () => {
        const data = STATE.translations[STATE.currentLanguage];
        if (!data.mission) data.mission = {};
        if (!data.mission.cards) data.mission.cards = [];
        
        data.mission.cards.push({
            title: 'Nouvelle carte',
            description: 'Description de la carte'
        });
        
        loadMissionCards(data);
        STATE.unsavedChanges = true;
    });
    
    // Suppression d'une carte de mission
    document.querySelectorAll('.btn-delete-mission-card').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
                const cardIndex = button.getAttribute('data-index');
                const data = STATE.translations[STATE.currentLanguage];
                
                data.mission.cards.splice(cardIndex, 1);
                
                loadMissionCards(data);
                STATE.unsavedChanges = true;
            }
        });
    });
    
    // Mise à jour des données lors de la modification des champs
    document.querySelectorAll('.mission-card-title, .mission-card-description').forEach(input => {
        input.addEventListener('change', () => {
            updateMissionCardData(input);
            STATE.unsavedChanges = true;
        });
    });
}

// Mise à jour des données de produit
function updateProductData(input) {
    const data = STATE.translations[STATE.currentLanguage];
    const categoryIndex = input.getAttribute('data-category');
    const productIndex = input.getAttribute('data-index');
    
    if (input.classList.contains('category-title')) {
        data.products.categories[categoryIndex].title = input.value;
    } else if (input.classList.contains('product-id')) {
        data.products.categories[categoryIndex].products[productIndex].id = input.value;
    } else if (input.classList.contains('product-title')) {
        data.products.categories[categoryIndex].products[productIndex].title = input.value;
    } else if (input.classList.contains('product-specs')) {
        data.products.categories[categoryIndex].products[productIndex].specs = input.value;
    } else if (input.classList.contains('product-description')) {
        data.products.categories[categoryIndex].products[productIndex].description = input.value;
    } else if (input.classList.contains('product-image')) {
        data.products.categories[categoryIndex].products[productIndex].image = input.value;
    } else if (input.classList.contains('product-featured')) {
        data.products.categories[categoryIndex].products[productIndex].featured = input.checked;
    }
}

// Mise à jour des données de carte de mission
function updateMissionCardData(input) {
    const data = STATE.translations[STATE.currentLanguage];
    const cardIndex = input.getAttribute('data-index');
    
    if (input.classList.contains('mission-card-title')) {
        data.mission.cards[cardIndex].title = input.value;
    } else if (input.classList.contains('mission-card-description')) {
        data.mission.cards[cardIndex].description = input.value;
    }
}

// Initialisation des événements de sauvegarde
function initSaveEvents() {
    // Sauvegarde des paramètres généraux
    document.getElementById('save-general').addEventListener('click', () => {
        saveGeneralData();
    });
    
    // Sauvegarde des produits
    document.getElementById('save-products').addEventListener('click', () => {
        saveProductsData();
    });
    
    // Sauvegarde du contenu
    document.getElementById('save-content').addEventListener('click', () => {
        saveContentData();
    });
    
    // Sauvegarde des paramètres
    document.getElementById('save-settings').addEventListener('click', () => {
        saveSettingsData();
    });
    
    // Annulation des modifications
    document.querySelectorAll('#cancel-general, #cancel-products, #cancel-content, #cancel-settings').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir annuler toutes les modifications ?')) {
                // Rechargement des traductions
                STATE.translations = STORAGE.getTranslations();
                
                // Rechargement des formulaires
                loadFormData();
                
                // Mise à jour de l'état
                STATE.unsavedChanges = false;
            }
        });
    });
    
    // Mise à jour des champs traduisibles
    document.querySelectorAll('.translatable').forEach(input => {
        input.addEventListener('change', () => {
            updateTranslatableField(input);
            STATE.unsavedChanges = true;
        });
    });
}

// Mise à jour d'un champ traduisible
function updateTranslatableField(input) {
    const path = input.getAttribute('data-path');
    const value = input.value;
    const data = STATE.translations[STATE.currentLanguage];
    
    setNestedValue(data, path, value);
}

// Sauvegarde des paramètres généraux
function saveGeneralData() {
    // Les données sont déjà mises à jour via les événements de changement
    // Sauvegarde des traductions
    STORAGE.updateTranslations(STATE.translations);
    
    // Mise à jour de l'état
    STATE.unsavedChanges = false;
    
    // Affichage d'un message de succès
    showMessage('Paramètres généraux sauvegardés avec succès', 'success');
}

// Sauvegarde des produits
function saveProductsData() {
    // Les données sont déjà mises à jour via les événements de changement
    // Sauvegarde des traductions
    STORAGE.updateTranslations(STATE.translations);
    
    // Mise à jour de l'état
    STATE.unsavedChanges = false;
    
    // Affichage d'un message de succès
    showMessage('Produits sauvegardés avec succès', 'success');
}

// Sauvegarde du contenu
function saveContentData() {
    // Les données sont déjà mises à jour via les événements de changement
    // Sauvegarde des traductions
    STORAGE.updateTranslations(STATE.translations);
    
    // Mise à jour de l'état
    STATE.unsavedChanges = false;
    
    // Affichage d'un message de succès
    showMessage('Contenu sauvegardé avec succès', 'success');
}

// Sauvegarde des paramètres
function saveSettingsData() {
    // Mise à jour de la configuration
    const config = STORAGE.getConfig();
    
    // Mise à jour de la langue par défaut
    config.defaultLanguage = document.getElementById('default-language').value;
    
    // Mise à jour des paramètres de sauvegarde
    if (!config.settings) config.settings = {};
    config.settings.backupEnabled = document.getElementById('backup-enabled').checked;
    config.settings.maxBackups = parseInt(document.getElementById('max-backups').value);
    
    // Sauvegarde de la configuration
    STORAGE.updateConfig(config);
    
    // Sauvegarde des traductions
    STORAGE.updateTranslations(STATE.translations);
    
    // Mise à jour de l'état
    STATE.unsavedChanges = false;
    
    // Affichage d'un message de succès
    showMessage('Paramètres sauvegardés avec succès', 'success');
}

// Initialisation de l'import/export
function initImportExport() {
    // Export des données
    document.getElementById('export-data').addEventListener('click', () => {
        if (STORAGE.exportData()) {
            showMessage('Données exportées avec succès', 'success');
        } else {
            showMessage('Erreur lors de l\'exportation des données', 'error');
        }
    });
    
    // Import des données
    document.getElementById('import-data').addEventListener('click', () => {
        const fileInput = document.getElementById('import-file');
        const file = fileInput.files[0];
        
        if (!file) {
            showMessage('Veuillez sélectionner un fichier à importer', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (STORAGE.importData(e.target.result)) {
                    // Mise à jour des traductions
                    STATE.translations = STORAGE.getTranslations();
                    
                    // Rechargement des formulaires
                    loadFormData();
                    
                    // Mise à jour de l'état
                    STATE.unsavedChanges = false;
                    
                    // Affichage d'un message de succès
                    showMessage('Données importées avec succès', 'success');
                } else {
                    showMessage('Erreur lors de l\'importation des données', 'error');
                }
            } catch (error) {
                showMessage(`Erreur lors de l'import des données: ${error.message}`, 'error');
            }
        };
        
        reader.readAsText(file);
    });
}

// Affichage d'un message
function showMessage(message, type = 'info') {
    // Création de l'élément de message
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // Ajout du message à la page
    document.body.appendChild(messageElement);
    
    // Suppression du message après 3 secondes
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Utilitaires pour accéder aux propriétés imbriquées
function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
    }, obj);
}

function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    
    const parent = parts.reduce((prev, curr) => {
        if (!prev[curr]) prev[curr] = {};
        return prev[curr];
    }, obj);
    
    parent[last] = value;
}


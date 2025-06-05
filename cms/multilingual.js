// Configuration globale
const CONFIG = {
    defaultLanguage: 'fr',
    availableLanguages: ['fr', 'en'],
    storageKey: 'justrobots_cms_data',
    adminUrl: 'cms/admin.html'
};

// État global de l'application
let STATE = {
    currentLanguage: localStorage.getItem('justrobots_language') || CONFIG.defaultLanguage,
    translations: {},
    isEditMode: false
};

// Initialisation du système multilingue
document.addEventListener('DOMContentLoaded', () => {
    // Chargement des traductions
    loadTranslations().then(() => {
        // Ajout du sélecteur de langue
        addLanguageSelector();
        
        // Ajout du bouton d'administration
        addAdminButton();
        
        // Application des traductions
        applyTranslations();
    });
});

// Chargement des traductions
async function loadTranslations() {
    try {
        // Vérification des traductions dans le localStorage
        const storedTranslations = localStorage.getItem(CONFIG.storageKey);
        
        if (storedTranslations) {
            // Utilisation des traductions stockées
            STATE.translations = JSON.parse(storedTranslations);
            console.log('Traductions chargées depuis le localStorage');
        } else {
            // Chargement des fichiers de traduction
            const responses = await Promise.all(
                CONFIG.availableLanguages.map(lang => 
                    fetch(`locales/${lang}.json`)
                    .then(response => response.json())
                )
            );
            
            // Stockage des traductions dans l'état
            CONFIG.availableLanguages.forEach((lang, index) => {
                STATE.translations[lang] = responses[index];
            });
            
            // Sauvegarde des traductions dans le localStorage
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(STATE.translations));
            
            console.log('Traductions chargées depuis les fichiers');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
        
        // Tentative de chargement des fichiers de traduction en cas d'erreur
        try {
            const responses = await Promise.all(
                CONFIG.availableLanguages.map(lang => 
                    fetch(`locales/${lang}.json`)
                    .then(response => response.json())
                )
            );
            
            // Stockage des traductions dans l'état
            CONFIG.availableLanguages.forEach((lang, index) => {
                STATE.translations[lang] = responses[index];
            });
            
            console.log('Traductions chargées depuis les fichiers (fallback)');
        } catch (fallbackError) {
            console.error('Erreur lors du chargement des traductions (fallback):', fallbackError);
        }
    }
}

// Ajout du sélecteur de langue
function addLanguageSelector() {
    // Création du sélecteur de langue
    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    languageSelector.innerHTML = `
        <span class="globe-icon"><i class="fas fa-globe"></i></span>
        <select id="language-selector">
            <option value="fr" ${STATE.currentLanguage === 'fr' ? 'selected' : ''}>Français</option>
            <option value="en" ${STATE.currentLanguage === 'en' ? 'selected' : ''}>English</option>
        </select>
    `;
    
    // Ajout du sélecteur à la page
    document.body.appendChild(languageSelector);
    
    // Gestion du changement de langue
    document.getElementById('language-selector').addEventListener('change', (e) => {
        STATE.currentLanguage = e.target.value;
        
        // Sauvegarde de la langue dans le localStorage
        localStorage.setItem('justrobots_language', STATE.currentLanguage);
        
        // Application des traductions
        applyTranslations();
    });
}

// Ajout du bouton d'administration
function addAdminButton() {
    // Création du bouton d'administration
    const adminButton = document.createElement('a');
    adminButton.className = 'admin-button';
    adminButton.href = CONFIG.adminUrl;
    adminButton.innerHTML = '<i class="fas fa-cog"></i>';
    adminButton.title = 'Administration';
    
    // Ajout du bouton à la page
    document.body.appendChild(adminButton);
}

// Application des traductions
function applyTranslations() {
    const currentLang = STATE.currentLanguage;
    const data = STATE.translations[currentLang];
    
    if (!data) {
        console.error(`Traductions non disponibles pour la langue ${currentLang}`);
        return;
    }
    
    // Mise à jour du titre de la page
    document.title = data.site.title;
    
    // Mise à jour des éléments traduisibles
    updateTranslatableElements(data);
}

// Mise à jour des éléments traduisibles
function updateTranslatableElements(data) {
    // Mise à jour des éléments avec l'attribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.placeholder = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.innerHTML = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-href
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
        const key = element.getAttribute('data-i18n-href');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.href = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-src
    document.querySelectorAll('[data-i18n-src]').forEach(element => {
        const key = element.getAttribute('data-i18n-src');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.src = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-alt
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.alt = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const value = getNestedValue(data, key);
        
        if (value !== undefined) {
            element.title = value;
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-list
    document.querySelectorAll('[data-i18n-list]').forEach(element => {
        const key = element.getAttribute('data-i18n-list');
        const items = getNestedValue(data, key);
        
        if (items && Array.isArray(items)) {
            element.innerHTML = '';
            
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                element.appendChild(li);
            });
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-options
    document.querySelectorAll('[data-i18n-options]').forEach(element => {
        const key = element.getAttribute('data-i18n-options');
        const options = getNestedValue(data, key);
        
        if (options && Array.isArray(options)) {
            element.innerHTML = '';
            
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value || option;
                opt.textContent = option.text || option;
                element.appendChild(opt);
            });
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-cards
    document.querySelectorAll('[data-i18n-cards]').forEach(element => {
        const key = element.getAttribute('data-i18n-cards');
        const cards = getNestedValue(data, key);
        
        if (cards && Array.isArray(cards)) {
            element.innerHTML = '';
            
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                `;
                element.appendChild(cardElement);
            });
        }
    });
    
    // Mise à jour des éléments avec l'attribut data-i18n-products
    document.querySelectorAll('[data-i18n-products]').forEach(element => {
        const key = element.getAttribute('data-i18n-products');
        const categories = getNestedValue(data, key);
        
        if (categories && Array.isArray(categories)) {
            element.innerHTML = '';
            
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'product-category';
                categoryElement.innerHTML = `
                    <h3>${category.title}</h3>
                    <div class="products-grid"></div>
                `;
                
                const productsGrid = categoryElement.querySelector('.products-grid');
                
                category.products.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'product-item';
                    productElement.innerHTML = `
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <h4>${product.title}</h4>
                        <p class="product-specs">${product.specs}</p>
                        <p class="product-description">${product.description}</p>
                        <div class="product-features">
                            ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                    `;
                    
                    productsGrid.appendChild(productElement);
                });
                
                element.appendChild(categoryElement);
            });
        }
    });
}

// Utilitaires pour accéder aux propriétés imbriquées
function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
    }, obj);
}


# Structure du Projet CMS JustRobots

## Objectifs
- Créer un CMS simple intégré au site JustRobots
- Ajouter une fonctionnalité de changement de langue français/anglais
- Permettre l'édition des contenus via une interface web

## Structure des fichiers
- `index.html` - Page principale du site
- `styles.css` - Styles CSS du site
- `script.js` - JavaScript principal du site
- `cms/` - Dossier contenant les fichiers du CMS
  - `admin.html` - Interface d'administration du CMS
  - `admin.css` - Styles CSS pour l'interface d'administration
  - `admin.js` - JavaScript pour l'interface d'administration
- `locales/` - Dossier contenant les fichiers de traduction
  - `fr.json` - Traductions en français
  - `en.json` - Traductions en anglais
- `data/` - Dossier contenant les données du site
  - `content.json` - Contenu du site (textes, descriptions, etc.)
  - `robots.json` - Données des robots

## Fonctionnalités du CMS
1. **Gestion des langues**
   - Toggle pour changer entre français et anglais
   - Traduction automatique des textes selon la langue sélectionnée

2. **Édition des contenus**
   - Modification des textes de présentation
   - Édition des informations des robots
   - Gestion des sections (Mission, Contact, etc.)

3. **Stockage des données**
   - Utilisation de localStorage pour sauvegarder les modifications
   - Option d'export/import des données

4. **Interface utilisateur**
   - Interface d'administration simple et intuitive
   - Formulaires d'édition pour chaque type de contenu
   - Prévisualisation des modifications


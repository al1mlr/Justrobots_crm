# Documentation Technique - JustRobots Website

## Architecture du projet

### Structure des fichiers

Le projet suit une architecture simple et maintenable :

```
justrobots-website/
├── index.html          # Point d'entrée principal
├── styles.css          # Styles CSS centralisés
├── script.js           # Logique JavaScript
├── images/             # Assets visuels
└── docs/               # Documentation technique
```

### Technologies utilisées

#### HTML5
- Structure sémantique avec balises appropriées
- Métadonnées SEO complètes
- Accessibilité avec attributs ARIA
- Validation W3C conforme

#### CSS3
- Variables CSS pour la cohérence
- Grid et Flexbox pour la mise en page
- Media queries pour la responsivité
- Animations et transitions fluides

#### JavaScript ES6
- Code moderne et optimisé
- Event listeners pour l'interactivité
- Manipulation DOM efficace
- Gestion des erreurs

## Responsive Design

### Breakpoints

```css
/* Mobile First */
@media (min-width: 768px) { /* Tablette */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Grilles responsives

- **Mobile** : 1 colonne
- **Tablette** : 2 colonnes
- **Desktop** : 3+ colonnes selon le contenu

## Performance

### Optimisations appliquées

1. **Images**
   - Format JPEG optimisé
   - Compression sans perte de qualité
   - Lazy loading pour les images non critiques

2. **CSS**
   - Minification du code
   - Utilisation de variables CSS
   - Évitement des sélecteurs complexes

3. **JavaScript**
   - Code minimal et efficace
   - Chargement asynchrone
   - Évitement des bibliothèques lourdes

### Métriques de performance

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **Time to Interactive** : < 3s

## Accessibilité

### Standards respectés

- **WCAG 2.1 AA** : Conformité complète
- **Contraste** : Ratio minimum 4.5:1
- **Navigation clavier** : Tous les éléments accessibles
- **Lecteurs d'écran** : Structure sémantique

### Tests d'accessibilité

```bash
# Outils recommandés
- axe-core (extension navigateur)
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit
```

## SEO

### Optimisations

1. **Métadonnées**
   ```html
   <meta name="description" content="...">
   <meta name="keywords" content="...">
   <meta property="og:title" content="...">
   ```

2. **Structure**
   - Hiérarchie H1-H6 logique
   - URLs sémantiques
   - Sitemap XML (à ajouter)

3. **Performance**
   - Temps de chargement optimisé
   - Images avec attributs alt
   - Schema.org markup (à ajouter)

## Maintenance

### Bonnes pratiques

1. **Code**
   - Commentaires explicites
   - Nommage cohérent
   - Structure modulaire

2. **Assets**
   - Organisation par type
   - Nommage descriptif
   - Optimisation régulière

3. **Documentation**
   - Mise à jour du CHANGELOG
   - Tests de régression
   - Validation continue

### Checklist de déploiement

- [ ] Tests cross-browser
- [ ] Validation HTML/CSS
- [ ] Audit Lighthouse
- [ ] Tests d'accessibilité
- [ ] Optimisation des images
- [ ] Mise à jour de la documentation

## Déploiement

### Plateformes recommandées

1. **Netlify** (recommandé)
   ```bash
   # Déploiement automatique depuis GitHub
   netlify deploy --prod
   ```

2. **Vercel**
   ```bash
   vercel --prod
   ```

3. **GitHub Pages**
   ```bash
   # Configuration dans Settings > Pages
   ```

### Variables d'environnement

Aucune variable d'environnement requise pour ce site statique.

## Monitoring

### Métriques à surveiller

1. **Performance**
   - Core Web Vitals
   - Temps de chargement
   - Taille des assets

2. **Accessibilité**
   - Score Lighthouse
   - Tests utilisateurs
   - Conformité WCAG

3. **SEO**
   - Positionnement Google
   - Trafic organique
   - Taux de rebond

## Troubleshooting

### Problèmes courants

1. **Images ne se chargent pas**
   - Vérifier les chemins relatifs
   - Contrôler les permissions de fichiers

2. **CSS ne s'applique pas**
   - Vérifier l'ordre de chargement
   - Contrôler la spécificité des sélecteurs

3. **JavaScript ne fonctionne pas**
   - Vérifier la console pour les erreurs
   - Contrôler la compatibilité navigateur

### Outils de debug

- **Chrome DevTools** : Inspection et debug
- **Firefox Developer Tools** : Tests cross-browser
- **Lighthouse** : Audits de performance
- **axe DevTools** : Tests d'accessibilité


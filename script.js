// Fonctions pour le site principal
document.addEventListener('DOMContentLoaded', function() {
    // Navigation responsive
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustement pour la barre de navigation
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Ajouter la classe animate-on-scroll aux éléments à animer
    document.querySelectorAll('.section-header, .mission-cards, .product-category, .technology-content, .applications-grid, .contact-content').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Exécuter l'animation au chargement et au défilement
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
    
    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulation d'envoi du formulaire
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            
            setTimeout(() => {
                // Réinitialisation du formulaire
                contactForm.reset();
                
                // Affichage d'un message de succès
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Votre message a été envoyé avec succès !';
                
                contactForm.appendChild(successMessage);
                
                // Réinitialisation du bouton
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Suppression du message après 3 secondes
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }, 1500);
        });
    }
});


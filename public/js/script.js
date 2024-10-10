// Gestion du défilement pour la barre de navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");

function showSlides() {
    // Vérifier si des slides existent
    if (slides.length === 0) {
        console.error("Aucune slide trouvée");
        return;
    }

    // Masquer toutes les slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }

    slideIndex++;
    // Si on dépasse le nombre de slides, on recommence à la première
    if (slideIndex > slides.length) { 
        slideIndex = 1; 
    }

    // Afficher la slide active uniquement si elle existe
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";  
    }

    setTimeout(showSlides, 4000); // Changer d'image toutes les 4 secondes
}

// Lancer le slider
showSlides();

// Change navigation background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled'); // Add 'scrolled' class if user scrolls down
    } else {
        nav.classList.remove('scrolled'); // Remove 'scrolled' class when at the top
    }
});

// Parallax effect for the hero section content
window.addEventListener('scroll', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${window.scrollY * 0.5}px)`; // Parallax effect based on scroll
    }
});

// Track page views when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('/track-page-view', {
        method: 'POST'
    }).catch(error => console.error('Error tracking page view:', error));
});

// Track Buy Button Clicks
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior

        const productId = button.getAttribute('data-product-id'); // Get the product ID from data attribute

        // Send a POST request to track the click
        fetch('/track-buy-click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }) // Send the product ID to the server
        }).then(response => {
            if (response.ok) {
                // Redirect to the Maison ST product page after tracking the click
                window.location.href = button.href;
            } else {
                console.error('Failed to track buy click:', response.statusText);
            }
        }).catch(error => console.error('Error tracking buy click:', error));
    });
});

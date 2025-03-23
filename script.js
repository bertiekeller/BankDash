let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;

document.getElementById('total-slides').textContent = totalSlides;

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
}

function showSlide(slideNumber) {
    // Hide all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show the current slide
    document.querySelector(`#slide-${slideNumber}`).classList.add('active');
    
    // Update counter
    updateSlideCounter();
    
    // Update navigation button states
    document.querySelector('.prev').disabled = currentSlide === 1;
    document.querySelector('.next').disabled = currentSlide === totalSlides;
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        previousSlide();
    }
});

// Initialize
showSlide(currentSlide); 
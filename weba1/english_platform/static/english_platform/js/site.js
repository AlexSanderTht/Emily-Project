document.addEventListener('DOMContentLoaded', function () {
    var hash = window.location.hash;
    if (hash && hash === '#interesse') {
        var formSection = document.getElementById('interesse');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    var animatedSections = document.querySelectorAll('.info-card, .showcase-card, .form-section');
    if (!animatedSections.length) {
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedSections.forEach(function (section, index) {
        section.style.transitionDelay = (index * 70) + 'ms';
        observer.observe(section);
    });
});

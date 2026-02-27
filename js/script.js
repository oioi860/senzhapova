// ========== ПЛАВНАЯ ПРОКРУТКА ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== КАРУСЕЛЬ С ПЛАВНОЙ БЕСКОНЕЧНОЙ ПРОКРУТКОЙ ==========
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || !slides.length) return;
    
    // Клонируем первый и последний слайд для бесконечной прокрутки
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    
    // Добавляем клоны в начало и конец
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);
    
    const allSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    const totalSlides = allSlides.length;
    
    // Устанавливаем ширину для всех слайдов
    const slideWidth = 100; // в процентах
    
    // Начальная позиция - первый реальный слайд (индекс 1, после клона последнего)
    let currentIndex = 1;
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    
    // Флаг для блокировки кликов во время анимации
    let isTransitioning = false;
    
    // Создаем точки
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(i + 1); // +1 из-за клона
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateDots() {
        let realIndex = currentIndex - 1;
        if (realIndex < 0) realIndex = slides.length - 1;
        if (realIndex >= slides.length) realIndex = 0;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }
    
    function goToSlide(index, withTransition = true) {
        if (isTransitioning) return;
        
        if (!withTransition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease';
        }
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        updateDots();
        
        // Проверяем, не на клоне ли мы
        if (withTransition) {
            isTransitioning = true;
            
            // Если мы на последнем клоне (после последнего реального)
            if (currentIndex === totalSlides - 1) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 1;
                    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                        isTransitioning = false;
                    }, 50);
                }, 500);
            }
            // Если мы на первом клоне (перед первым реальным)
            else if (currentIndex === 0) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = totalSlides - 2;
                    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                        isTransitioning = false;
                    }, 50);
                }, 500);
            } else {
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex - 1);
    }
    
    // Обработчики
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Автопрокрутка каждые 5 секунд
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Останавливаем автопрокрутку при наведении на карусель
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Обработка окончания перехода
    track.addEventListener('transitionend', () => {
        // Дополнительная проверка для безопасности
    });
});

// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ГАЛЕРЕИ ==========
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalArea = document.getElementById('modalArea');
    const modalDesc = document.getElementById('modalDesc');
    const modalDots = modal.querySelector('.modal-dots');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    
    let currentRoom = null;
    let currentImageIndex = 0;
    let roomImages = [];
    
    // Открытие модального окна при клике на карточку комнаты
    document.querySelectorAll('.room-card').forEach(card => {
        card.addEventListener('click', function() {
            currentRoom = {
                title: this.dataset.room,
                area: this.dataset.area,
                desc: this.dataset.desc,
                images: JSON.parse(this.dataset.images)
            };
            
            roomImages = currentRoom.images;
            currentImageIndex = 0;
            
            openModal();
        });
    });
    
    function openModal() {
        updateModalImage();
        updateModalInfo();
        createDots();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function updateModalImage() {
        modalImg.src = roomImages[currentImageIndex];
    }
    
    function updateModalInfo() {
        modalTitle.textContent = currentRoom.title;
        modalArea.textContent = currentRoom.area;
        modalDesc.textContent = currentRoom.desc;
    }
    
    function createDots() {
        modalDots.innerHTML = '';
        roomImages.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentImageIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentImageIndex = i;
                updateModalImage();
                updateDots();
            });
            modalDots.appendChild(dot);
        });
    }
    
    function updateDots() {
        const dots = modalDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentImageIndex);
        });
    }
    
    // Навигация в модальном окне
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + roomImages.length) % roomImages.length;
            updateModalImage();
            updateDots();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % roomImages.length;
            updateModalImage();
            updateDots();
        });
    }
    
    // Закрытие по крестику
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику вне изображения
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
        
        // Стрелки для навигации в модалке
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + roomImages.length) % roomImages.length;
                updateModalImage();
                updateDots();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % roomImages.length;
                updateModalImage();
                updateDots();
            }
        }
    });
});

// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ПЛАНИРОВКИ ==========
document.addEventListener('DOMContentLoaded', function() {
    const planThumb = document.querySelector('.layout-image img');
    const planModal = document.getElementById('planModal');
    const planModalImage = document.getElementById('planModalImage');
    const planModalClose = document.querySelector('.plan-modal-close');

    if (!planThumb || !planModal || !planModalImage || !planModalClose) return;

    function openPlanModal() {
        planModalImage.src = planThumb.src;
        planModalImage.alt = planThumb.alt || 'План квартиры';
        planModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closePlanModal() {
        planModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    planThumb.addEventListener('click', openPlanModal);
    planModalClose.addEventListener('click', closePlanModal);

    planModal.addEventListener('click', function(e) {
        if (e.target === planModal) {
            closePlanModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && planModal.style.display === 'block') {
            closePlanModal();
        }
    });
});

// ========== ИНТЕРАКТИВ БЛОКА ЖК ==========
document.addEventListener('DOMContentLoaded', function() {
    const buildingCards = document.querySelectorAll('.building-image[data-title]');
    const featureTitle = document.getElementById('buildingFeatureTitle');
    const featureDesc = document.getElementById('buildingFeatureDesc');

    if (!buildingCards.length || !featureTitle || !featureDesc) return;

    function activateCard(card) {
        buildingCards.forEach(item => item.classList.remove('building-image-active'));
        card.classList.add('building-image-active');
        featureTitle.textContent = card.dataset.title || '';
        featureDesc.textContent = card.dataset.desc || '';
    }

    buildingCards.forEach(card => {
        card.addEventListener('click', () => activateCard(card));
        card.addEventListener('mouseenter', () => activateCard(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateCard(card);
            }
        });
    });
});

// ========== АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
const animateElements = document.querySelectorAll('.animate-fadein, .animate-slideup');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animateElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// ========== ПОДСВЕТКА ТЕКУЩЕГО РАЗДЕЛА ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== ОБРАБОТКА КЛИКОВ ПО КНОПКАМ ==========
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // Для tel: и mailto: и https: оставляем стандартное поведение
    });
});
// ========== НАВИГАЦИОННОЕ МЕНЮ ==========
// Подсветка активного пункта меню при скролле
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Изменение фона меню при скролле
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Мобильное меню
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ================================================
// SRI AAKANKSHA NURSERY - MAIN SCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavbar();
    initHeroSlider();
    initScrollReveal();
    initPlantsFilter();
    populatePlantsGrid();
    populateLandscapingGrids();
    populateGalleryGrids();
    initGalleryTabs();
    initLandscapingAnimation();
    initContactAnimation();
    
    // Check hash and navigate on load
    handleHashNavigation();
});

/* -------- ROUTING SYSTEM -------- */
function navigateTo(pageId, category = null) {
    // Prevent default anchor behavior issues
    event?.preventDefault();
    
    // Update hash
    if (category) {
        history.pushState(null, null, `#${pageId}?cat=${category}`);
    } else {
        history.pushState(null, null, `#${pageId}`);
    }

    // Update active nav-link state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });

    // Hide all pages, show target page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Scroll to top or specific section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Handle sub-categories (like plants filter or gallery tabs)
        setTimeout(() => {
            if (pageId === 'varieties' && category) {
                const btn = document.querySelector(`.varieties-filter-pill[data-filter="${category}"]`);
                if (btn) btn.click();
                const sectionHeader = document.querySelector('#page-varieties .varieties-collection-title');
                if(sectionHeader) sectionHeader.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
            if (pageId === 'gallery' && category) {
                if (category === 'loadings') {
                    const loadingSec = document.getElementById('gallery-loadings');
                    if (loadingSec) loadingSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (category === 'photos') {
                    const photosSec = document.getElementById('photosGrid');
                    if (photosSec) photosSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (pageId === 'landscaping') {
                triggerLandscapingAnimation();
            }
            if (pageId === 'contact') {
                triggerContactAnimation();
            }
        }, 300); // Wait for page to display
        
        // trigger scroll reveal immediately for the new page
        initScrollReveal();
    }
    
    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

function handleHashNavigation() {
    const hash = window.location.hash.substring(1);
    if (!hash) {
        navigateTo('home');
        return;
    }
    
    const [pageId, query] = hash.split('?');
    let category = null;
    
    if (query && query.startsWith('cat=')) {
        category = query.split('=')[1];
    }
    
    navigateTo(pageId || 'home', category);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', handleHashNavigation);

/* -------- NAVBAR -------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const dropdowns = document.querySelectorAll('.has-dropdown');

    // Sticky navbar effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Mobile dropdowns
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If clicking varieties/gallery directly, don't prevent navigation, but open dropdown too
                if(!dropdown.classList.contains('open')){
                    e.preventDefault();
                    // Close others
                    dropdowns.forEach(d => { if(d !== dropdown) d.classList.remove('open') });
                    dropdown.classList.add('open');
                }
            }
        });
    });
}

/* -------- HERO SLIDER -------- */
let currentSlide = 0;
let slideInterval;
const slideDuration = 6000;

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    
    // Ensure first dot and image are actively set
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    currentSlide = 0;
    
    // Text animation for first slide
    animateHeroText();
    
    startSlideInterval();
}

function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, slideDuration);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    if (currentSlide === 0) {
        animateHeroText();
    }
    
    startSlideInterval(); // Reset timer
}

function goToSlide(index) {
    if (index === currentSlide) return;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    if (currentSlide === 0) {
        animateHeroText();
    }
    
    startSlideInterval();
}

function animateHeroText() {
    // Reset animations by cloning nodes
    const lines = ['.hero-line-1', '.hero-line-2'];
    lines.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
            
            // Wrap text in letters for staggered effect later if needed
            // Currently using CSS whole line slide animation
        }
    });
}

/* -------- SCROLL REVEAL -------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger once on load for elements already in view
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}

/* -------- DATA SETS IDEALIZATION -------- */
// Simulated data based on user instructions

// Varieties
const plantsData = [
    // Outdoor (47-75, 113-117)
    ...Array.from({length: 29}, (_, i) => ({ id: `out${i+1}`, src: `images/outdoor-${47+i}.webp`, category: 'outdoor' })),
    ...Array.from({length: 5}, (_, i) => ({ id: `out${i+30}`, src: `images/outdoor-${113+i}.webp`, category: 'outdoor' })),
    // Indoor (132-136)
    ...Array.from({length: 5}, (_, i) => ({ id: `ind${i+1}`, src: `images/indoor-${132+i}.webp`, category: 'indoor' })),
    // Flowering (102-112, 118-131, 97-101)
    ...Array.from({length: 11}, (_, i) => ({ id: `flo${i+1}`, src: `images/flowering-${102+i}.webp`, category: 'flowering' })),
    ...Array.from({length: 14}, (_, i) => ({ id: `flo${i+12}`, src: `images/flowering-${118+i}.webp`, category: 'flowering' })),
    ...Array.from({length: 5}, (_, i) => ({ id: `flo${i+26}`, src: `images/flowering-${97+i}.webp`, category: 'flowering' })),
    // Fruit (76-94)
    ...Array.from({length: 19}, (_, i) => ({ id: `fru${i+1}`, src: `images/fruit-${76+i}.webp`, category: 'fruit' })),
    // Ficus (137-145)
    ...Array.from({length: 9}, (_, i) => ({ id: `fic${i+1}`, src: `images/ficus-${137+i}.webp`, category: 'ficus' })),
    // Olive (146-149)
    ...Array.from({length: 4}, (_, i) => ({ id: `oli${i+1}`, src: `images/olive-${146+i}.webp`, category: 'olive' }))
];

// Landscaping
const wallGardenData = Array.from({length: 3}, (_, i) => `images/wall-garden-${30+i}.webp`);
const gardenData = ['images/garden-29.webp', ...Array.from({length: 11}, (_, i) => `images/garden-${33+i}.webp`), 'images/garden-96.webp'];
const lawnData = Array.from({length: 3}, (_, i) => `images/lawn-${44+i}.webp`);

// Gallery Photos (Approved 176.png - 188.png)
const galleryPhotos = [
    '176.png', '177.png', '178.png', '179.png', '180.png',
    '181.png', '182.png', '183.png', '184.png', '185.png',
    '186.png', '187.png', '188.png'
];
const galleryLoadings = ['images/loading-0.webp', 'images/loading-1.webp', ...Array.from({length: 11}, (_, i) => `images/loading-${2+i}.webp`), 'images/loading-24.webp'];

/* -------- VARIETIES -------- */
function initPlantsFilter() {
    const buttons = document.querySelectorAll('.varieties-filter-pill');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter grid
            const category = btn.getAttribute('data-filter');
            filterPlantsGrid(category);
        });
    });
}

function populatePlantsGrid() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // initially show sample or all
    let toShow = plantsData;
    // to prevent freezing, limit initial load to 40 items if 'all'
    if (toShow.length > 40) toShow = toShow.slice(0, 40);
    
    renderPlantCards(grid, toShow);
}

function filterPlantsGrid(category) {
    const grid = document.getElementById('plantsGrid');
    grid.innerHTML = '';
    
    let filtered = category === 'all' ? plantsData : plantsData.filter(p => p.category === category);
    
    // limit if too many to keep UI smooth
    if (category === 'all' && filtered.length > 40) filtered = filtered.slice(0, 40);
    
    renderPlantCards(grid, filtered);
}

const categoryNames = {
    outdoor: 'Outdoor Plant',
    indoor: 'Indoor Plant',
    flowering: 'Flowering Plant',
    fruit: 'Fruit Plant',
    ficus: 'Ficus',
    olive: 'Olive'
};

function renderPlantCards(container, data) {
    data.forEach((plant, index) => {
        const card = document.createElement('div');
        card.className = 'varieties-card stagger-item';
        card.style.transitionDelay = `${(index % 12) * 50}ms`;
        const catName = categoryNames[plant.category] || plant.category;
        card.innerHTML = `
            <div class="varieties-card-img-wrap">
                <img src="${plant.src}" alt="${catName}" loading="lazy" onerror="this.onerror=null; this.closest('.varieties-card').style.display='none';">
                <div class="varieties-card-overlay">
                    <span class="varieties-card-zoom">🔍</span>
                </div>
            </div>
            <div class="varieties-card-body">
                <span class="varieties-card-cat">${catName}</span>
                <a href="https://wa.me/919390599799?text=Hi%2C%20I%20am%20interested%20in%20this%20${encodeURIComponent(catName)}%20from%20Sri%20Akshaya%20Nursery." target="_blank" class="varieties-card-quote" onclick="event.stopPropagation();">Get Quote</a>
            </div>`;
        
        card.addEventListener('click', () => openLightbox(plant.src, getGalleryImagesList(container)));
        container.appendChild(card);
    });
    
    // Trigger animation for newly added items
    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach(el => {
            el.classList.add('visible');
        });
    }, 50);
}

/* -------- LANDSCAPING -------- */
function populateLandscapingGrids() {
    const fillGrid = (id, dataList) => {
        const grid = document.getElementById(id);
        if (!grid) return;
        dataList.forEach((src, index) => {
            const card = document.createElement('div');
            card.className = 'service-card stagger-item reveal-up';
            card.style.transitionDelay = `${(index % 4) * 100}ms`;
            card.innerHTML = `<img src="${src}" alt="Landscaping service" loading="lazy" onerror="this.onerror=null; this.parentElement.style.display='none';">`;
            
            card.addEventListener('click', () => openLightbox(src, getGalleryImagesList(grid)));
            grid.appendChild(card);
        });
    };
    
    fillGrid('wallGardenGrid', wallGardenData);
    fillGrid('gardenGrid', gardenData);
    fillGrid('lawnGrid', lawnData);
}

function initLandscapingAnimation() {
    const title = document.getElementById('landscapingHeroTitle');
    if (!title) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                title.classList.add('animated');
            }
        });
    }, { threshold: 0.15 });

    observer.observe(title);
}

function triggerLandscapingAnimation() {
    const title = document.getElementById('landscapingHeroTitle');
    if (!title) return;
    title.classList.remove('animated');
    void title.offsetWidth; // Force CSS reflow
    setTimeout(() => {
        title.classList.add('animated');
    }, 50);
}

function initContactAnimation() {
    const title = document.getElementById('contactHeroTitle');
    if (!title) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                title.classList.add('animated');
            }
        });
    }, { threshold: 0.15 });

    observer.observe(title);
}

function triggerContactAnimation() {
    const title = document.getElementById('contactHeroTitle');
    if (!title) return;
    title.classList.remove('animated');
    void title.offsetWidth; // Force CSS reflow
    setTimeout(() => {
        title.classList.add('animated');
    }, 50);
}

/* -------- GALLERY -------- */
function initGalleryTabs() {
    const tabs = document.querySelectorAll('.gallery-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding section
            const targetId = `gallery-${tab.getAttribute('data-gallery')}`;
            document.querySelectorAll('.gallery-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Retrigger scroll animations in this section
            setTimeout(() => {
                document.getElementById(targetId).querySelectorAll('.stagger-item').forEach(el => el.classList.add('visible'));
            }, 50);
        });
    });
}

function populateGalleryGrids() {
    // 1. Botanical Photos Grid (176.png - 188.png)
    const photosGrid = document.getElementById('photosGrid');
    if (photosGrid) {
        const photoItems = photosGrid.querySelectorAll('.botanical-gallery-item');
        photoItems.forEach((card) => {
            card.addEventListener('click', () => {
                const src = card.getAttribute('data-src') || card.querySelector('img').src;
                const title = card.getAttribute('data-title') || 'Sri Akshaya Nursery Greenery';
                const category = card.getAttribute('data-category') || '🌿 Plant Photography';
                openLightbox(src, galleryPhotos, title, category);
            });
        });
    }
    
    // 2. Loading Plants Grid (Restored Nursery Operations)
    const loadingsGrid = document.getElementById('loadingsGrid');
    if (loadingsGrid) {
        loadingsGrid.innerHTML = '';
        galleryLoadings.forEach((src, index) => {
            const card = document.createElement('div');
            card.className = 'loading-card stagger-item';
            card.style.transitionDelay = `${(index % 6) * 70}ms`;
            card.innerHTML = `
                <div class="loading-img-wrap">
                    <img src="${src}" alt="Plant Loading & Dispatch at Sri Akshaya Nursery" loading="lazy" onerror="this.onerror=null; this.parentElement.parentElement.style.display='none';">
                    <div class="loading-overlay">
                        <span class="loading-tag">🚛 Nursery Dispatch #${index + 1}</span>
                        <span class="loading-zoom-icon"><i class="fas fa-search-plus"></i></span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                openLightbox(src, galleryLoadings, `Plant Dispatch & Transportation #${index + 1}`, '🚛 Daily Loadings');
            });
            loadingsGrid.appendChild(card);
        });
    }
}

/* -------- LIGHTBOX & MODALS -------- */
let currentLightboxList = [];
let currentLightboxIdx = 0;
let currentLightboxTitles = {};

function getNormalizedBasename(url) {
    if (!url) return '';
    return url.split('?')[0].split('#')[0].split('/').pop();
}

function openLightbox(src, list, title = '', category = '') {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');
    const counterEl = document.getElementById('lightboxCounter');
    
    currentLightboxList = list;
    const targetBase = getNormalizedBasename(src);
    currentLightboxIdx = list.findIndex(item => getNormalizedBasename(item) === targetBase);
    if (currentLightboxIdx === -1) currentLightboxIdx = 0;
    
    img.src = currentLightboxList[currentLightboxIdx];
    
    if (captionEl) captionEl.textContent = title;
    if (counterEl) counterEl.textContent = `${currentLightboxIdx + 1} / ${currentLightboxList.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close on background click
    lightbox.onclick = (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    };
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    if (currentLightboxList.length <= 1) return;
    
    const img = document.getElementById('lightboxImg');
    const counterEl = document.getElementById('lightboxCounter');
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
        currentLightboxIdx = (currentLightboxIdx + dir + currentLightboxList.length) % currentLightboxList.length;
        img.src = currentLightboxList[currentLightboxIdx];
        if (counterEl) counterEl.textContent = `${currentLightboxIdx + 1} / ${currentLightboxList.length}`;
        
        img.onload = () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        };
    }, 180);
}

// Touch swipe navigation for Lightbox
let touchStartX = 0;
const lightboxElem = document.getElementById('lightbox');
if (lightboxElem) {
    lightboxElem.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightboxElem.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 45) lightboxNav(1);
        if (touchEndX > touchStartX + 45) lightboxNav(-1);
    }, { passive: true });
}

function openVideoModal(src) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    video.src = src;
    modal.classList.add('active');
    video.play().catch(e => console.log('Autoplay prevented:', e));
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    modal.classList.remove('active');
    video.pause();
    video.src = '';
    document.body.style.overflow = '';
}

// Keyboard navigation for lightbox
window.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft') lightboxNav(-1);
    }
    if (document.getElementById('videoModal').classList.contains('active')) {
        if (e.key === 'Escape') closeVideoModal();
    }
});

/* -------- CONTACT FORM -------- */
function handleContactSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #128C7E, #25D366)';
        e.target.reset();
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 1500);
}

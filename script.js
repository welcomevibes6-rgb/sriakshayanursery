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
    initHomeFruitShowcase();
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
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .stagger-item');
    
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

// Comprehensive Verified Fruit Plants Collection (189 - 264 + catalog)
const verifiedFruitPlants = [
    { id: 'fru-247', src: '247.png', name: 'Thailand Mango', variety: 'Exotic Mango', category: 'fruit' },
    { id: 'fru-246', src: '246.png', name: 'Himayat Mango', variety: 'Royal Heritage', category: 'fruit' },
    { id: 'fru-248', src: '248.png', name: 'Thailand Mango (All-Season)', variety: 'Grafted Sapling', category: 'fruit' },
    { id: 'fru-250', src: '250.png', name: 'Danimma / Pomegranate', variety: 'Bhagwa Red Selection', category: 'fruit' },
    { id: 'fru-252', src: '252.png', name: 'Jama / Guava', variety: 'High-Yield Guava', category: 'fruit' },
    { id: 'fru-263', src: '263.png', name: 'Miyazaki Mango', variety: 'Egg of the Sun', category: 'fruit' },
    { id: 'fru-264', src: '264.png', name: 'Alphonso Mango', variety: 'Ratnagiri Hapus', category: 'fruit' },
    { id: 'fru-189', src: '189.png', name: '4 Season Longan', variety: 'Dragon Eye Fruit', category: 'fruit' },
    { id: 'fru-191', src: '191.png', name: 'Avocado', variety: 'Butter Fruit', category: 'fruit' },
    { id: 'fru-192', src: '192.png', name: 'Abiu Fruit', variety: 'Exotic Tropical Delicacy', category: 'fruit' },
    { id: 'fru-190', src: '190.png', name: 'Mamey Sapote', variety: 'Exotic Sapote', category: 'fruit' },
    { id: 'fru-194', src: '194.png', name: 'Black Jamun', variety: 'Big Berry Naval Pazham', category: 'fruit' },
    { id: 'fru-195', src: '195.png', name: 'Almond / Badam', variety: 'Nut Tree Cultivar', category: 'fruit' },
    { id: 'fru-196', src: '196.png', name: 'Exotic Purple Mango', variety: 'Blush Mango', category: 'fruit' },
    { id: 'fru-197', src: '197.png', name: 'Apricot / Peach', variety: 'Temperate Fruit Selection', category: 'fruit' },
    { id: 'fru-198', src: '198.png', name: 'Hass Avocado', variety: 'Grafted Butter Fruit', category: 'fruit' },
    { id: 'fru-199', src: '199.png', name: 'Sapota / Chiku', variety: 'Cricket Ball Variety', category: 'fruit' },
    { id: 'fru-200', src: '200.png', name: 'Banganapalli Mango', variety: 'Benishan King', category: 'fruit' },
    { id: 'fru-201', src: '201.png', name: 'Seethaphal / Custard Apple', variety: 'Sugar Apple Cultivar', category: 'fruit' },
    { id: 'fru-202', src: '202.png', name: 'Bhagwa Pomegranate', variety: 'Ruby Red Arils', category: 'fruit' },
    { id: 'fru-203', src: '203.png', name: 'Purple Mango', variety: 'Rare Exotic Specimen', category: 'fruit' },
    { id: 'fru-204', src: '204.png', name: 'Mahachanok / Banana Mango', variety: 'Rainbow Mango', category: 'fruit' },
    { id: 'fru-205', src: '205.png', name: 'Sweet Mango', variety: 'Aromatic Table Fruit', category: 'fruit' },
    { id: 'fru-206', src: '206.png', name: 'Golden Alphonso Mango', variety: 'Hapus Cultivar', category: 'fruit' },
    { id: 'fru-210', src: '210.png', name: 'Ruby Blush Mango', variety: 'Exotic Hybrid', category: 'fruit' },
    { id: 'fru-215', src: '215.png', name: 'Australian Purple Mango', variety: 'Specimen Mango', category: 'fruit' },
    { id: 'fru-220', src: '220.png', name: 'Mamey Sapote (Magana)', variety: 'Red-Flesh Sapote', category: 'fruit' },
    { id: 'fru-225', src: '225.png', name: 'Kagzi Lime / Lemon', variety: 'High-Yield Lemon', category: 'fruit' },
    { id: 'fru-230', src: '230.png', name: 'Longan Fruit Clusters', variety: 'All-Season Longan', category: 'fruit' },
    { id: 'fru-235', src: '235.png', name: 'Jamun / Blackberry', variety: 'Syzygium cumini', category: 'fruit' },
    { id: 'fru-245', src: '245.png', name: 'Punasa Mango (All-Season)', variety: 'Year-Round Bearer', category: 'fruit' },
    { id: 'fru-249', src: '249.png', name: 'Jama / Guava Saplings', variety: 'Field Nursery Stock', category: 'fruit' },
    { id: 'fru-251', src: '251.png', name: 'Guava Plant (Fruit-Bearing)', variety: 'Grafted Guava', category: 'fruit' },
    { id: 'fru-253', src: '253.png', name: 'Miyazaki Mango Saplings', variety: 'Authentic Variety', category: 'fruit' },
    { id: 'fru-254', src: '254.png', name: 'Taiwan Guava (Jama)', variety: 'Crisp Jumbo Fruit', category: 'fruit' },
    { id: 'fru-255', src: '255.png', name: 'Panasa / Jackfruit Saplings', variety: 'All-Season Jackfruit', category: 'fruit' },
    { id: 'fru-256', src: '256.png', name: 'Grafted Mango Plant', variety: 'Acclimatized Rootstock', category: 'fruit' },
    { id: 'fru-257', src: '257.png', name: 'Jackfruit Saplings', variety: 'High-Yield Jackfruit', category: 'fruit' },
    { id: 'fru-258', src: '258.png', name: 'Ambarella / Hog Plum', variety: 'Container Fruit Tree', category: 'fruit' },
    { id: 'fru-259', src: '259.png', name: 'Ruby Red Guava (Lal Jamun)', variety: 'Pink Flesh Guava', category: 'fruit' },
    { id: 'fru-260', src: '260.png', name: 'Guava Plant Saplings', variety: 'Field Nursery Rows', category: 'fruit' },
    { id: 'fru-261', src: '261.png', name: 'Taiwan Guava Plant', variety: 'Commercial Grade', category: 'fruit' },
    { id: 'fru-262', src: '262.png', name: 'Katimon Mango', variety: 'All-Time Sweet Mango', category: 'fruit' }
];

// Varieties
const plantsData = [
    // Verified Real Fruit Plants First
    ...verifiedFruitPlants,
    // Outdoor (47-75, 113-117)
    ...Array.from({length: 29}, (_, i) => ({ id: `out${i+1}`, src: `images/outdoor-${47+i}.webp`, name: `Outdoor Plant #${i+1}`, category: 'outdoor' })),
    ...Array.from({length: 5}, (_, i) => ({ id: `out${i+30}`, src: `images/outdoor-${113+i}.webp`, name: `Outdoor Specimen #${i+30}`, category: 'outdoor' })),
    // Indoor (132-136)
    ...Array.from({length: 5}, (_, i) => ({ id: `ind${i+1}`, src: `images/indoor-${132+i}.webp`, name: `Indoor Plant #${i+1}`, category: 'indoor' })),
    // Flowering (102-112, 118-131, 97-101)
    ...Array.from({length: 11}, (_, i) => ({ id: `flo${i+1}`, src: `images/flowering-${102+i}.webp`, name: `Flowering Plant #${i+1}`, category: 'flowering' })),
    ...Array.from({length: 14}, (_, i) => ({ id: `flo${i+12}`, src: `images/flowering-${118+i}.webp`, name: `Flowering Variety #${i+12}`, category: 'flowering' })),
    ...Array.from({length: 5}, (_, i) => ({ id: `flo${i+26}`, src: `images/flowering-${97+i}.webp`, name: `Blossom Plant #${i+26}`, category: 'flowering' })),
    // Catalog Fruit (76-94)
    ...Array.from({length: 19}, (_, i) => ({ id: `fru-cat-${i+1}`, src: `images/fruit-${76+i}.webp`, name: `Fruit Plant #${i+1}`, category: 'fruit' })),
    // Ficus (137-145)
    ...Array.from({length: 9}, (_, i) => ({ id: `fic${i+1}`, src: `images/ficus-${137+i}.webp`, name: `Ficus Tree #${i+1}`, category: 'ficus' })),
    // Olive (146-149)
    ...Array.from({length: 4}, (_, i) => ({ id: `oli${i+1}`, src: `images/olive-${146+i}.webp`, name: `Specimen Olive #${i+1}`, category: 'olive' }))
];

// Landscaping
const wallGardenData = Array.from({length: 3}, (_, i) => `images/wall-garden-${30+i}.webp`);
const gardenData = ['images/garden-29.webp', ...Array.from({length: 11}, (_, i) => `images/garden-${33+i}.webp`), 'images/garden-96.webp'];
const lawnData = Array.from({length: 3}, (_, i) => `images/lawn-${44+i}.webp`);

// Gallery Photos (Updated with 236.png - 244.png)
const galleryPhotos = [
    '236.png', '237.png', '238.png', '239.png', '240.png',
    '241.png', '242.png', '243.png', '244.png'
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

function getGalleryImagesList(container) {
    if (!container) return [];
    const imgs = container.querySelectorAll('.varieties-card img, .fruit-card img, .botanical-gallery-item img, .loading-card img');
    return Array.from(imgs).map(img => img.getAttribute('data-src') || img.src).filter(Boolean);
}

function populatePlantsGrid() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // initially show sample or all
    let toShow = plantsData;
    // to prevent freezing, limit initial load to 50 items if 'all'
    if (toShow.length > 50) toShow = toShow.slice(0, 50);
    
    renderPlantCards(grid, toShow);
}

function filterPlantsGrid(category) {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    let filtered = category === 'all' ? plantsData : plantsData.filter(p => p.category === category);
    
    // limit if all to keep UI smooth
    if (category === 'all' && filtered.length > 50) filtered = filtered.slice(0, 50);
    
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
        const displayName = plant.name || catName;
        const subtitle = plant.variety ? `<div class="varieties-card-sub"><span class="sub-leaf">🌿</span> ${plant.variety}</div>` : '';
        
        card.innerHTML = `
            <div class="varieties-card-img-wrap">
                <img src="${plant.src}" alt="${displayName}" loading="lazy" onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='true'; if(this.src.indexOf('image copy') === -1 && this.src.indexOf('/') === -1) { this.src='image copy ' + this.src; return; } } this.closest('.varieties-card').style.display='none';">
                <div class="varieties-card-overlay">
                    <span class="varieties-card-zoom"><i class="fas fa-search-plus"></i></span>
                </div>
            </div>
            <div class="varieties-card-body">
                <span class="varieties-card-cat">${catName}</span>
                <h4 class="varieties-card-title">${displayName}</h4>
                ${subtitle}
                <a href="https://wa.me/919581084942?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(displayName)}%20(${encodeURIComponent(catName)})%20from%20Sri%20Akshaya%20Nursery." target="_blank" rel="noopener noreferrer" class="varieties-card-quote" onclick="event.stopPropagation();">
                    <i class="fab fa-whatsapp"></i> Get Quote
                </a>
            </div>`;
        
        // Fix plant card click functionality to open lightbox reliably
        card.addEventListener('click', () => {
            const itemsList = data.map(item => ({
                src: item.src,
                title: item.name || categoryNames[item.category] || 'Sri Akshaya Nursery Plant',
                category: categoryNames[item.category] || '🪴 Plants',
                variety: item.variety || ''
            }));
            openLightbox(plant.src, itemsList, displayName, catName);
        });
        container.appendChild(card);
    });
    
    // Trigger animation for newly added items
    setTimeout(() => {
        container.querySelectorAll('.stagger-item').forEach(el => {
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
    // 1. Botanical Photos Grid (236.png - 244.png)
    const photosGrid = document.getElementById('photosGrid');
    if (photosGrid) {
        const photoItems = photosGrid.querySelectorAll('.botanical-gallery-item');
        photoItems.forEach((card, idx) => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const src = card.getAttribute('data-src') || (img ? img.getAttribute('src') : galleryPhotos[idx]);
                const title = card.getAttribute('data-title') || 'Sri Akshaya Nursery Greenery';
                const category = card.getAttribute('data-category') || '🌿 Plant Photography';
                
                const galleryItems = Array.from(photoItems).map((pCard, pIdx) => {
                    const pImg = pCard.querySelector('img');
                    return {
                        src: pCard.getAttribute('data-src') || (pImg ? pImg.getAttribute('src') : galleryPhotos[pIdx]),
                        title: pCard.getAttribute('data-title') || 'Sri Akshaya Nursery Greenery',
                        category: pCard.getAttribute('data-category') || '🌿 Plant Photography'
                    };
                });
                
                openLightbox(src, galleryItems, title, category);
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
                const loadingsItems = galleryLoadings.map((lSrc, lIdx) => ({
                    src: lSrc,
                    title: `Plant Dispatch & Transportation #${lIdx + 1}`,
                    category: '🚛 Daily Loadings'
                }));
                openLightbox(src, loadingsItems, `Plant Dispatch & Transportation #${index + 1}`, '🚛 Daily Loadings');
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
    
    if (!lightbox || !img) return;
    
    currentLightboxList = Array.isArray(list) && list.length > 0 ? list : [src];
    const targetBase = getNormalizedBasename(src);
    
    currentLightboxIdx = currentLightboxList.findIndex(item => {
        const itemSrc = typeof item === 'object' ? item.src : item;
        return getNormalizedBasename(itemSrc) === targetBase;
    });
    if (currentLightboxIdx === -1) currentLightboxIdx = 0;
    
    const activeItem = currentLightboxList[currentLightboxIdx];
    const activeSrc = typeof activeItem === 'object' ? activeItem.src : activeItem;
    const activeTitle = typeof activeItem === 'object' ? (activeItem.title || title) : title;
    
    img.src = activeSrc;
    
    if (captionEl) captionEl.textContent = activeTitle || 'Sri Akshaya Nursery';
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
    if (!currentLightboxList || currentLightboxList.length <= 1) return;
    
    const img = document.getElementById('lightboxImg');
    const counterEl = document.getElementById('lightboxCounter');
    const captionEl = document.getElementById('lightboxCaption');
    
    if (!img) return;
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
        currentLightboxIdx = (currentLightboxIdx + dir + currentLightboxList.length) % currentLightboxList.length;
        const currentItem = currentLightboxList[currentLightboxIdx];
        const nextSrc = typeof currentItem === 'object' ? currentItem.src : currentItem;
        const nextTitle = typeof currentItem === 'object' ? (currentItem.title || '') : (currentLightboxTitles[nextSrc] || '');
        
        img.src = nextSrc;
        if (counterEl) counterEl.textContent = `${currentLightboxIdx + 1} / ${currentLightboxList.length}`;
        if (captionEl && nextTitle) captionEl.textContent = nextTitle;
        
        img.onload = () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        };
    }, 180);
}

/* -------- NEW HOME FRUIT SHOWCASE -------- */
function initHomeFruitShowcase() {
    const showcaseGrid = document.getElementById('featuredFruitGrid');
    if (!showcaseGrid) return;
    
    const fruitCards = showcaseGrid.querySelectorAll('.fruit-card');
    const featuredItems = Array.from(fruitCards).map(card => {
        const img = card.querySelector('img');
        return {
            src: card.getAttribute('data-src') || (img ? img.getAttribute('src') : ''),
            title: card.getAttribute('data-name') || 'Fruit Plant',
            category: card.getAttribute('data-cat') || 'Fruit Plant'
        };
    });
    
    fruitCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const src = card.getAttribute('data-src') || (img ? img.getAttribute('src') : '');
            const name = card.getAttribute('data-name') || 'Fruit Plant';
            const cat = card.getAttribute('data-cat') || 'Fruit Plant';
            openLightbox(src, featuredItems, name, cat);
        });
    });
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

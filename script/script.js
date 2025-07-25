// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Hamburger menu functionality
let scrollPosition = 0;
function toggleMenu(event) {
    // Prevent default behavior to avoid any unwanted scrolling
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const menuOverlay = document.querySelector('.menu-overlay');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
    if (menuOverlay) {
        menuOverlay.classList.toggle('active');
    }
    if (body.classList.contains('menu-open')) {
        // Lock scroll position
        scrollPosition = window.scrollY || window.pageYOffset;
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100vw';
    } else {
        // Restore scroll position
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        
        // Use requestAnimationFrame for smoother scroll restoration
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
        });
        
        // Ensure navbar stays fixed on mobile, sticky on desktop
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                navbar.style.position = 'fixed';
                navbar.style.top = '0';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.zIndex = '1000';
            } else {
                navbar.style.position = 'sticky';
                navbar.style.top = '0';
                navbar.style.left = '';
                navbar.style.right = '';
                navbar.style.zIndex = '100';
            }
        }
    }
}

// Scroll Animation
function handleScrollAnimation() {
    const sections = document.querySelectorAll('.section, .product-card');
    let prevYPosition = window.pageYOffset;
    
    const observer = new IntersectionObserver((entries) => {
        const currentYPosition = window.pageYOffset;
        const isScrollingUp = currentYPosition < prevYPosition;
        prevYPosition = currentYPosition;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else if (isScrollingUp) {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-50px' // Adds a small threshold before triggering
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }

    // Add click event listener for theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Add click event listener for hamburger menu
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', (event) => toggleMenu(event));

    // Navigation functionality
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');

    function setActiveSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
            if (section.id === sectionId) {
                section.classList.remove('hidden');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu after navigation
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Restore scroll position and unlock body if on mobile
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        
        // Scroll to top of the new section instead of restoring previous position
        window.scrollTo(0, 0);
        
        const menuOverlay = document.querySelector('.menu-overlay');
        if (menuOverlay) menuOverlay.classList.remove('active');
        
        // Ensure navbar stays fixed on mobile, sticky on desktop
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                navbar.style.position = 'fixed';
                navbar.style.top = '0';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.zIndex = '1000';
            } else {
                navbar.style.position = 'sticky';
                navbar.style.top = '0';
                navbar.style.left = '';
                navbar.style.right = '';
                navbar.style.zIndex = '100';
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            setActiveSection(sectionId);
        });
    });

    // Generate product cards
    function createProductCard(product, isRobuxPackage = false) {
        const card = document.createElement('div');
        card.className = 'product-card' + (product.featured ? ' featured' : '');

        if (product.featured) {
            const badge = document.createElement('div');
            badge.className = 'featured-badge';
            badge.textContent = 'Popular';
            card.appendChild(badge);
        }

        if (product.bestValue) {
            const badge = document.createElement('div');
            badge.className = 'best-value-badge';
            badge.textContent = 'Best Value';
            card.appendChild(badge);
        }

        if (isRobuxPackage) {
            const package = document.createElement('div');
            package.className = 'robux-package';
            package.innerHTML = `
                <span class="package-icon"></span>
                <div class="robux-amount">${product.amount}</div>
                <div class="gamepass-price">GP: ${product.gamepassPrice}</div>
                <div class="peso-amount">₱${product.pesoPrice.toFixed(2)}</div>
            `;
            card.appendChild(package);
        } else {
            const icon = document.createElement('span');
            icon.className = `product-icon icon-${product.icon}`;
            card.appendChild(icon);

            const name = document.createElement('h3');
            name.className = 'product-name';
            name.textContent = product.name;
            card.appendChild(name);

            const price = document.createElement('div');
            price.className = 'product-price';
            price.innerHTML = `<span class="robux-icon"></span>${product.price}`;
            card.appendChild(price);

            const pesoPrice = document.createElement('div');
            pesoPrice.className = 'peso-price';
            pesoPrice.textContent = `₱${product.pesoPrice.toFixed(2)}`;
            card.appendChild(pesoPrice);
        }

        return card;
    }

    function generateGameSection(gameData) {
        const section = document.createElement('div');
        section.className = 'game-category';
        section.id = gameData.id; // Add ID for targeting
        
        section.innerHTML = `
            <h2 class="game-title">
                <img src="images/${gameData.logo}" alt="${gameData.name}" class="game-title-logo">
                ${gameData.name}
            </h2>
        `;

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        gameData.products.forEach(product => {
            grid.appendChild(createProductCard(product));
        });

        section.appendChild(grid);
        return section;
    }

    // Populate game sections
    const gamepassesSection = document.getElementById('gamepasses');
    
    // First remove the existing More Games section if it exists
    const existingMoreGames = gamepassesSection.querySelector('.game-category:last-child');
    if (existingMoreGames) {
        existingMoreGames.remove();
    }

    // Add all game sections
    STORE_DATA.games.forEach(game => {
        gamepassesSection.appendChild(generateGameSection(game));
    });

    // Add More Games section at the end
    const moreGamesSection = document.createElement('div');
    moreGamesSection.className = 'game-category';
    moreGamesSection.innerHTML = `
        <h2 class="game-title">
            <img src="images/joystick.png" alt="More Games" class="game-title-logo">
            More Games
        </h2>
        <div class="coming-soon">
            <h3>More Games Coming Soon!</h3>
            <p>Stay tuned for exciting new game passes from other popular games</p>
        </div>
    `;
    gamepassesSection.appendChild(moreGamesSection);

    // Populate Robux packages
    const robuxGrid = document.querySelector('#robux .product-grid');
    
    // Add title section for Robux packages
    const robuxTitle = document.createElement('div');
    robuxTitle.className = 'game-category';
    robuxTitle.innerHTML = `
        <h2 class="game-title">
            <img src="images/robux-white.png" alt="Covered Tax" class="game-title-logo">
            Covered Tax
        </h2>
    `;
    document.querySelector('#robux').insertBefore(robuxTitle, robuxGrid);

    // Populate packages
    STORE_DATA.robuxPackages.forEach(package => {
        robuxGrid.appendChild(createProductCard(package, true));
    });

    // Modal functionality
    const modal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');

    // Ensure modal is properly hidden on page load
    function initializeModal() {
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.style.visibility = 'hidden';
    }

    // Initialize modal on page load
    initializeModal();

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const isRobuxPackage = this.querySelector('.robux-package') !== null;
            
            if (isRobuxPackage) {
                const robuxAmount = this.querySelector('.robux-amount').textContent;
                const gamepassPrice = this.querySelector('.gamepass-price').textContent;
                const pesoAmount = this.querySelector('.peso-amount').textContent;
                
                modal.querySelector('.modal-product-name').textContent = `${robuxAmount} Robux`;
                modal.querySelector('.modal-product-price').innerHTML = 
                    `${pesoAmount} (<span class="robux-icon"></span>${gamepassPrice.replace('GP: ', '')})`;
                modal.querySelector('.modal-product-icon').className = 'modal-product-icon package-icon';
            } else {
                const productName = this.querySelector('.product-name').textContent;
                const productPrice = this.querySelector('.product-price').textContent.trim().match(/\d+/)[0];
                const pesoPrice = this.querySelector('.peso-price').textContent;
                const productIcon = this.querySelector('.product-icon').className;

                modal.querySelector('.modal-product-name').textContent = productName;
                modal.querySelector('.modal-product-price').innerHTML = 
                    `<span class="robux-icon"></span>${productPrice} (${pesoPrice})`;
                modal.querySelector('.modal-product-icon').className = 'modal-product-icon ' + productIcon;
            }

            // Show modal
            modal.style.visibility = 'visible';
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });
    });

    function hideModal() {
        modal.classList.add('hiding');
        setTimeout(() => {
            modal.classList.remove('show', 'hiding');
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
        }, 200); // Match the animation duration
    }

    closeModal.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        hideModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Prevent clicks inside modal from closing it
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Scroll animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .product-card').forEach(element => {
        observer.observe(element);
    });

    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            // Close menu if overlay is clicked
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuOverlay.classList.remove('active');
            // Restore scroll position
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
            
            // Ensure navbar stays fixed on mobile, sticky on desktop
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    navbar.style.position = 'fixed';
                    navbar.style.top = '0';
                    navbar.style.left = '0';
                    navbar.style.right = '0';
                    navbar.style.zIndex = '1000';
                } else {
                    navbar.style.position = 'sticky';
                    navbar.style.top = '0';
                    navbar.style.left = '';
                    navbar.style.right = '';
                    navbar.style.zIndex = '100';
                }
            }
        });
    }

    // Add category navigation functionality
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            const targetSection = document.getElementById(categoryId);
            
            if (targetSection) {
                // Get navbar height for offset (account for fixed navbar on mobile)
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? navbarHeight + 20 : navbarHeight + 20; // Extra offset for mobile
                
                // Get the exact position of the target section
                const targetPosition = targetSection.offsetTop - offset;
                
                // Smooth scroll to the exact location
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add smooth scrolling for main navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                // Get navbar height for offset (account for fixed navbar on mobile)
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? navbarHeight + 20 : navbarHeight + 20; // Extra offset for mobile
                
                // Get the exact position of the target section
                const targetPosition = targetSection.offsetTop - offset;
                
                // Smooth scroll to the exact location
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active section and close mobile menu
                setActiveSection(sectionId);
            }
        });
    });
});
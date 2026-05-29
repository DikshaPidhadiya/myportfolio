const hero3d = document.querySelector('.hero-3d');
const THREE = window.THREE;

function setupFallbackHero() {
    if (!hero3d) {
        return;
    }

    hero3d.classList.add('hero-3d--fallback');
    hero3d.innerHTML = `
        <div class="hero-3d-fallback" aria-hidden="true">
            <span class="fallback-ring fallback-ring-1"></span>
            <span class="fallback-ring fallback-ring-2"></span>
            <span class="fallback-core"></span>
            <span class="fallback-orbit fallback-orbit-1"></span>
            <span class="fallback-orbit fallback-orbit-2"></span>
            <span class="fallback-particle fallback-particle-1"></span>
            <span class="fallback-particle fallback-particle-2"></span>
            <span class="fallback-particle fallback-particle-3"></span>
        </div>
    `;
}

if (hero3d && THREE) {
    // --- 3D Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(hero3d.clientWidth, hero3d.clientHeight);
    hero3d.appendChild(renderer.domElement);

    // Hero object
    const heroGroup = new THREE.Group();

    const frameGeometry = new THREE.BoxGeometry(12, 12, 0.7);
    const frameEdges = new THREE.EdgesGeometry(frameGeometry);
    const frameLines = new THREE.LineSegments(
        frameEdges,
        new THREE.LineBasicMaterial({ color: 0x1f7aff, transparent: true, opacity: 0.95 })
    );
    frameLines.rotation.z = -0.14;
    frameLines.scale.set(1.05, 1.05, 1);
    heroGroup.add(frameLines);

    const accentRing = new THREE.Mesh(
        new THREE.TorusGeometry(7.8, 0.32, 18, 120),
        new THREE.MeshStandardMaterial({ color: 0x7b7dff, transparent: true, opacity: 0.22, metalness: 0.4, roughness: 0.15 })
    );
    accentRing.rotation.x = Math.PI / 2.7;
    accentRing.position.set(2.8, -1.6, -0.6);
    heroGroup.add(accentRing);

    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.8, 1),
        new THREE.MeshStandardMaterial({
            color: 0x4f8cff,
            metalness: 0.85,
            roughness: 0.18,
            wireframe: true
        })
    );
    core.position.set(0.8, 1.4, 0.7);
    heroGroup.add(core);

    const orbitalMaterials = [0xff9f1c, 0x22c1ff, 0xcc33cc].map((color) => (
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2, roughness: 0.25 })
    ));

    [
        { x: -4.4, y: -1.5, z: 1.4, s: 1.05, material: orbitalMaterials[0] },
        { x: 4.3, y: 2.2, z: 1.2, s: 1.05, material: orbitalMaterials[1] },
        { x: -5.2, y: 2.8, z: 0.9, s: 1.15, material: orbitalMaterials[2] }
    ].forEach((item) => {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(item.s, 32, 32), item.material);
        sphere.position.set(item.x, item.y, item.z);
        heroGroup.add(sphere);
    });

    const orbitPath = new THREE.Mesh(
        new THREE.TorusGeometry(5.9, 0.04, 12, 160),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.22 })
    );
    orbitPath.rotation.y = 0.5;
    orbitPath.rotation.z = -0.18;
    heroGroup.add(orbitPath);

    scene.add(heroGroup);

    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.08, 10, 10);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.55 });
    for (let index = 0; index < 28; index += 1) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 6
        );
        particles.add(particle);
    }
    scene.add(particles);

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1.8, 100);
    pointLight.position.set(20, 20, 20);
    const fillLight = new THREE.PointLight(0x7b61ff, 1.25, 100);
    fillLight.position.set(-18, -8, 18);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(pointLight, fillLight, ambientLight);

    camera.position.z = 30;

    scene.rotation.x = -0.12;

    // Global speed multiplier for hero animations (increase to speed up)
    const SPEED = 2.5;

    function animate() {
        requestAnimationFrame(animate);

        heroGroup.rotation.y += 0.004 * SPEED;
        heroGroup.rotation.x = -0.08 + Math.sin(Date.now() * 0.001 * SPEED) * 0.03;
        core.rotation.x += 0.006 * SPEED;
        core.rotation.y += 0.004 * SPEED;
        accentRing.rotation.z += 0.003 * SPEED;
        orbitPath.rotation.x += 0.0015 * SPEED;
        particles.rotation.y -= 0.0008 * SPEED;

        renderer.render(scene, camera);
    }

    animate();

    function resizeHeroCanvas() {
        if (!hero3d) {
            return;
        }

        const width = hero3d.clientWidth;
        const height = hero3d.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resizeHeroCanvas);
    resizeHeroCanvas();
} else {
    setupFallbackHero();
}

const typingName = document.querySelector('.typing-name');

function setTypingWidth() {
    if (!typingName) {
        return;
    }

    const nameSpan = typingName.querySelector('span');
    if (!nameSpan) {
        return;
    }

    typingName.style.setProperty('--typing-width', `${nameSpan.scrollWidth}px`);
}

setTypingWidth();
window.addEventListener('resize', setTypingWidth);

// Infinite type-delete loop for the hero name
const nameSpan = document.querySelector('.typing-name span');
if (nameSpan) {
    const fullName = 'Pidhadiya Diksha';
    const TYPING_SPEED = 80; // ms per character
    const DELETING_SPEED = 40; // ms per character
    const PAUSE_AFTER_TYPING = 900; // ms pause when fully typed

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function typeLoop() {
        while (true) {
            // type
            for (let i = 1; i <= fullName.length; i += 1) {
                nameSpan.textContent = fullName.slice(0, i);
                await sleep(TYPING_SPEED);
            }
            await sleep(PAUSE_AFTER_TYPING);

            // delete
            for (let i = fullName.length; i >= 0; i -= 1) {
                nameSpan.textContent = fullName.slice(0, i);
                await sleep(DELETING_SPEED);
            }
            await sleep(300);
        }
    }

    // start the loop
    typeLoop().catch((e) => { console.error('Type loop error:', e); });
}

// --- Navbar active link handling ---
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.from(document.querySelectorAll('header nav ul li a'));
    const sections = navLinks
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    // Add click handler to apply active class immediately
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    if ('IntersectionObserver' in window && sections.length) {
        const obsOptions = {
            root: null,
            rootMargin: '-30% 0% -40% 0%',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.id;
                const activeLink = document.querySelector(`header nav ul li a[href="#${id}"]`);
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove('active'));
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, obsOptions);

        sections.forEach((s) => observer.observe(s));
    }

    /* ============================================ */
    /* Hamburger Menu Toggle Functionality */
    /* ============================================ */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks2 = document.querySelectorAll('#navMenu a');

    if (hamburger) {
        const setMenuState = (isOpen) => {
            hamburger.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        };

        hamburger.addEventListener('click', () => {
            setMenuState(!navMenu.classList.contains('active'));
        });

        // Close menu when a link is clicked
        navLinks2.forEach(link => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInsideHeader = event.target.closest('header');
            if (!isClickInsideHeader && navMenu.classList.contains('active')) {
                setMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                setMenuState(false);
            }
        });
    }

    // Contact form: client-side validation + Web3Forms async submit.
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && contactSubmitBtn && formStatus) {
        const defaultBtnText = contactSubmitBtn.textContent;

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                formStatus.textContent = 'Please fill all fields correctly before sending.';
                formStatus.classList.add('error');
                return;
            }

            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    formStatus.textContent = 'Message sent successfully. Thanks for reaching out!';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = data.message || 'Something went wrong. Please try again.';
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.classList.add('error');
            } finally {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = defaultBtnText;
            }
        });
    }
});

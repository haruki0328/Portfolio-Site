document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Init: Typed.js & Vanta.js ---
    if (document.getElementById("typed-text") && typeof Typed !== "undefined") {
        new Typed("#typed-text", {
            strings: ["Engineer.", "Creator.", "Student."],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            showCursor: true
        });
    }

    let vantaEffect = null;
    if (document.getElementById("vanta-bg") && typeof VANTA !== "undefined") {
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x8a7cff,
            color2: 0xff7ab8,
            backgroundColor: 0x0a0a12,
            points: 7.00,
            maxDistance: 26.00,
            spacing: 22.00,
            showDots: true
        });

        // Resize observer for Vanta background
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (vantaEffect) {
                    vantaEffect.width = window.innerWidth;
                    vantaEffect.height = window.innerHeight;

                    if (typeof vantaEffect.resize === "function") {
                        vantaEffect.resize();
                    }
                }
            }, 100);
        });
    }

    // --- 2. Custom Cursor & Loader ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorFollower = document.querySelector(".cursor-follower");

    document.addEventListener("mousemove", (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.15 });
    });

    const hoverLinks = document.querySelectorAll("a, button, .work-card");
    hoverLinks.forEach(link => {
        link.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
        link.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
    });

    const tl = gsap.timeline();
    tl.to(".loader-text", {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
    })
        .to(".loader-wrap", {
            y: "-100%",
            duration: 1,
            ease: "power2.inOut",
            delay: 0.5,
            onStart: () => {
                document.body.classList.remove("loading");
            }
        })
        .from(".reveal-text", {
            y: "100%",
            stagger: 0.1,
            duration: 1,
            ease: "power3.out"
        })
        .to(".hero-sub, .hero-sub-wrapper", {
            opacity: 1,
            duration: 1
        }, "-=0.5");


    // --- 3. ScrollTrigger Animations ---

    // Hero Parallax
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
        },
        scale: 1.5,
        opacity: 0,
        ease: "none"
    });

    // Marquee text
    gsap.to(".marquee-text span", {
        scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        xPercent: -20,
        ease: "none"
    });

    // Profile image reveal
    const profileImg = document.querySelector(".about-visual .image-wrapper");
    if (profileImg) {
        gsap.set(profileImg, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(profileImg, {
            scrollTrigger: {
                trigger: "#about",
                start: "top 70%",
            },
            clipPath: "inset(0 0% 0 0)",
            duration: 1.5,
            ease: "power4.out"
        });
    }

    // Works grid stagger
    const workCards = document.querySelectorAll(".work-card");
    if (workCards.length > 0) {
        gsap.from(workCards, {
            scrollTrigger: {
                trigger: ".works-grid",
                start: "top 80%",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // Section headings fade in
    document.querySelectorAll(".section-heading").forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });


    // --- 4. Interactions ---

    // Magnetic Button
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });

    // 3D Tilt Effect
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card.querySelector(".card-inner"), {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power1.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card.querySelector(".card-inner"), {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5
            });
        });
    });

    // Filtering
    const filterBtns = document.querySelectorAll(".filter-btn");
    const workItems = document.querySelectorAll(".work-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelector(".filter-btn.active").classList.remove("active");
            this.classList.add("active");
            const filterValue = this.getAttribute("data-filter");

            workItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.style.display = "block";
                    gsap.fromTo(item, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
                } else {
                    item.style.display = "none";
                }
            });

            ScrollTrigger.refresh();
        });
    });

    // Modal behavior
    const modal = document.getElementById("work-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalTools = document.getElementById("modal-tools");
    const modalCat = document.getElementById("modal-cat");
    const modalGithub = document.getElementById("modal-github");
    const modalDetailLink = document.getElementById("modal-detail-link");
    const modalClose = document.querySelector(".modal-close");
    const modalBg = document.querySelector(".modal-bg");

    document.querySelectorAll(".work-card").forEach(card => {
        card.addEventListener("click", () => {
            const title = card.getAttribute("data-title");
            const desc = card.getAttribute("data-desc");
            const tools = card.getAttribute("data-tools");
            const cat = card.getAttribute("data-category");
            const img = card.getAttribute("data-img");
            const github = card.getAttribute("data-github");
            const link = card.getAttribute("data-link");

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalTools.textContent = tools;
            modalCat.textContent = cat;
            modalImg.src = img;

            if (github) {
                modalGithub.href = github;
                modalGithub.style.display = "inline-flex";
            } else {
                modalGithub.style.display = "none";
            }

            if (link) {
                modalDetailLink.href = link;
                modalDetailLink.style.display = "inline-flex";
            } else {
                modalDetailLink.style.display = "none";
            }

            modal.classList.add("active");
        });
    });

    const closeModal = () => modal.classList.remove("active");
    modalClose.addEventListener("click", closeModal);
    modalBg.addEventListener("click", closeModal);

    // Form feedback (Mock)
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("メッセージを送信しました。ありがとうございます！");
            contactForm.reset();
        });
    }
});
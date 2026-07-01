document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 設定値の一元管理 ---
    const CONFIG = {
        typing: {
            strings: ["Engineer.", "Creator.", "Student."],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
        },
        vanta: {
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
            resizeDebounceMs: 100
        },
        cursor: {
            followerDuration: 0.15
        },
        loader: {
            textStagger: 0.1,
            textDuration: 1.0,
            wrapDuration: 1.0,
            wrapDelay: 0.5
        },
        animation: {
            heroScale: 1.5,
            marqueeXPercent: -20,
            revealDuration: 1.5,
            cardYOffset: 100,
            cardDuration: 1.0,
            cardStagger: 0.2,
            headingYOffset: 50,
            magneticFactor: 0.3,
            magneticDuration: 0.3,
            tiltMaxRotation: 10,
            tiltDuration: 0.5,
            filterDuration: 0.5,
            filterScaleStart: 0.8
        }
    };

    // --- 1. 初期化: タイピングアニメーションと背景エフェクト ---
    if (document.getElementById("typed-text") && typeof Typed !== "undefined") {
        new Typed("#typed-text", {
            strings: CONFIG.typing.strings,
            typeSpeed: CONFIG.typing.typeSpeed,
            backSpeed: CONFIG.typing.backSpeed,
            backDelay: CONFIG.typing.backDelay,
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
            minHeight: CONFIG.vanta.minHeight,
            minWidth: CONFIG.vanta.minWidth,
            scale: CONFIG.vanta.scale,
            scaleMobile: CONFIG.vanta.scaleMobile,
            color: CONFIG.vanta.color,
            color2: CONFIG.vanta.color2,
            backgroundColor: CONFIG.vanta.backgroundColor,
            points: CONFIG.vanta.points,
            maxDistance: CONFIG.vanta.maxDistance,
            spacing: CONFIG.vanta.spacing,
            showDots: true
        });

        // リサイズイベントの連続発火を防ぐデバウンス処理
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (vantaEffect && typeof vantaEffect.resize === "function") {
                    vantaEffect.resize();
                }
            }, CONFIG.vanta.resizeDebounceMs);
        });
    }

    // --- ハンバーガーメニュー（モバイル用ナビ開閉） ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
        document.addEventListener("click", (e) => {
            if (!navLinks.classList.contains("active")) return;
            if (navLinks.contains(e.target) || hamburger.contains(e.target)) return;
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    }

    // --- 2. カスタムカーソルとローダー ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorFollower = document.querySelector(".cursor-follower");

    document.addEventListener("mousemove", (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: CONFIG.cursor.followerDuration });
    });

    const hoverLinks = document.querySelectorAll("a, button, .work-card");
    hoverLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering");
        });
        link.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering");
        });
    });

    const tl = gsap.timeline();
    tl.to(".loader-text", {
        y: 0,
        stagger: CONFIG.loader.textStagger,
        duration: CONFIG.loader.textDuration,
        ease: "power4.out"
    })
        .to(".loader-wrap", {
            y: "-100%",
            duration: CONFIG.loader.wrapDuration,
            ease: "power2.inOut",
            delay: CONFIG.loader.wrapDelay,
            onStart: () => {
                document.body.classList.remove("loading");
            }
        })
        .from(".reveal-text", {
            y: "100%",
            stagger: CONFIG.loader.textStagger,
            duration: CONFIG.loader.textDuration,
            ease: "power3.out"
        })
        .to(".hero-sub, .hero-sub-wrapper", {
            opacity: 1,
            duration: CONFIG.loader.textDuration
        }, "-=0.5");


    // --- 3. スクロール連動アニメーション ---
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
        },
        scale: CONFIG.animation.heroScale,
        opacity: 0,
        ease: "none"
    });

    gsap.to(".marquee-text span", {
        scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        xPercent: CONFIG.animation.marqueeXPercent,
        ease: "none"
    });

    const profileImg = document.querySelector(".about-visual .image-wrapper");
    if (profileImg) {
        gsap.set(profileImg, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(profileImg, {
            scrollTrigger: {
                trigger: "#about",
                start: "top 70%",
            },
            clipPath: "inset(0 0% 0 0)",
            duration: CONFIG.animation.revealDuration,
            ease: "power4.out"
        });
    }

    const workCards = document.querySelectorAll(".work-card");
    if (workCards.length > 0) {
        gsap.from(workCards, {
            scrollTrigger: {
                trigger: ".works-grid",
                start: "top 80%",
            },
            y: CONFIG.animation.cardYOffset,
            opacity: 0,
            duration: CONFIG.animation.cardDuration,
            stagger: CONFIG.animation.cardStagger,
            ease: "power3.out"
        });
    }

    document.querySelectorAll(".section-heading").forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
            },
            y: CONFIG.animation.headingYOffset,
            opacity: 0,
            duration: CONFIG.animation.cardDuration,
            ease: "power2.out"
        });
    });


    // --- 4. ホバー・クリックのインタラクション ---
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { 
                x: x * CONFIG.animation.magneticFactor, 
                y: y * CONFIG.animation.magneticFactor, 
                duration: CONFIG.animation.magneticDuration 
            });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: CONFIG.animation.magneticDuration });
        });
    });

    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -CONFIG.animation.tiltMaxRotation;
            const rotateY = ((x - centerX) / centerX) * CONFIG.animation.tiltMaxRotation;

            gsap.to(card.querySelector(".card-inner"), {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: CONFIG.animation.tiltDuration,
                ease: "power1.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card.querySelector(".card-inner"), {
                rotateX: 0,
                rotateY: 0,
                duration: CONFIG.animation.tiltDuration
            });
        });
    });

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
                    gsap.fromTo(item, 
                        { opacity: 0, scale: CONFIG.animation.filterScaleStart }, 
                        { opacity: 1, scale: 1, duration: CONFIG.animation.filterDuration }
                    );
                } else {
                    item.style.display = "none";
                }
            });

            ScrollTrigger.refresh();
        });
    });


    // --- 5. モーダル表示とフォーム送信 ---
    const modal = document.getElementById("work-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalTools = document.getElementById("modal-tools");
    const modalCat = document.getElementById("modal-cat");
    const modalGithub = document.getElementById("modal-github");
    const modalDemoLink = document.getElementById("modal-demo-link");
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
            const demo = card.getAttribute("data-demo");
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

            if (demo) {
                modalDemoLink.href = demo;
                modalDemoLink.style.display = "inline-flex";
            } else {
                modalDemoLink.style.display = "none";
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

    const closeModal = () => {
        modal.classList.remove("active");
    };
    modalClose.addEventListener("click", closeModal);
    modalBg.addEventListener("click", closeModal);

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            try {
                alert("メッセージを送信しました。ありがとうございます！");
                contactForm.reset();
            } catch (error) {
                console.error("フォームの送信に失敗しました:", error);
                alert("エラーが発生しました。時間をおいて再度お試しください。");
            }
        });
    }
});
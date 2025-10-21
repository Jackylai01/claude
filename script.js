// ===== 等待 DOM 載入完成 =====
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initSmoothScroll();
    initForm();
    initMobileMenu();
});

// ===== 輪播圖功能 =====
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // 顯示指定的輪播圖
    function showSlide(index) {
        // 移除所有 active 類別
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 處理索引邊界
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // 顯示當前輪播圖
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // 下一張
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // 上一張
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // 綁定按鈕事件
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // 綁定指示器點擊事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // 自動輪播（每5秒）
    let autoplayInterval = setInterval(nextSlide, 5000);

    // 滑鼠懸停時暫停自動輪播
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
    }

    // 鍵盤控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 觸控滑動支援（移動端）
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // 向左滑動
            } else {
                prevSlide(); // 向右滑動
            }
        }
    }
}

// ===== 平滑滾動 =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有 active 類別
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加 active 到當前連結
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滾動時更新導航欄 active 狀態
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== 表單處理 =====
function initForm() {
    const form = document.getElementById('wishlistForm');
    const successMessage = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 獲取表單數據
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // 在實際應用中，這裡應該發送數據到後端
            console.log('表單提交數據:', data);

            // 顯示成功訊息
            form.style.display = 'none';
            successMessage.classList.add('show');

            // 3秒後重置表單
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.remove('show');
            }, 3000);
        });

        // 重置按鈕處理
        form.addEventListener('reset', function() {
            setTimeout(() => {
                // 確保第一個優先等級選項被選中
                const firstRadio = form.querySelector('input[name="priority"]');
                if (firstRadio) {
                    firstRadio.checked = true;
                }
            }, 0);
        });
    }
}

// ===== 移動端選單 =====
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 點擊選單項目後關閉移動端選單
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });

    // 點擊外部關閉選單
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
}

// ===== 滾動動畫效果（可選） =====
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // 觀察需要動畫的元素
    const animatedElements = document.querySelectorAll('.feature-item, .case-content');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== 返回頂部按鈕（可選功能） =====
function initBackToTop() {
    // 創建返回頂部按鈕
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', '返回頂部');
    document.body.appendChild(backToTopBtn);

    // 滾動時顯示/隱藏按鈕
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 點擊返回頂部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== 輸入驗證增強 =====
function enhanceFormValidation() {
    const form = document.getElementById('wishlistForm');

    if (form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            // 即時驗證
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');

    // 移除之前的錯誤訊息
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    field.classList.remove('error');

    // 驗證邏輯
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此欄位為必填');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '請輸入有效的電子郵件地址');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--gray-600)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    field.closest('.form-group').appendChild(errorDiv);
}

// ===== 效能優化：延遲載入圖片 =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== 控制台歡迎訊息 =====
console.log('%c珍帝拉 SaaS 系統', 'font-size: 24px; font-weight: bold; color: #262626;');
console.log('%c官方首頁原型設計', 'font-size: 14px; color: #737373;');
console.log('原型設計模式 - 等待設計確認後進行風格配色');

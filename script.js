document.addEventListener('DOMContentLoaded', function() {
    // 確保頁面載入時滾動到最頂部，無視頂部間距
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, 0);


    // Enhanced Folder Hover Effects
    const folderItems = document.querySelectorAll('.folder-item');

    folderItems.forEach((folder, index) => {
        const closedFolder = folder.querySelector('.folder-closed');
        const openFolder = folder.querySelector('.folder-open');

        if (closedFolder && openFolder) {
            folder.addEventListener('mouseenter', function() {
                // Reset any inline styles to let CSS handle the animation
                closedFolder.style.transform = '';
                openFolder.style.transform = '';
                closedFolder.style.opacity = '';
                openFolder.style.opacity = '';
            });

            folder.addEventListener('mouseleave', function() {
                // Reset any inline styles to let CSS handle the animation
                closedFolder.style.transform = '';
                openFolder.style.transform = '';
                closedFolder.style.opacity = '';
                openFolder.style.opacity = '';
            });
        }
    });

    // Button Click Effects
    const aboutBtn = document.querySelector('.about-btn');
    const viewBtns = document.querySelectorAll('.view-btn');

    // About button click effect
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            this.style.transform = 'translateY(-3px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1)';
            }, 150);
        });
    }

    // View buttons click effects
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
        });
    });

    // Smooth scroll for About me navigation
    const aboutNavLink = document.querySelector('.nav-right');
    if (aboutNavLink) {
        aboutNavLink.addEventListener('click', function() {
            const profileSection = document.querySelector('.profile-section');
            if (profileSection) {
                profileSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    }

    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe folder items for staggered animation
    folderItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Add subtle floating animation to folders
    function addFloatingAnimation() {
        folderItems.forEach((folder, index) => {
            const delay = index * 0.5;
            folder.style.animation = `float 4s ease-in-out ${delay}s infinite`;
        });
    }

    // CSS keyframes for floating animation (will be added via JavaScript)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize floating animation after a delay
    setTimeout(addFloatingAnimation, 1000);

    // Pink Cat Eye Tracking
    const leftEyeball = document.querySelector('.left-eye .eyeball');
    const rightEyeball = document.querySelector('.right-eye .eyeball');
    const catContainer = document.querySelector('.pink-cat-container');

    if (leftEyeball && rightEyeball && catContainer) {
        function updateEyePosition(event) {
            const catRect = catContainer.getBoundingClientRect();
            const catCenterX = catRect.left + catRect.width / 2;
            const catCenterY = catRect.top + catRect.height / 2;
            
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            
            // Calculate angle and distance for both eyes
            const leftEyeElement = document.querySelector('.left-eye');
            const rightEyeElement = document.querySelector('.right-eye');
            
            const leftEyeRect = leftEyeElement.getBoundingClientRect();
            const rightEyeRect = rightEyeElement.getBoundingClientRect();
            
            const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
            const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
            
            const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
            const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;
            
            // Calculate movement for left eye
            const leftDeltaX = mouseX - leftEyeCenterX;
            const leftDeltaY = mouseY - leftEyeCenterY;
            const leftAngle = Math.atan2(leftDeltaY, leftDeltaX);
            const leftDistance = Math.min(Math.sqrt(leftDeltaX * leftDeltaX + leftDeltaY * leftDeltaY) / 5, 35);
            
            const leftMoveX = Math.cos(leftAngle) * leftDistance;
            const leftMoveY = Math.sin(leftAngle) * leftDistance;
            
            // Calculate movement for right eye
            const rightDeltaX = mouseX - rightEyeCenterX;
            const rightDeltaY = mouseY - rightEyeCenterY;
            const rightAngle = Math.atan2(rightDeltaY, rightDeltaX);
            const rightDistance = Math.min(Math.sqrt(rightDeltaX * rightDeltaX + rightDeltaY * rightDeltaY) / 5, 35);
            
            const rightMoveX = Math.cos(rightAngle) * rightDistance;
            const rightMoveY = Math.sin(rightAngle) * rightDistance;
            
            // Apply movement with limits to stay within eye white
            // 限制移動範圍，讓眼球保持在眼白內，往上幅度增加
            const maxMoveX = 60; // 最大水平移動範圍
            const maxMoveY = 55; // 最大垂直移動範圍
            const maxMoveYUp = 70; // 往上的最大移動範圍（比往下更大）
            
            const clampedLeftMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, leftMoveX));
            const clampedLeftMoveY = Math.max(-maxMoveYUp, Math.min(maxMoveY, leftMoveY)); // 往上用更大範圍
            const clampedRightMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, rightMoveX));
            const clampedRightMoveY = Math.max(-maxMoveYUp, Math.min(maxMoveY, rightMoveY)); // 往上用更大範圍
            
            leftEyeball.style.transform = `translate(${-50 + clampedLeftMoveX}%, ${-50 + clampedLeftMoveY}%)`;
            rightEyeball.style.transform = `translate(${-50 + clampedRightMoveX}%, ${-50 + clampedRightMoveY}%)`;
        }
        
        // Real-time mouse movement for more responsive tracking
        document.addEventListener('mousemove', function(event) {
            updateEyePosition(event);
        });
    }

});
// Responsive background extension system
class ResponsiveBackgroundManager {
    constructor() {
        this.mainBgImage = new Image();
        this.isMainBgLoaded = false;
        this.currentExtensionHeight = 0;
        
        // Load main background image to get dimensions
        this.mainBgImage.onload = () => {
            this.isMainBgLoaded = true;
            this.updateBackground();
        };
        this.mainBgImage.src = 'pictures/background.png';
        
        // Bind methods
        this.updateBackground = this.updateBackground.bind(this);
        this.debounce = this.debounce.bind(this);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Update on DOM content loaded
        document.addEventListener('DOMContentLoaded', this.updateBackground);
        
        // Update on window resize (debounced)
        window.addEventListener('resize', this.debounce(this.updateBackground, 250));
        
        // Update on content changes (using MutationObserver)
        const observer = new MutationObserver(this.debounce(this.updateBackground, 100));
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Update on scroll (throttled for performance)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(this.updateBackground, 50);
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    calculateMainBackgroundDimensions() {
        if (!this.isMainBgLoaded) return null;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const marginWidth = 20; // 10px on each side
        const usableWidth = windowWidth - marginWidth;
        
        // Calculate scaled dimensions based on responsive sizing
        const originalWidth = this.mainBgImage.width;
        const originalHeight = this.mainBgImage.height;
        const scaledHeight = (originalHeight * usableWidth) / originalWidth;
        
        // 響應式背景起始位置 - 根據不同螢幕尺寸調整
        let backgroundStartY = Math.max(100, Math.min(windowHeight * 0.12, 150)); // 預設使用 clamp(100px, 12vh, 150px)
        
        // 針對較小螢幕調整背景位置
        if (windowWidth <= 768) {
            backgroundStartY = Math.max(100, Math.min(windowHeight * 0.12, 150)); // 手機版使用與桌面版相同的響應式計算
        } else if (windowWidth <= 1024) {
            backgroundStartY = Math.max(90, Math.min(windowHeight * 0.1, 130)); // 平板版稍微調整
        }
        
        return {
            width: usableWidth,
            height: scaledHeight,
            startY: backgroundStartY,
            endY: backgroundStartY + scaledHeight,
            screenSize: windowWidth <= 768 ? 'mobile' : windowWidth <= 1024 ? 'tablet' : 'desktop'
        };
    }
    
    getContentDimensions() {
        const body = document.body;
        const documentElement = document.documentElement;
        
        // 獲取實際內容高度，排除動態設定的 minHeight
        const mainContent = document.querySelector('.main-content');
        let actualContentHeight = 0;
        
        if (mainContent) {
            const contentRect = mainContent.getBoundingClientRect();
            const contentTop = contentRect.top + window.scrollY;
            const contentBottom = contentTop + contentRect.height;
            actualContentHeight = contentBottom;
        } else {
            // fallback to body dimensions
            actualContentHeight = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                documentElement.scrollHeight,
                documentElement.offsetHeight
            );
        }
        
        return {
            height: actualContentHeight,
            viewportHeight: window.innerHeight
        };
    }
    
    updateBackground() {
        if (!this.isMainBgLoaded) return;
        
        const mainBgDimensions = this.calculateMainBackgroundDimensions();
        const contentDimensions = this.getContentDimensions();
        
        if (!mainBgDimensions) return;
        
        const needsExtension = contentDimensions.height > mainBgDimensions.endY;
        
        if (needsExtension) {
            this.enableBackgroundExtension(mainBgDimensions, contentDimensions);
        } else {
            this.disableBackgroundExtension();
        }
    }
    
    enableBackgroundExtension(mainBgDimensions, contentDimensions) {
        const body = document.body;
        const extensionStartY = mainBgDimensions.endY;
        const mainBgStartY = mainBgDimensions.startY;
        
        // 只設置主背景
        body.style.backgroundImage = "url('pictures/background.png')";
        body.style.backgroundSize = "calc(100% - 20px) auto";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = `center ${mainBgStartY}px`;
        body.style.backgroundAttachment = "scroll";
        
        // 創建或更新延伸背景元素
        this.createExtensionElement(extensionStartY, contentDimensions.height);
        
        // 確保頁面有足夠高度容納內容和延伸背景
        const requiredHeight = Math.max(contentDimensions.height, window.innerHeight);
        body.style.minHeight = `${requiredHeight}px`;
        
        this.currentExtensionHeight = contentDimensions.height - mainBgDimensions.endY;
        
        // Debug info (can be removed in production)
        console.log('Background extension enabled (fixed positioning):', {
            screenSize: mainBgDimensions.screenSize,
            mainBgStart: mainBgStartY,
            mainBgEnd: mainBgDimensions.endY,
            contentHeight: contentDimensions.height,
            extensionHeight: this.currentExtensionHeight,
            extensionStartY: extensionStartY,
            windowWidth: window.innerWidth
        });
    }
    
    createExtensionElement(startY, contentHeight) {
        // 移除現有的延伸背景元素
        const existingExtension = document.getElementById('background-extension');
        if (existingExtension) {
            existingExtension.remove();
        }
        
        // 創建新的延伸背景元素
        const extensionElement = document.createElement('div');
        extensionElement.id = 'background-extension';
        extensionElement.style.cssText = `
            position: absolute;
            top: ${startY}px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 20px);
            height: ${Math.max(contentHeight - startY, 0)}px;
            background-image: url('pictures/background-add.png');
            background-repeat: repeat-y;
            background-position: center top;
            background-size: 100% auto;
            z-index: -1;
            pointer-events: none;
        `;
        
        document.body.appendChild(extensionElement);
        
        console.log('Extension element created:', {
            startY: startY,
            height: Math.max(contentHeight - startY, 0),
            contentHeight: contentHeight
        });
    }
    
    disableBackgroundExtension() {
        const body = document.body;
        
        // 移除延伸背景元素
        const existingExtension = document.getElementById('background-extension');
        if (existingExtension) {
            existingExtension.remove();
        }
        
        // 計算響應式主背景位置
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let backgroundStartY = Math.max(100, Math.min(windowHeight * 0.12, 150)); // 預設位置
        
        if (windowWidth <= 768) {
            backgroundStartY = Math.max(100, Math.min(windowHeight * 0.12, 150)); // 手機版使用響應式計算
        } else if (windowWidth <= 1024) {
            backgroundStartY = Math.max(90, Math.min(windowHeight * 0.1, 130)); // 平板版
        }
        
        // 只使用主背景，響應式調整位置
        body.style.backgroundImage = "url('pictures/background.png')";
        body.style.backgroundSize = "calc(100% - 20px) auto";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = `center ${backgroundStartY}px`;
        body.style.backgroundAttachment = "scroll";
        body.style.minHeight = "100vh";
        
        this.currentExtensionHeight = 0;
        
        // Debug info (can be removed in production)
        console.log('Background extension disabled (responsive):', {
            backgroundStartY: backgroundStartY,
            windowWidth: windowWidth,
            screenSize: windowWidth <= 768 ? 'mobile' : windowWidth <= 1024 ? 'tablet' : 'desktop'
        });
    }
    
    // Public method to manually trigger update
    refresh() {
        this.updateBackground();
    }
    
    // Get current state
    getState() {
        return {
            isExtensionActive: this.currentExtensionHeight > 0,
            extensionHeight: this.currentExtensionHeight,
            mainBgLoaded: this.isMainBgLoaded
        };
    }
}

// Initialize the background manager
const backgroundManager = new ResponsiveBackgroundManager();

// Expose to global scope for debugging (optional)
window.backgroundManager = backgroundManager;
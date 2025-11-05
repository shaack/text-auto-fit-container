/**
 * Auto-fit text to container
 * Automatically adjusts font size to fit text within its container
 */

class TextAutoFit {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            minFontSize: options.minFontSize || 10,
            maxFontSize: options.maxFontSize || 200,
            resolution: options.resolution || 1,
            ...options
        };

        this.init();
    }

    init() {
        this.fit();

        // Re-fit on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.fit(), 100);
        });
    }

    fit() {
        const element = this.element;
        const textElement = element.querySelector('p') || element;

        // Get container dimensions (accounting for padding)
        const containerWidth = element.clientWidth;
        const containerHeight = element.clientHeight;

        let fontSize = this.options.maxFontSize;
        let low = this.options.minFontSize;
        let high = this.options.maxFontSize;

        // Binary search for optimal font size
        while (low <= high) {
            fontSize = Math.floor((low + high) / 2);
            textElement.style.fontSize = fontSize + 'px';

            const scrollWidth = textElement.scrollWidth;
            const scrollHeight = textElement.scrollHeight;

            // Check if text fits
            if (scrollWidth <= containerWidth && scrollHeight <= containerHeight) {
                // Text fits, try larger
                low = fontSize + this.options.resolution;
            } else {
                // Text doesn't fit, try smaller
                high = fontSize - this.options.resolution;
            }
        }

        // Set the final font size (use high as it's the last size that fit)
        textElement.style.fontSize = high + 'px';
    }
}

// Initialize all elements with data-auto-fit attribute
document.addEventListener('DOMContentLoaded', () => {
    const autoFitElements = document.querySelectorAll('[data-auto-fit]');

    autoFitElements.forEach(element => {
        new TextAutoFit(element, {
            minFontSize: 12,
            maxFontSize: 80,
            resolution: 1
        });
    });
});

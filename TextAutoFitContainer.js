/**
 * Auto-fit text to container
 * Automatically adjusts font size to fit text within its container
 */

export class TextAutoFit {
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

        // Get computed style to extract padding
        const style = window.getComputedStyle(element);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;

        // Get container dimensions (subtract padding for available space)
        const containerWidth = element.clientWidth - paddingLeft - paddingRight;
        const containerHeight = element.clientHeight - paddingTop - paddingBottom;

        let fontSize = this.options.maxFontSize;
        let low = this.options.minFontSize;
        let high = this.options.maxFontSize;

        // Binary search for optimal font size
        while (low <= high) {
            fontSize = Math.floor((low + high) / 2);
            textElement.style.fontSize = fontSize + 'px';

            const textWidth = textElement.scrollWidth;
            const textHeight = textElement.scrollHeight;

            // Check if text fits within available space
            if (textWidth <= containerWidth && textHeight <= containerHeight) {
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
class ColorSelector {
    colors
    currentColor

    constructor(colors) {
        this.colors = colors;
    }

    onlyOneColor(selectedColor) {
        this.currentColor = selectedColor
        return this.currentColor
    }

    getCurrentColor() {
        return this.currentColor
    }

}
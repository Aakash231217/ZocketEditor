class CanvasClass {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawTemplate(caption, cta, backgroundColor, imageUrl, designPatternUrl, maskStrokeUrl) {
    this.ctx.clearRect(0, 0, 1080, 1080);

    // Background color
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, 1080, 1080);

    // Design pattern
    const patternImage = new Image();
    patternImage.src = designPatternUrl;
    patternImage.onload = () => {
      this.ctx.drawImage(patternImage, 0, 0, 1080, 1080);
      this.drawMaskAndText(caption, cta, imageUrl, maskStrokeUrl);
    };
  }

  drawMaskAndText(caption, cta, imageUrl, maskStrokeUrl) {
    const maskImage = new Image();
    maskImage.src = imageUrl;
    maskImage.onload = () => {
      this.ctx.drawImage(maskImage, 56, 442, 970, 600);
        this.drawText(caption, cta);
      };
  }

  drawText(caption, cta) {
    this.ctx.font = `${caption.fontSize}px Arial`;
    this.ctx.fillStyle = caption.textColor;
    this.ctx.textAlign = caption.alignment;
    this.wrapText(caption.text, caption.position.x, caption.position.y, caption.maxCharactersPerLine, caption.fontSize);

    this.ctx.fillStyle = cta.backgroundColor;
    const ctaWidth = this.ctx.measureText(cta.text).width + 48;
    const ctaHeight = cta.fontSize + 24;
    this.roundRect(cta.position.x - ctaWidth / 2, cta.position.y - ctaHeight / 2, ctaWidth, ctaHeight, 12);
    this.ctx.fillStyle = cta.textColor;
    this.ctx.font = `${cta.fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(cta.text, cta.position.x, cta.position.y);
  }

  wrapText(text, x, y, maxCharactersPerLine, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxCharactersPerLine * (lineHeight / 2) && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }

      if (index === words.length - 1) {
        lines.push(line.trim());
      }
    });

    for (let j = 0; j < lines.length; j++) {
      this.ctx.fillText(lines[j], x, y + (j * lineHeight));
    }
  }


  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

export default CanvasClass;

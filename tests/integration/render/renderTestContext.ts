export function createMockCanvasContext(width = 896, height = 640): CanvasRenderingContext2D {
  const context = {
    canvas: { width, height },
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    arc() {},
    fill() {},
    stroke() {},
    moveTo() {},
    lineTo() {},
    setLineDash() {},
    fillText() {},
    drawImage() {},
    closePath() {},
    save() {},
    restore() {},
    measureText() {
      return { width: 0 } as TextMetrics;
    },
    fillStyle: "#000000",
    strokeStyle: "#000000",
    lineWidth: 1,
    font: "12px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic"
  };

  return context as unknown as CanvasRenderingContext2D;
}

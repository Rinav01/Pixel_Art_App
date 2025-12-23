import React, { useRef, useEffect } from 'react';
import type { Layer } from '../state/types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
interface SkiaCanvasProps {
  layers: Layer[];
  scale: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  showGrid: boolean;
  onPixelPress: (x: number, y: number) => void;
  width: number;
  height: number;
  selectedTool: string;
}

export const SkiaCanvas: React.FC<SkiaCanvasProps> = ({
  layers,
  scale,
  pan,
  setPan,
  showGrid,
  onPixelPress,
  width,
  height,
  selectedTool,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panOffset = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(pan.x, pan.y);

    layers.forEach(layer => {
      if (layer.isVisible) {
        layer.pixels.forEach((row, y) => {
          row.forEach((color, x) => {
            if (color) {
              ctx.fillStyle = color;
              ctx.fillRect(x * scale, y * scale, scale, scale);
            }
          });
        });
      }
    });

    if (showGrid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= PIXEL_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, PIXEL_HEIGHT * scale);
        ctx.stroke();
      }
      for (let i = 0; i <= PIXEL_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(PIXEL_WIDTH * scale, i * scale);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [layers, scale, pan, showGrid, width, height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'pan') {
      isPanning.current = true;
      panOffset.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    } else {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pixelX = Math.floor((x - pan.x) / scale);
      const pixelY = Math.floor((y - pan.y) / scale);
      onPixelPress(pixelX, pixelY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning.current) {
      setPan({
        x: e.clientX - panOffset.current.x,
        y: e.clientY - panOffset.current.y,
      });
    } else if (selectedTool !== 'pan' && e.buttons === 1) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pixelX = Math.floor((x - pan.x) / scale);
        const pixelY = Math.floor((y - pan.y) / scale);
        onPixelPress(pixelX, pixelY);
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  

const getCursorForTool = (tool: string) => {
    switch (tool) {
      case 'pen':
        return 'crosshair';
      case 'eraser':
        return 'url(data:image/png;base64,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) 4 12, auto';
      case 'fill':
        return 'crosshair';
      case 'eyedropper':
        return 'crosshair';
      case 'pan':
        return 'grab';
      default:
        return 'default';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: getCursorForTool(selectedTool) }}
    />
  );
};

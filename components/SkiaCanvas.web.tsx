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

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: selectedTool === 'pan' ? 'grab' : 'crosshair' }}
    />
  );
};

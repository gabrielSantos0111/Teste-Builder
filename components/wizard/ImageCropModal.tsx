import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onCrop: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onCrop,
  aspectRatio = 1
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Image and crop state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const CONTAINER_WIDTH = 800;
  const CONTAINER_HEIGHT = 600;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    setNaturalSize({ width: naturalWidth, height: naturalHeight });

    // Calculate display size to fit container while maintaining aspect ratio
    const containerRatio = CONTAINER_WIDTH / CONTAINER_HEIGHT;
    const imageRatio = naturalWidth / naturalHeight;
    
    let displayWidth, displayHeight;
    
    if (imageRatio > containerRatio) {
      // Image is wider than container ratio
      displayWidth = CONTAINER_WIDTH * 0.9; // Leave some margin
      displayHeight = displayWidth / imageRatio;
    } else {
      // Image is taller than container ratio
      displayHeight = CONTAINER_HEIGHT * 0.9; // Leave some margin
      displayWidth = displayHeight * imageRatio;
    }

    setDisplaySize({ width: displayWidth, height: displayHeight });

    // Center image in container
    const centerX = (CONTAINER_WIDTH - displayWidth) / 2;
    const centerY = (CONTAINER_HEIGHT - displayHeight) / 2;
    setImagePosition({ x: centerX, y: centerY });

    // Calculate initial crop box
    const cropSize = Math.min(displayWidth, displayHeight) * 0.8;
    const cropWidth = aspectRatio >= 1 ? cropSize : cropSize * aspectRatio;
    const cropHeight = aspectRatio >= 1 ? cropSize / aspectRatio : cropSize;

    setCropBox({
      x: centerX + (displayWidth - cropWidth) / 2,
      y: centerY + (displayHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });

    setImageLoaded(true);
  }, [aspectRatio]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is inside crop box
    if (
      x >= cropBox.x &&
      x <= cropBox.x + cropBox.width &&
      y >= cropBox.y &&
      y <= cropBox.y + cropBox.height
    ) {
      setIsDragging(true);
      setDragStart({
        x: x - cropBox.x,
        y: y - cropBox.y
      });
      e.preventDefault();
    }
  }, [cropBox]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate new crop box position
    let newX = x - dragStart.x;
    let newY = y - dragStart.y;

    // Constrain to image boundaries
    const minX = imagePosition.x;
    const minY = imagePosition.y;
    const maxX = imagePosition.x + displaySize.width - cropBox.width;
    const maxY = imagePosition.y + displaySize.height - cropBox.height;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    setCropBox(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
  }, [isDragging, dragStart, imagePosition, displaySize, cropBox.width, cropBox.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Crop the image
  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;

    // Calculate scale factor from display to natural image size
    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;

    // Calculate crop coordinates on the natural image
    const cropX = (cropBox.x - imagePosition.x) * scaleX;
    const cropY = (cropBox.y - imagePosition.y) * scaleY;
    const cropWidth = cropBox.width * scaleX;
    const cropHeight = cropBox.height * scaleY;

    // Set canvas size to desired output size (maintain aspect ratio)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize / aspectRatio;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cropped image
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, canvas.width, canvas.height
    );

    // Convert to data URL
    const croppedImageUrl = canvas.toDataURL('image/png', 0.9);
    onCrop(croppedImageUrl);
    onClose();
  }, [
    imageLoaded, naturalSize, displaySize, cropBox, imagePosition,
    aspectRatio, onCrop, onClose
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 bg-gray-100">
        <DialogTitle className="sr-only">Cortar Imagem</DialogTitle>
        <DialogDescription className="sr-only">
          Ajuste a posição da área de corte arrastando-a para selecionar a parte desejada da imagem
        </DialogDescription>

        <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Hidden image for size calculations */}
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Source"
              className="hidden"
              onLoad={handleImageLoad}
            />
          )}

          {/* Main crop area */}
          <div
            ref={containerRef}
            className="relative bg-white shadow-lg"
            style={{ 
              width: CONTAINER_WIDTH, 
              height: CONTAINER_HEIGHT,
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background image */}
            {imageUrl && imageLoaded && (
              <img
                src={imageUrl}
                alt="Preview"
                className="absolute select-none pointer-events-none"
                style={{
                  left: imagePosition.x,
                  top: imagePosition.y,
                  width: displaySize.width,
                  height: displaySize.height,
                  objectFit: 'contain'
                }}
                draggable={false}
              />
            )}

            {/* Dark overlay */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"
              style={{ zIndex: 1 }}
            />

            {/* Crop box */}
            {imageLoaded && (
              <div
                className="absolute border-2 border-white pointer-events-none"
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.width,
                  height: cropBox.height,
                  zIndex: 2,
                  cursor: 'move'
                }}
              >
                {/* Clear area showing the image */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: `${displaySize.width}px ${displaySize.height}px`,
                    backgroundPosition: `${imagePosition.x - cropBox.x}px ${imagePosition.y - cropBox.y}px`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />

                {/* Corner handles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
              </div>
            )}

            {/* Drag area indicator */}
            {imageLoaded && (
              <div
                className="absolute cursor-move"
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.width,
                  height: cropBox.height,
                  zIndex: 3
                }}
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-6 right-6 flex gap-3 z-10">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCrop}
              disabled={!imageLoaded}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
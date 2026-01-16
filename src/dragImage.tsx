import { useRef, useEffect, useState } from "react";

interface DragImageProps {
  src: string;
  initial: number;
  className?: string;
}

export default function DragImage({ src, initial, className }: DragImageProps) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(initial);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const imageWrapper = imageWrapperRef.current;
    const img = imgRef.current;
    if (!imageWrapper || !img) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target !== img) return;

      setIsDragging(true);
      setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;

      setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      // REGLE STRICTE sur l'IMG, pas sur le wrapper
      const fullyInside = isImgFullyInsideCover();

      if (!fullyInside) {
        setIsHiding(true);

        setTimeout(() => {
          setOffset({ x: 0, y: 0 });
          setIsHiding(false);
        }, 250);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    img.addEventListener("mousedown", handleMouseDown);

    return () => {
      img.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, startPos]);

  // UN PIXEL DEHORS = OUT
  const isImgFullyInsideCover = (): boolean => {
    const cover = document.getElementById("cover");
    const img = imgRef.current;
    if (!cover || !img) return true;

    const coverRect = cover.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    return (
      imgRect.left >= coverRect.left &&
      imgRect.right <= coverRect.right &&
      imgRect.top >= coverRect.top &&
      imgRect.bottom <= coverRect.bottom
    );
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        ref={imageWrapperRef}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          cursor: isDragging ? "grabbing" : "grab",
          transition: !isDragging
            ? "transform 0.2s ease-out, opacity 0.25s ease-out"
            : "none",
          willChange: isDragging ? "transform" : "auto",
          display: "inline-block",
          opacity: isHiding ? 0 : 1,
          pointerEvents: isHiding ? "none" : "auto",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <img
            ref={imgRef}
            src={src}
            alt="draggable"
            style={{
              width: "auto",
              height: size,
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <input
          type="range"
          min={50}
          max={300}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ backgroundColor: "white", height: "3px" }}
        />
      </div>
    </div>
  );
}

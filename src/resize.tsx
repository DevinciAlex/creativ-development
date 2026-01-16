import { useState } from "react";

type Props = {
  src: string;
  min?: number;
  max?: number;
  initial?: number;
  onSizeChange?: (size: number) => void;
  hideSlider?: boolean;
};

export default function ResizeImage({
  src,
  min = 50,
  max = 300,
  initial,
  onSizeChange,
  hideSlider = false,
}: Props) {
  // valeur par défaut si "initial" n'est pas passé
  const [size, setSize] = useState(initial ?? min);

  const handleChange = (newSize: number) => {
    setSize(newSize);
    if (onSizeChange) {
      onSizeChange(newSize);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* Conteneur de l'image avec hauteur fixe */}
      <div
        style={{
          height: max,               // hauteur max de l’image
          display: "flex",
          alignItems: "flex-end",    // l’image est collée en bas
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        <img
          src={src}
          alt="resizable"
          style={{ width: "auto", height: size }}
        />
      </div>

      {/* La barre ne bouge plus, elle est toujours à la même place */}
      {!hideSlider && (
        <input
          type="range"
          min={min}
          max={max}
          value={size}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ backgroundColor: 'white', height: '3px' }}
        />
      )}
    </div>
  );
}

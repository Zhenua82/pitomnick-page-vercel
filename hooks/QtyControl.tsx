import React from "react";
import { useHoldButton2 } from "@/hooks/useHoldButton2";
import styles from "@/hooks/QtyControl.module.css";

type Props = {
  onChange: (delta: number) => void;
  children: React.ReactNode;
  className?: string;
};

export const QtyControl: React.FC<Props> = ({
  onChange,
  children,
  className,
}) => {
  const { start, stop } = useHoldButton2();

  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        className={styles.minus}
        onPointerDown={(e) => {
          e.preventDefault();
          start(() => onChange(-1));
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        style={{ touchAction: "none" }}
      >
        −
      </button>

      {children}

      <button
        className={styles.plus}
        onPointerDown={(e) => {
          e.preventDefault();
          start(() => onChange(1));
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        style={{ touchAction: "none" }}
      >
        +
      </button>
    </div>
  );
};

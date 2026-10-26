type CornerFrameProps = {
  /** Offset in px the brackets sit outside the box. */
  offset?: number;
  className?: string;
};

/**
 * Four L-shaped corner marks styled after a computer-vision bounding-box
 * annotation. The parent must be `relative`.
 */
export function CornerFrame({ offset = 8, className = "" }: CornerFrameProps) {
  const base = `pointer-events-none absolute h-4 w-4 border-signal ${className}`;
  const pos = (v: string, h: string) => ({ [v]: -offset, [h]: -offset });
  return (
    <>
      <span aria-hidden data-corner className={`${base} border-l-2 border-t-2`} style={pos("top", "left")} />
      <span aria-hidden data-corner className={`${base} border-r-2 border-t-2`} style={pos("top", "right")} />
      <span aria-hidden data-corner className={`${base} border-b-2 border-l-2`} style={pos("bottom", "left")} />
      <span aria-hidden data-corner className={`${base} border-b-2 border-r-2`} style={pos("bottom", "right")} />
    </>
  );
}

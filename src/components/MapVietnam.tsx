"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VIETNAM_LOCATIONS, MapLocation } from "@/lib/utils";
import { cn } from "@/lib/utils";

type MapVietnamProps = {
  onSelectLocation?: (location: MapLocation) => void;
  completedLocationIds?: string[];
};

type ContentRect = { left: number; top: number; width: number; height: number };

export default function MapVietnam({
  onSelectLocation,
  completedLocationIds = [],
}: MapVietnamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [contentRect, setContentRect] = useState<ContentRect | null>(null);

  // Load natural size of the image once
  useEffect(() => {
    const img = new window.Image();
    img.onload = () =>
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = "/images/map-vietnam.png";
  }, []);

  const computeContentRect = useCallback(() => {
    const el = containerRef.current;
    if (!el || !natural) return;
    const { w: iw, h: ih } = natural;
    const cr = el.getBoundingClientRect();
    const cw = cr.width;
    const ch = cr.height;
    const imageRatio = iw / ih;
    const containerRatio = cw / ch;
    let width = cw;
    let height = ch;
    if (containerRatio > imageRatio) {
      // letterbox left-right
      height = ch;
      width = ch * imageRatio;
    } else {
      // letterbox top-bottom
      width = cw;
      height = cw / imageRatio;
    }
    const left = (cw - width) / 2;
    const top = (ch - height) / 2;
    setContentRect({ left, top, width, height });
  }, [natural]);

  useEffect(() => {
    computeContentRect();
    const onResize = () => computeContentRect();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeContentRect]);

  const markers = useMemo(() => {
    if (!contentRect)
      return [] as Array<{
        loc: MapLocation;
        style: React.CSSProperties;
        isDone: boolean;
      }>;
    return VIETNAM_LOCATIONS.map((loc) => {
      const isDone = completedLocationIds.includes(loc.id);
      const left =
        contentRect.left + (loc.position.x / 100) * contentRect.width;
      const top = contentRect.top + (loc.position.y / 100) * contentRect.height;
      return {
        loc,
        isDone,
        style: { left, top, position: "absolute" as const },
      };
    });
  }, [contentRect, completedLocationIds]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div
        ref={containerRef}
        className="w-full aspect-square relative bg-white rounded-xl shadow overflow-hidden"
      >
        <Image
          src="/images/map-vietnam.png"
          alt="Bản đồ Việt Nam"
          fill
          className="object-contain select-none"
          priority
        />

        {markers.map(({ loc, isDone, style }) => (
          <button
            key={loc.id}
            aria-label={loc.name}
            onClick={() => onSelectLocation?.(loc)}
            className={cn(
              "-translate-x-1/2 -translate-y-1/2 rounded-full border-2 backdrop-blur px-2 py-1 cursor-pointer hover:scale-105 transition-transform duration-300",
              isDone
                ? "bg-green-600/80 border-white text-white"
                : "bg-red-700/80 border-white text-white hover:bg-red-800/90"
            )}
            style={style}
          >
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

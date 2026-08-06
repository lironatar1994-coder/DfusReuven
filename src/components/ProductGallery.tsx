"use client";

import Image from "@/components/Img";
import { useState } from "react";

type Shot = { src: string; alt: string; label: string };

export default function ProductGallery({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const active = shots[index];

  return (
    <div>
      <div className="pd-main">
        <Image src={active.src} alt={active.alt} width={800} height={600} priority />
      </div>
      <div className="pd-thumbs">
        {shots.map((shot, i) => (
          <button
            key={shot.src + i}
            type="button"
            aria-current={i === index}
            aria-label={`תצוגה ${i + 1}: ${shot.label}`}
            onClick={() => setIndex(i)}
          >
            <Image src={shot.src} alt="" width={200} height={200} />
          </button>
        ))}
      </div>
    </div>
  );
}

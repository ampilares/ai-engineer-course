"use client";

import { useState } from "react";

/** Privacy-friendly YouTube facade: no third-party requests until the user clicks play. */
export function VideoEmbed({ id, title, creator }: { id: string; title: string; creator: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="my-6 not-prose">
      <div className="relative aspect-video rounded-xl overflow-hidden border line bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 text-white cursor-pointer group"
            aria-label={`Play video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
              loading="lazy"
            />
            <span className="relative z-10 w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl shadow-lg">
              ▶
            </span>
            <span className="relative z-10 font-medium text-sm px-4 text-center drop-shadow">{title}</span>
          </button>
        )}
      </div>
      <figcaption className="text-xs muted mt-2">
        Video: “{title}” by {creator} (YouTube). Loads only when you press play.
      </figcaption>
    </figure>
  );
}

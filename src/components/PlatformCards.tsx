const platforms = [
  {
    name: "Instagram",
    label: "Follow on IG",
    href: "https://www.instagram.com/houzeboys",
    icon: InstagramIcon,
    iconColor: "text-[#E4405F]",
  },
  {
    name: "Spotify",
    label: "Listen on Spotify",
    href: "https://open.spotify.com/artist/4Jgl4PkGfhfQ4WmkGzE5Zb",
    icon: SpotifyIcon,
    iconColor: "text-[#1DB954]",
  },
  {
    name: "SoundCloud",
    label: "Listen on SoundCloud",
    href: "https://soundcloud.com/houzeboys",
    icon: SoundCloudIcon,
    iconColor: "text-[#FF5500]",
  },
  {
    name: "YouTube",
    label: "Watch on YouTube",
    href: "https://www.youtube.com/@HouzeBoys",
    icon: YoutubeIcon,
    iconColor: "text-[#FF0000]",
  },
  {
    name: "Apple Music",
    label: "Stream on Apple",
    href: "https://music.apple.com/us/artist/houze-boys/1801765314",
    icon: AppleMusicIcon,
    iconColor: "text-[#FA243C]",
  },

];

export default function PlatformCards() {
  return (
    <section id="socials" className="max-w-6xl mx-auto px-6 py-12 w-full">
      <h4 className="text-center text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 font-bold">
        Listen &amp; Follow
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <a
              key={p.name}
              href={p.href}
              target={p.href !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white/3 border border-white/10 p-4 sm:p-6 rounded-2xl flex items-center gap-3 sm:gap-4 hover:-translate-y-1 hover:border-white/40 transition-all duration-300"
            >
              <Icon className={p.iconColor} />
              <div>
                <p className="text-xs text-gray-500">{p.name}</p>
                <p className="font-bold text-white">{p.label}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SoundCloudIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.56 8.87V17h8.76c1.45-.22 2.44-1.4 2.44-2.77 0-1.15-.7-2.22-1.8-2.63.23-1.87-.73-3.62-2.32-4.44-1.59-.82-3.5-.39-4.63.97-.43-.48-1.03-.74-1.64-.72-1.21.03-2.2 1.02-2.2 2.22-.12-.06-.24-.1-.37-.12-.5-.07-1 .1-1.33.44-.33.35-.47.83-.37 1.31.1.47.43.86.88 1.06l.58.11zM0 15.2c0 1 .8 1.8 1.8 1.8 1 0 1.8-.8 1.8-1.8V11c0-1-.8-1.8-1.8-1.8C.8 9.2 0 10 0 11v4.2zm4.8 1.4c0 .99.81 1.8 1.8 1.8.99 0 1.8-.81 1.8-1.8V9.8c0-.99-.81-1.8-1.8-1.8-.99 0-1.8.81-1.8 1.8v6.8zm4 .4c0 .99.81 1.8 1.8 1.8.99 0 1.8-.81 1.8-1.8V9c0-.99-.81-1.8-1.8-1.8-.99 0-1.8.81-1.8 1.8v8z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function AppleMusicIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

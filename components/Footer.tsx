import { CloudinaryIcon } from "./SVG"

export default function Footer() {
  return (
    <footer>
      <p className="flex gap-2">
        Made with
        <span role="img" aria-label="love">
          ❤️
        </span>
        by
        <a
          href="https://hugoavila.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff006a] font-semibold hover:text-pink-50"
        >
          Hugo Avila
        </a>
      </p>
      <div className="flex flex-row w-full justify-center items-center gap-2">
        <span>Power by </span>
        <a
          className="fill-[#8997ee] hover:fill-slate-50"
          href="https://cloudinary.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CloudinaryIcon />
        </a>
      </div>
    </footer>
  )
}

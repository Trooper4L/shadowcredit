export default function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 left-64 flex justify-between items-center px-8 py-3 z-30 bg-[#131314] border-t border-[#353436]">
      <span className="font-label text-[10px] tracking-widest uppercase text-[#c4c9ac] opacity-50">
        &copy; 2024 ShadowCredit Institutional
      </span>
      <div className="flex gap-8">
        <a
          className="font-label text-[10px] tracking-widest uppercase text-[#c4c9ac] opacity-50 hover:text-[#CCFF00] underline-offset-4 transition-colors"
          href="#"
        >
          Docs
        </a>
        <a
          className="font-label text-[10px] tracking-widest uppercase text-[#c4c9ac] opacity-50 hover:text-[#CCFF00] underline-offset-4 transition-colors"
          href="#"
        >
          Explorer
        </a>
        <a
          className="font-label text-[10px] tracking-widest uppercase text-[#c4c9ac] opacity-50 hover:text-[#CCFF00] underline-offset-4 transition-colors"
          href="#"
        >
          Twitter
        </a>
        <a
          className="font-label text-[10px] tracking-widest uppercase text-[#c4c9ac] opacity-50 hover:text-[#CCFF00] underline-offset-4 transition-colors"
          href="#"
        >
          Discord
        </a>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full flex justify-between items-center px-6 md:px-12 py-6 bg-transparent z-50 pointer-events-none">
      <div className="font-headline text-[10px] tracking-widest text-primary/40 uppercase">
        © 2024 AETHER DIGITAL TWIN. ALL RIGHTS RESERVED.
      </div>
      <nav className="flex gap-8 font-headline text-[10px] tracking-widest pointer-events-auto">
        <a className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" href="#">Privacy Policy</a>
        <a className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" href="#">System Status</a>
        <a className="text-primary/40 hover:text-tertiary transition-colors cursor-pointer uppercase" href="#">Manual</a>
      </nav>
    </footer>
  );
}

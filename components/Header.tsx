import Link from './Link';
// import MobileNav from './MobileNav';
// import SearchButton from "./SearchButton";
// import ThemeSwitch from "./ThemeSwitch";

const siteMetadata = {
  headerTitle: 'TEMCRYPTO',
};

const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/send', title: 'Send' },
  { href: '/receive', title: 'Receive' },
];

const Header = () => {
  return (
    <header className="sticky -top-1 z-40 w-full backdrop-blur flex items-center justify-center sm:justify-between transition-colors duration-500 lg:z-50 border-b border-slate-900/10 dark:border-slate-50/[0.06] supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75 shadow-md px-8 py-6">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="flex h-6 items-center text-3xl font-semibold">
              <span className="text-pink-500">TEM</span>
              <span className="text-slate-800 dark:text-white">CRYPTO</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link: any) => link.href !== '/')
          .map((link: any) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-slate-800 dark:text-white sm:block uppercase hover:text-pink-500"
            >
              {link.title}
            </Link>
          ))}
        {/* <SearchButton /> */}
        {/* <ThemeSwitch /> */}
        {/* <MobileNav /> */}
      </div>
    </header>
  );
};

export default Header;

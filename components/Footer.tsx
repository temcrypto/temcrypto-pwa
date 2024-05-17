// 'use client';

// import { useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { usePathname } from 'next/navigation';
// import { FaPix, FaPlus } from 'react-icons/fa6';
// import { Sheet } from 'react-modal-sheet';

// import { useDynamicContext } from '@/lib/dynamicxyz';

// import Link from './Link';

// export default function Footer() {
//   const { status: authStatus } = useSession({ required: false });
//   const { isAuthenticated } = useDynamicContext();
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const pathname = usePathname();

//   const isHome = pathname === '/';
//   const isWallet = pathname === '/wallet';

//   // If not authenticated or , don't show the footer
//   if (
//     'authenticated' !== authStatus ||
//     '/start' === pathname ||
//     !isAuthenticated
//   ) {
//     console.log('Footer ~ not authenticated');
//     return null;
//   }

//   return (
//     <div className="animate-bounce-from-bottom">
//       <Sheet
//         isOpen={isOpen}
//         onClose={() => {
//           setIsOpen(false);
//         }}
//         detent="content-height"
//         // rootId={sheetRootId}
//       >
//         <Sheet.Container>
//           <Sheet.Header />
//           <Sheet.Content>
//             <nav className="flex flex-col justify-center space-y-6 safe-m-bottom">
//               <Link
//                 href="/send"
//                 className="flex py-2"
//                 onClick={() => {
//                   setIsOpen(false);
//                 }}
//               >
//                 <div className="flex flex-row">
//                   <div className="flex items-center justify-center text-3xl text-[#32BCAD]">
//                     <FaPix />
//                   </div>
//                   <div className="ml-4">
//                     <div className="">Send Pix</div>
//                     <div className="text-slate-400 font-light text-sm">
//                       Scan a QR code or enter a Chave Pix
//                     </div>
//                   </div>
//                 </div>
//               </Link>

//               <Link
//                 href="/receive"
//                 className="flex py-2"
//                 onClick={() => {
//                   setIsOpen(false);
//                 }}
//               >
//                 <div className="flex flex-row">
//                   <div className="flex items-center justify-center text-3xl text-[#32BCAD]">
//                     <FaPix />
//                   </div>
//                   <div className="ml-4">
//                     <div className="">Receive Pix</div>
//                     <div className="text-slate-400 font-light text-sm">
//                       Generate a QR code to receive Pix
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </nav>
//           </Sheet.Content>
//         </Sheet.Container>
//         <Sheet.Backdrop onTap={() => setIsOpen(false)} />
//       </Sheet>

//       <footer className="w-full animate-background bg-[length:_400%_400%] [animation-duration:_8s] bg-gradient-to-r from-cyan-500 dark:from-cyan-500/55 via-pink-300 dark:via-pink-500/55 to-yellow-500 dark:to-yellow-500/55 pt-0.5 safe-m-bottom">
//         <nav className="flex flex-row items-center text-sm text-center bg-white dark:bg-slate-800 p-3">
//           <div className="basis-1/3">
//             <Link
//               href="/"
//               className={`uppercase transition ease-in-out ${
//                 isHome ? 'pointer-events-none text-pink-500' : ''
//               }`}
//               aria-label="Home"
//               aria-disabled={isHome}
//               tabIndex={isHome ? -1 : undefined}
//             >
//               Home
//             </Link>
//           </div>
//           <div className="flex basis-1/3 justify-center">
//             <button
//               type="button"
//               className="rounded-full p-2 text-white text-xl transition ease-in-out border-2 border-pink-500 focus:border-pink-500 bg-pink-500 ring ring-pink-300 focus:ring-pink-300 active:bg-pink-700 active:ring-pink-400 active:border-pink-500 hover:bg-pink-600 hover:ring-pink-300"
//               aria-label="New"
//               onClick={() => {
//                 setIsOpen(true);
//               }}
//             >
//               <FaPlus />
//             </button>
//           </div>
//           <div className="basis-1/3">
//             <Link
//               href="/wallet"
//               className={`uppercase transition ease-in-out ${
//                 isWallet ? 'pointer-events-none text-pink-500' : ''
//               }`}
//               aria-label="My Wallet"
//               aria-disabled={isWallet}
//               tabIndex={isWallet ? -1 : undefined}
//             >
//               My Wallet
//             </Link>
//           </div>
//         </nav>
//       </footer>
//     </div>
//   );
// }

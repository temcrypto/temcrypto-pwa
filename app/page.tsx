import Link from 'next/link';
import { FaCheck, FaPix } from 'react-icons/fa6';
// import { LuDownload, LuUpload } from 'react-icons/lu';
import { SiTether } from 'react-icons/si';
import PageWrapper from '@/components/PageWrapper';

export default function App() {
  return (
    <PageWrapper id="page-app">
      <section className="flex flex-col space-y-8 justify-between items-center sm:flex-row sm:space-y-0 sm:space-x-8">
        <div className="w-full p-8 shadow-xl rounded-2xl bg-slate-700 text-gray-400">
          <div className="mb-8 flex items-center">
            <div className="flex rounded-2xl w-16 h-16 bg-white items-center justify-center text-3xl text-[#009393]">
              {/* <LuUpload /> */}
              <SiTether />
            </div>
            <div className="ml-5">
              <span className="block text-3xl font-semibold text-white">
                Send
              </span>
              {/* <span>
              <span className="font-medium text-xl align-top">$&thinsp;</span>
              <span className="text-3xl font-bold text-white">24 </span>
            </span>
            <span className="font-medium">/ user</span> */}
            </div>
          </div>
          <ul className="mb-8 font-medium">
            <li className="flex text-lg mb-2 items-center">
              <FaCheck />
              <span className="ml-3">
                Pay to <span className="text-white">any Pix</span> using{' '}
                <span className="text-white">USDT</span>
              </span>
            </li>
            <li className="flex text-lg mb-2 items-center">
              <FaCheck />
              <span className="ml-3">
                Enjoy the <span className="text-white">best rate</span>
              </span>
            </li>
            <li className="flex text-lg items-center">
              <FaCheck />
              <span className="ml-3">
                <span className="text-white">No bank </span>
                account needed
              </span>
            </li>
          </ul>
          <Link
            href="/send"
            className="flex justify-center items-center py-5 px-4 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl text-white text-xl"
          >
            Send
          </Link>
        </div>

        <div className="w-full p-8 bg-white shadow-xl rounded-2xl">
          <div className="mb-8 flex items-center">
            <div className="flex rounded-2xl w-16 h-16 bg-white items-center justify-center text-3xl text-[#32BCAD] border border-[#32BCAD]">
              {/* <LuDownload /> */}
              <FaPix />
            </div>
            <div className="ml-5">
              <span className="block text-3xl font-semibold dark:text-slate-800">
                Receive
              </span>
              {/* <span>
              <span className="font-medium text-gray-500 text-xl align-top">
                $&thinsp;
              </span>
              <span className="text-3xl font-bold">10 </span>
            </span>
            <span className="text-gray-500 font-medium">/ user</span> */}
            </div>
          </div>
          <ul className="mb-8 font-medium text-gray-500">
            <li className="flex text-lg mb-2 items-center">
              <FaCheck />
              <span className="ml-3">
                Get paid to <span className="text-black">your Pix</span>
              </span>
            </li>
            <li className="flex text-lg mb-2 items-center">
              <FaCheck />
              <span className="ml-3">
                Enjoy flexible <span className="text-black">amounts</span>
              </span>
            </li>
            <li className="flex text-lg items-center">
              <FaCheck />
              <span className="ml-3">
                <span className="text-black">No account</span> needed
              </span>
            </li>
          </ul>
          <Link
            href={'/receive'}
            className="flex justify-center items-center py-5 px-4 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl text-white text-xl"
          >
            Receive
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}

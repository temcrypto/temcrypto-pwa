'use client';

import Link from 'next/link';
import { FaCheck, FaPix } from 'react-icons/fa6';
import { SiTether } from 'react-icons/si';

import PageWrapper from '@/components/PageWrapper';
import HomeActions from '@/components/HomeActions';

export default function App() {
  return (
    <PageWrapper id="page-app">
      <section className="flex flex-col space-y-3 justify-between sm:flex-row sm:space-y-0 sm:space-x-8">
        {/* <div className="relative group mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative px-7 py-6 bg-white dark:bg-slate-700 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-3">
            <div className="flex rounded-full w-20 h-16 bg-white items-center justify-center text-3xl text-[#32BCAD] border-2 border-[#32BCAD]">
              <FaPix />
            </div>
            <div className="space-y-2">
              <p className="text-slate-800 dark:text-white">
                Learn how to make a glowing gradient background!
              </p>
              <a
                href="https://braydoncoyer.dev/blog/tailwind-gradients-how-to-make-a-glowing-gradient-background"
                className="block text-indigo-400 group-hover:text-slate-800 transition duration-200"
                target="_blank"
              >
                Read Article →
              </a>
            </div>
          </div>
        </div> */}

        <HomeActions />

        <div className="w-full p-8 shadow-md rounded-2xl bg-slate-700 text-gray-400 mt-10">
          <div className="mb-8 flex items-center">
            <div className="flex rounded-2xl w-16 h-16 bg-white items-center justify-center text-3xl text-[#009393]">
              <SiTether />
            </div>
            <div className="ml-5">
              <span className="block text-3xl font-semibold text-white">
                Send
              </span>
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

        <div className="w-full p-8 bg-white shadow-md rounded-2xl">
          <div className="mb-8 flex items-center">
            <div className="flex rounded-2xl w-16 h-16 bg-white items-center justify-center text-3xl text-[#32BCAD] border border-[#32BCAD]">
              <FaPix />
            </div>
            <div className="ml-5">
              <span className="block text-3xl font-semibold dark:text-slate-800">
                Receive
              </span>
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

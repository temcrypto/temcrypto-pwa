if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,_)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const r=e=>i(e,a),o={module:{uri:a},exports:c,require:r};s[a]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(_(...e),c)))}}define(["./workbox-9b4d2a02"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"e9ae5aad99f25dfd0a4b55d261c932e9"},{url:"/_next/static/chunks/0f120a9b-fb9b35ac7843d411.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/138-3959430f992f9258.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/23-55977c9f7a40bb5b.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/239.f98411d2234168e9.js",revision:"f98411d2234168e9"},{url:"/_next/static/chunks/2631e2f4-6515825f3eb0322f.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/300-391115393d1e06ca.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/30a37ab2-d1bd675008e824c2.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/314.6f9ec3cecb64404b.js",revision:"6f9ec3cecb64404b"},{url:"/_next/static/chunks/318.67461aab1aa569d4.js",revision:"67461aab1aa569d4"},{url:"/_next/static/chunks/395.bdbe55eb0ce9de51.js",revision:"bdbe55eb0ce9de51"},{url:"/_next/static/chunks/3a91511d-7e5111c2118eb31e.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/53c13509-17ffde4e28e45d60.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/59650de3-416ef35b9bcf07a2.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/604e8bb3-0bf2859d549586a8.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/642-2d6109f6bd58d26f.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/866.8bc93b4be601e6c8.js",revision:"8bc93b4be601e6c8"},{url:"/_next/static/chunks/912.d419a5ba6d71e330.js",revision:"d419a5ba6d71e330"},{url:"/_next/static/chunks/9c4e2130-1a98c7b9f9711b43.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/_not-found/page-4df488561955b841.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/layout-6c98b293e605c869.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/page-f3bbb87570ccfc3a.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/receive/page-9b15d53f0ebe5f34.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/send/page-1b3c0915c0ad1b11.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/signin/page-0e6c14dcf12e91de.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/txs/%5BtxId%5D/page-529100396157f5ed.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/app/wallet/page-70bb8eaa2a9726a2.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/fd9d1056-a1d4127bb5bc275e.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/framework-b370f160bb96059c.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/main-6894b96ecd581668.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/main-app-1b85c85124b475bb.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-004a8036c2611d63.js",revision:"qpHffjClsAsHf5o_rDicS"},{url:"/_next/static/css/e88048cfcbb81764.css",revision:"e88048cfcbb81764"},{url:"/_next/static/media/0610ebff456d6cfc-s.woff2",revision:"8786f06e95694337521729d147b3f669"},{url:"/_next/static/media/21ed5661b47f7f6d-s.p.woff2",revision:"91c3bc1f55db641843550a62e39f0031"},{url:"/_next/static/media/8a9e72331fecd08b-s.woff2",revision:"f8a4d4cec8704b696ec245377c0e188e"},{url:"/_next/static/media/bde16c1724335d95-s.woff2",revision:"c56527d8c69315a82039a810338fd378"},{url:"/_next/static/media/e3b8d441242e07fb-s.woff2",revision:"8699475078b0c1b86dbe7ad907bb4e81"},{url:"/_next/static/qpHffjClsAsHf5o_rDicS/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/qpHffjClsAsHf5o_rDicS/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/splash_screens/10.2__iPad_landscape.png",revision:"d0d3b305137ad46f9feacc4c079eb566"},{url:"/splash_screens/10.2__iPad_portrait.png",revision:"c46845848ad8fe0003058a790277555a"},{url:"/splash_screens/10.5__iPad_Air_landscape.png",revision:"fd144de852504f5f73fe58db131a55de"},{url:"/splash_screens/10.5__iPad_Air_portrait.png",revision:"08f9bc07bc0d3be7e1307402667e8dd7"},{url:"/splash_screens/10.9__iPad_Air_landscape.png",revision:"763ffde5658420a9cc2fd320694d5cdd"},{url:"/splash_screens/10.9__iPad_Air_portrait.png",revision:"905d478459e5fa42ab05a724f416793a"},{url:"/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",revision:"d0ebae68e3e164ec1c1b1f28b3e0c62c"},{url:"/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",revision:"55b558f0acec04f8e56ba016d9386943"},{url:"/splash_screens/12.9__iPad_Pro_landscape.png",revision:"d8c5fc7c58afcb6910d13021b5ff06b8"},{url:"/splash_screens/12.9__iPad_Pro_portrait.png",revision:"d1a1f7c8715ce663c7d154c9dcb67a54"},{url:"/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",revision:"6adfc22f2afb97b83cdd13a94f039e8b"},{url:"/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",revision:"124c0aefd2ce8e260acea4f80fa2d90e"},{url:"/splash_screens/8.3__iPad_Mini_landscape.png",revision:"160dce452ac55b6761215cb388486609"},{url:"/splash_screens/8.3__iPad_Mini_portrait.png",revision:"101dbd1481768fa8fa91b2500618f967"},{url:"/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",revision:"3634671d97ab20e06e6baf9ee6172c8c"},{url:"/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",revision:"eafcf3a0e25c4ef04f6e7790b1578537"},{url:"/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",revision:"3fcaa7153b5eb59cdc35dd9806902c2b"},{url:"/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",revision:"cfb3f1755ef19999c71865af775519af"},{url:"/splash_screens/iPhone_11__iPhone_XR_landscape.png",revision:"d38a60fef65360531ac75c84717861fd"},{url:"/splash_screens/iPhone_11__iPhone_XR_portrait.png",revision:"fd8c0428310bde7726165f73d2ea1b80"},{url:"/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",revision:"31b15fb24e7de942653dc1aba0f59fe5"},{url:"/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",revision:"c56fc840638118b8ddbb096df4d93208"},{url:"/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",revision:"93dd424b4113008e690b973642c5663b"},{url:"/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",revision:"afd8a22c895b9ca3137afb8bc3a3029e"},{url:"/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",revision:"e18bb82602415a6670abc448fbf3e8c6"},{url:"/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",revision:"e577145364097389c7715b85cb1def25"},{url:"/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png",revision:"5c0a2006b554535cec8e2226670255d8"},{url:"/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",revision:"5f54150b7276aed11f1b9318295aef8d"},{url:"/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png",revision:"59533d4600d57028598cb60d040479a0"},{url:"/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",revision:"d1713ea239ecad5f811860b1900101d4"},{url:"/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",revision:"6bee7f66e3b6e118979a80e6fc6278fe"},{url:"/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",revision:"62082eeba3c5840731ec1f0c4b1d53e9"},{url:"/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",revision:"36bca7cfd85db519c5fb400412260ddc"},{url:"/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",revision:"cf11b22b6329f60a532fc5ac08d6e4de"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

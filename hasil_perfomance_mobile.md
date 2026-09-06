44
Performance
100
Accessibility
100
Best Practices
83
SEO
2/3
Agentic Browsing
44
FCP
+6
LCP
+11
TBT
+0
CLS
+25
SI
+2
Performance
Values are estimated and may vary. The performance score is calculated directly from these metrics.See calculator.
0–49
50–89
90–100
Final Screenshot

Metrics
Expand view
First Contentful Paint
2.6 s
Largest Contentful Paint
4.2 s
Total Blocking Time
17,850 ms
Cumulative Layout Shift
0
Speed Index
7.8 s
Captured at Sep 6, 2026, 10:06 AM GMT+7
Emulated Moto G Power with Lighthouse 13.4.1
Single page session
Initial page load
Slow 4G throttling
Using HeadlessChromium 151.0.7922.71 with lr
View Treemap
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Show audits relevant to:

All

FCP

LCP

TBT
Insights
Improve image delivery Est savings of 250 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeLCPFCPUnscored
URL
Resource Size
Est Savings
vercel.app 1st party
285.6 KiB	249.6 KiB
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
…logo/logo.webp(pixar-character.vercel.app)
190.2 KiB
165.0 KiB
Increasing the image compression factor could improve this image's download size.
104.0 KiB
This image file is larger than it needs to be (1200x441) for its displayed dimensions (649x238). Use responsive images to reduce the image download size.
134.6 KiB
NEBULA SIREN
<img alt="NEBULA SIREN" fetchpriority="high" width="1200" height="800" class="w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pi…" src="/assets/pixar/nobg/character5.webp">
…nobg/character5.webp(pixar-character.vercel.app)
95.5 KiB
84.6 KiB
This image file is larger than it needs to be (2048x1151) for its displayed dimensions (692x389). Use responsive images to reduce the image download size.
84.6 KiB
Render-blocking requests Est savings of 1,110 ms
Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.LCPFCPUnscored
URL
Transfer Size
Duration
vercel.app 1st party
11.2 KiB	170 ms
/assets/index-DdG84H3f.css(pixar-character.vercel.app)
11.2 KiB
170 ms
Google Fonts cdn 
1.5 KiB	750 ms
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com)
1.5 KiB
750 ms
LCP request discovery
Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loadingLCPUnscored
LCP resources should not use loading=lazy
fetchpriority=high applied
Request is discoverable in initial document
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
Network dependency tree
Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.LCPUnscored
Maximum critical path latency: 430 ms
Initial Navigation
https://pixar-character.vercel.app - 101 ms, 1.24 KiB
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com) - 120 ms, 1.50 KiB
…v9/NGSwv5HMA….woff2(fonts.gstatic.com) - 430 ms, 44.66 KiB
/assets/index-cFMaG3-L.js(pixar-character.vercel.app) - 230 ms, 129.45 KiB
/assets/index-DdG84H3f.css(pixar-character.vercel.app) - 142 ms, 11.20 KiB
Preconnected origins
preconnect hints help the browser establish a connection earlier in the page load, saving time when the first request for that origin is made. The following are the origins that the page preconnected to.
Origin
Source
https://fonts.googleapis.com/
head > link
<link rel="preconnect" href="https://fonts.googleapis.com">
https://fonts.gstatic.com/
head > link
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
Preconnect candidates
Add preconnect hints to your most important origins, but try to use no more than 4.
No additional origins are good candidates for preconnecting
Optimize DOM size
A large DOM can increase the duration of style calculations and layout reflows, impacting page responsiveness. A large DOM will also increase memory usage. Learn how to avoid an excessive DOM size.Unscored
Statistic
Element
Value
Total elements
350
DOM depth
button.relative > div.relative > svg.w-4 > polyline
<polyline points="9 18 15 12 9 6">
10
Most children
div#root > div.relative > div.fixed > div.absolute
<div class="absolute inset-0 pointer-events-none overflow-hidden">
18
LCP breakdown
Each subpart has specific improvement strategies. Ideally, most of the LCP time should be spent on loading the resources, not within delays.LCPUnscored
Subpart
Duration
Time to first byte
0 ms
Resource load delay
330 ms
Resource load duration
50 ms
Element render delay
440 ms
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
3rd parties
3rd party code can significantly impact load performance. Reduce and defer loading of 3rd party code to prioritize your page's content.Unscored
3rd party
Transfer size
Main thread time
Google Fonts cdn 
46 KiB	0 ms
…v9/NGSwv5HMA….woff2(fonts.gstatic.com)
45 KiB
0 ms
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com)
1 KiB
0 ms
These insights are also available in the Chrome DevTools Performance Panel - record a trace to view more detailed information.
Diagnostics
Minimize main-thread work 25.6 s
Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. Learn how to minimize main-thread workTBTUnscored
Category
Time Spent
Other
24,544 ms
Script Evaluation
654 ms
Style & Layout
213 ms
Rendering
120 ms
Script Parsing & Compilation
42 ms
Parse HTML & CSS
5 ms
Reduce unused JavaScript Est savings of 65 KiB
Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.LCPFCPUnscored
URL
Transfer Size
Est Savings
vercel.app 1st party
128.8 KiB	65.1 KiB
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
128.8 KiB
65.1 KiB
Avoid long main-thread tasks 20 long tasks found
Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. Learn how to avoid long main-thread tasksTBTUnscored
URL
Start Time
Duration
vercel.app 1st party
6,201 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
2,622 ms
382 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
5,311 ms
348 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
9,035 ms
342 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
4,976 ms
335 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
6,875 ms
333 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
20,264 ms
331 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
3,726 ms
328 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
7,446 ms
324 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
14,742 ms
316 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
6,367 ms
315 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
10,684 ms
314 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
4,054 ms
295 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
12,383 ms
286 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
5,659 ms
285 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
10,028 ms
281 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
3,295 ms
280 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
9,573 ms
280 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
24,992 ms
277 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
8,357 ms
275 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
25,984 ms
274 ms

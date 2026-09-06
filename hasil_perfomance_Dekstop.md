62
Performance
100
Accessibility
100
Best Practices
83
SEO
2/3
Agentic Browsing
62
FCP
+10
LCP
+24
TBT
+0
CLS
+25
SI
+3
Performance
Values are estimated and may vary. The performance score is calculated directly from these metrics.See calculator.
0–49
50–89
90–100
Final Screenshot

Metrics
Expand view
First Contentful Paint
0.7 s
Largest Contentful Paint
0.9 s
Total Blocking Time
22,910 ms
Cumulative Layout Shift
0
Speed Index
2.9 s
Captured at Sep 6, 2026, 10:06 AM GMT+7
Emulated Desktop with Lighthouse 13.4.1
Single page session
Initial page load
Custom throttling
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
Improve image delivery Est savings of 207 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeLCPFCPUnscored
URL
Resource Size
Est Savings
vercel.app 1st party
285.6 KiB	207.3 KiB
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
…logo/logo.webp(pixar-character.vercel.app)
190.2 KiB
146.9 KiB
Increasing the image compression factor could improve this image's download size.
104.0 KiB
This image file is larger than it needs to be (1200x441) for its displayed dimensions (850x312). Use responsive images to reduce the image download size.
94.8 KiB
NEBULA SIREN
<img alt="NEBULA SIREN" fetchpriority="high" width="1200" height="800" class="w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pi…" src="/assets/pixar/nobg/character5.webp">
…nobg/character5.webp(pixar-character.vercel.app)
95.5 KiB
60.4 KiB
This image file is larger than it needs to be (2048x1151) for its displayed dimensions (1242x698). Use responsive images to reduce the image download size.
60.4 KiB
Render-blocking requests Est savings of 220 ms
Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.LCPFCPUnscored
URL
Transfer Size
Duration
vercel.app 1st party
11.2 KiB	70 ms
/assets/index-DdG84H3f.css(pixar-character.vercel.app)
11.2 KiB
70 ms
Google Fonts cdn 
1.5 KiB	200 ms
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com)
1.5 KiB
200 ms
LCP breakdown
Each subpart has specific improvement strategies. Ideally, most of the LCP time should be spent on loading the resources, not within delays.LCPUnscored
Subpart
Duration
Time to first byte
0 ms
Resource load delay
280 ms
Resource load duration
100 ms
Element render delay
2,420 ms
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
LCP request discovery
Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loadingLCPUnscored
LCP resources should not use loading=lazy
fetchpriority=high applied
Request is discoverable in initial document
Pixar Logo
<img alt="Pixar Logo" fetchpriority="high" loading="eager" width="650" height="239" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.webp">
Network dependency tree
Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.LCPUnscored
Maximum critical path latency: 11,654 ms
Initial Navigation
https://pixar-character.vercel.app - 91 ms, 1.24 KiB
/api/maintenance(puretext.audio-io.com) - 10,645 ms, 0.00 KiB
/api/maintenance(puretext.audio-io.com) - 11,654 ms, 0.00 KiB
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com) - 93 ms, 1.50 KiB
…v9/NGSwv5HMA….woff2(fonts.gstatic.com) - 322 ms, 44.66 KiB
/assets/index-cFMaG3-L.js(pixar-character.vercel.app) - 201 ms, 129.45 KiB
/assets/index-DdG84H3f.css(pixar-character.vercel.app) - 156 ms, 11.20 KiB
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
Minimize main-thread work 26.1 s
Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. Learn how to minimize main-thread workTBTUnscored
Category
Time Spent
Other
25,674 ms
Script Evaluation
301 ms
Style & Layout
72 ms
Rendering
40 ms
Script Parsing & Compilation
31 ms
Garbage Collection
4 ms
Parse HTML & CSS
4 ms
Reduce unused JavaScript Est savings of 65 KiB
Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.LCPFCPUnscored
URL
Transfer Size
Est Savings
vercel.app 1st party
128.8 KiB	65.0 KiB
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
128.8 KiB
65.0 KiB
Avoid long main-thread tasks 20 long tasks found
Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. Learn how to avoid long main-thread tasksTBTUnscored
URL
Start Time
Duration
vercel.app 1st party
15,649 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
16,561 ms
1,004 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
24,838 ms
952 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
21,376 ms
905 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
20,070 ms
889 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
15,706 ms
855 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
12,313 ms
814 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
8,969 ms
805 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
22,281 ms
797 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
8,203 ms
766 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
13,127 ms
758 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
3,760 ms
741 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
7,465 ms
738 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
14,231 ms
738 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
14,969 ms
737 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
23,078 ms
722 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
2,365 ms
704 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
3,069 ms
691 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
4,501 ms
690 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
10,092 ms
680 ms
/assets/index-cFMaG3-L.js(pixar-character.vercel.app)
5,191 ms
663 ms
More information about the performance of your application. These numbers don't directly affect the Performance score.
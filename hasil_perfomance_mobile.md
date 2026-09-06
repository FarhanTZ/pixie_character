32
Performance
100
Accessibility
100
Best Practices
83
SEO
2/3
Agentic Browsing
32
FCP
+6
LCP
+0
TBT
+0
CLS
+25
SI
+1
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
36.2 s
Total Blocking Time
12,380 ms
Cumulative Layout Shift
0
Speed Index
10.2 s
Captured at Sep 6, 2026, 9:26 AM GMT+7
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

CLS
Insights
Improve image delivery Est savings of 6,375 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeLCPFCPUnscored
URL
Resource Size
Est Savings
vercel.app 1st party
6,578.9 KiB	6,374.7 KiB
NEBULA SIREN
<img alt="NEBULA SIREN" class="w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pi…" src="/assets/pixar/nobg/character5.png">
…nobg/character5.png(pixar-character.vercel.app)
3,470.4 KiB
3,426.6 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
1,549.3 KiB
This image file is larger than it needs to be (4582x2576) for its displayed dimensions (692x389). Use responsive images to reduce the image download size.
3,391.2 KiB
Pixar Logo
<img alt="Pixar Logo" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.png">
…logo/logo.png(pixar-character.vercel.app)
2,467.1 KiB
2,441.9 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
2,322.9 KiB
This image file is larger than it needs to be (1551x571) for its displayed dimensions (649x239). Use responsive images to reduce the image download size.
2,035.3 KiB
NEBULA SIREN Background
<img alt="NEBULA SIREN Background" class="w-full h-full object-cover object-center pixar-img-smooth" src="/assets/pixar/bg/character5.png">
…bg/character5.png(pixar-character.vercel.app)
641.4 KiB
506.3 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
506.3 KiB
Render-blocking requests Est savings of 1,070 ms
Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.LCPFCPUnscored
URL
Transfer Size
Duration
vercel.app 1st party
11.2 KiB	180 ms
/assets/index-DdG84H3f.css(pixar-character.vercel.app)
11.2 KiB
180 ms
Google Fonts cdn 
1.5 KiB	750 ms
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com)
1.5 KiB
750 ms
LCP breakdown
Each subpart has specific improvement strategies. Ideally, most of the LCP time should be spent on loading the resources, not within delays.LCPUnscored
Subpart
Duration
Time to first byte
0 ms
Resource load delay
780 ms
Resource load duration
650 ms
Element render delay
1,180 ms
Pixar Logo
<img alt="Pixar Logo" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.png">
LCP request discovery
Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loadingLCPUnscored
LCP resources should not use loading=lazy
fetchpriority=high should be applied
Request is discoverable in initial document
Pixar Logo
<img alt="Pixar Logo" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.png">
Network dependency tree
Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.LCPUnscored
Maximum critical path latency: 831 ms
Initial Navigation
https://pixar-character.vercel.app - 347 ms, 1.24 KiB
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com) - 356 ms, 1.50 KiB
…v9/NGSwv5HMA….woff2(fonts.gstatic.com) - 831 ms, 44.66 KiB
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app) - 653 ms, 129.39 KiB
/assets/index-DdG84H3f.css(pixar-character.vercel.app) - 715 ms, 11.20 KiB
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
Minimize main-thread work 20.1 s
Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. Learn how to minimize main-thread workTBTUnscored
Category
Time Spent
Other
19,303 ms
Script Evaluation
495 ms
Style & Layout
156 ms
Rendering
117 ms
Script Parsing & Compilation
32 ms
Garbage Collection
18 ms
Parse HTML & CSS
4 ms
Reduce unused JavaScript Est savings of 65 KiB
Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.LCPFCPUnscored
URL
Transfer Size
Est Savings
vercel.app 1st party
128.8 KiB	65.0 KiB
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
128.8 KiB
65.0 KiB
Image elements do not have explicit width and height
Set an explicit width and height on image elements to reduce layout shifts and improve CLS. Learn how to set image dimensionsCLSUnscored
URL
vercel.app 1st party
NEBULA SIREN
<img alt="NEBULA SIREN" class="w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pi…" src="/assets/pixar/nobg/character5.png">
…nobg/character5.png(pixar-character.vercel.app)
Pixar Logo
<img alt="Pixar Logo" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.png">
…logo/logo.png(pixar-character.vercel.app)
Pixar Logo
<img alt="Pixar Logo" class="h-9 sm:h-11 md:h-12 w-auto object-contain filter drop-shadow-[0_4px_12px_r…" src="/assets/pixar/logo/logo.png">
…logo/logo.png(pixar-character.vercel.app)
Avoid enormous network payloads Total size was 8,921 KiB
Large network payloads cost users real money and are highly correlated with long load times. Learn how to reduce payload sizes.Unscored
URL
Transfer Size
vercel.app 1st party
8,875.1 KiB
…nobg/character5.png(pixar-character.vercel.app)
3,470.9 KiB
…logo/logo.png(pixar-character.vercel.app)
2,467.6 KiB
…video/character5.mp4(pixar-character.vercel.app)
2,152.8 KiB
…bg/character5.png(pixar-character.vercel.app)
641.9 KiB
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
129.4 KiB
/assets/index-DdG84H3f.css(pixar-character.vercel.app)
11.2 KiB
https://pixar-character.vercel.app
1.2 KiB
Google Fonts cdn 
46.2 KiB
…v9/NGSwv5HMA….woff2(fonts.gstatic.com)
44.7 KiB
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com)
1.5 KiB

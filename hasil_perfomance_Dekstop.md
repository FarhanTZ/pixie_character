CLS
+24
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
0.8 s
Largest Contentful Paint
6.0 s
Total Blocking Time
21,430 ms
Cumulative Layout Shift
0.063
Speed Index
3.0 s
Captured at Sep 6, 2026, 9:26 AM GMT+7
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

CLS
Insights
Improve image delivery Est savings of 6,139 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeLCPFCPUnscored
URL
Resource Size
Est Savings
vercel.app 1st party
6,578.9 KiB	6,138.7 KiB
NEBULA SIREN
<img alt="NEBULA SIREN" class="w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pi…" src="/assets/pixar/nobg/character5.png">
…nobg/character5.png(pixar-character.vercel.app)
3,470.4 KiB
3,329.3 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
1,549.3 KiB
This image file is larger than it needs to be (4582x2576) for its displayed dimensions (1242x698). Use responsive images to reduce the image download size.
3,215.4 KiB
Pixar Logo
<img alt="Pixar Logo" class="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px…" src="/assets/pixar/logo/logo.png">
…logo/logo.png(pixar-character.vercel.app)
2,467.1 KiB
2,423.8 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
2,322.9 KiB
This image file is larger than it needs to be (1551x571) for its displayed dimensions (850x313). Use responsive images to reduce the image download size.
1,726.1 KiB
NEBULA SIREN Background
<img alt="NEBULA SIREN Background" class="w-full h-full object-cover object-center pixar-img-smooth" src="/assets/pixar/bg/character5.png">
…bg/character5.png(pixar-character.vercel.app)
641.4 KiB
385.6 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
253.7 KiB
This image file is larger than it needs to be (1850x1288) for its displayed dimensions (1672x940). Use responsive images to reduce the image download size.
218.3 KiB
Render-blocking requests Est savings of 160 ms
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
520 ms
Resource load duration
250 ms
Element render delay
2,420 ms
NEBULA SIREN Background
<img alt="NEBULA SIREN Background" class="w-full h-full object-cover object-center pixar-img-smooth" src="/assets/pixar/bg/character5.png">
LCP request discovery
Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loadingLCPUnscored
LCP resources should not use loading=lazy
fetchpriority=high should be applied
Request is discoverable in initial document
NEBULA SIREN Background
<img alt="NEBULA SIREN Background" class="w-full h-full object-cover object-center pixar-img-smooth" src="/assets/pixar/bg/character5.png">
Network dependency tree
Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.LCPUnscored
Maximum critical path latency: 24,761 ms
Initial Navigation
https://pixar-character.vercel.app - 191 ms, 1.23 KiB
/css2?family=Inter+Tight:wght@500;600;700;800;900&display=swap(fonts.googleapis.com) - 193 ms, 1.50 KiB
…v9/NGSwv5HMA….woff2(fonts.gstatic.com) - 625 ms, 44.66 KiB
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app) - 396 ms, 129.39 KiB
/assets/index-DdG84H3f.css(pixar-character.vercel.app) - 252 ms, 11.20 KiB
/msg(www.srmdata-us.com) - 24,761 ms, 0.00 KiB
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
Layout shift culprits
Layout shifts occur when elements move absent any user interaction. Investigate the causes of layout shifts, such as elements being added, removed, or their fonts changing as the page loads.CLSUnscored
Element
Layout shift score
Total
0.063
START GAME MADE BY FARHANTZ
<div class="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
0.063
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
Minimize main-thread work 23.8 s
Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. Learn how to minimize main-thread workTBTUnscored
Category
Time Spent
Other
23,101 ms
Script Evaluation
413 ms
Style & Layout
139 ms
Rendering
47 ms
Script Parsing & Compilation
37 ms
Parse HTML & CSS
11 ms
Garbage Collection
10 ms
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
Avoid long main-thread tasks 20 long tasks found
Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. Learn how to avoid long main-thread tasksTBTUnscored
URL
Start Time
Duration
vercel.app 1st party
18,280 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
1,427 ms
1,487 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
4,729 ms
1,418 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
8,475 ms
1,074 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
3,681 ms
1,048 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
18,899 ms
1,016 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
19,915 ms
939 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
12,535 ms
911 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
17,997 ms
902 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
15,325 ms
900 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
7,625 ms
850 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
6,617 ms
822 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
21,634 ms
821 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
17,191 ms
806 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
13,771 ms
782 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
20,854 ms
780 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
14,553 ms
772 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
2,914 ms
767 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
23,095 ms
738 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
16,461 ms
730 ms
/assets/index-CKzQ1XGQ.js(pixar-character.vercel.app)
10,240 ms
717 ms
More information about the performance of your application. These numbers don't directly affect the Performance score.
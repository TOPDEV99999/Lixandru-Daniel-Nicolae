const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const blogPosts = [
  {
    slug: "dermaiq-ai-healthcare-deployment",
    title: "Building DermaIQ: Lessons from Deploying AI in Healthcare",
    excerpt: "How I built an AI-powered skin disease detection platform — the architecture decisions, a subtle preprocessing bug that broke confidence scores, and what I learned about building ML systems for healthcare.",
    category: "AI",
    tags: ["TensorFlow", "OpenCV", "Computer Vision", "Python", "Healthcare"],
    date: "2024-05-20",
    readingTime: "8 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/745bc41d2_generated_image.png",
    content: `## The Challenge

DermaIQ started as a question: *can we make preliminary dermatological screening accessible to everyone?* Dermatological diagnosis often requires specialist access, which can be expensive and slow — especially in underserved areas.

The goal was to build an AI-powered platform that provides instant skin condition analysis using deep learning models.

## Technical Architecture

The system was built with a React frontend and a Python backend powered by TensorFlow and OpenCV. The inference pipeline:

1. **Image Upload** — users upload a photo of the affected skin area
2. **Preprocessing** — OpenCV handles resizing, normalization, and noise reduction
3. **Inference** — a fine-tuned MobileNetV2 classifies the image into condition categories
4. **Results** — confidence scores returned with educational context

## The Bug: Inconsistent Confidence Scores

During testing, we noticed something alarming — the model's confidence scores were **wildly inconsistent** for the same image uploaded twice. A 94% confidence would drop to 62% on a re-upload.

### Root Cause

After hours of debugging, I traced the issue to the **image preprocessing pipeline**. OpenCV's \`imread\` reads images in **BGR** format, but our model was trained on **RGB** images. The channel order mismatch meant the model received subtly different input each time.

Additionally, different cameras applied varying EXIF orientation tags, causing inconsistent rotation.

### The Fix

\`\`\`python
# Correct channel order and EXIF orientation
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = ImageOps.exif_transpose(Image.fromarray(img))
\`\`\`

## Debugging Process

1. **Reproduced** by uploading the same image 10 times and logging confidence scores
2. **Inspected intermediate tensors** to compare input arrays across uploads
3. **Identified the channel mismatch** by comparing mean pixel values
4. **Found the EXIF issue** by testing with photos from different phone cameras

## Lessons Learned

- **Always validate your preprocessing pipeline against your training pipeline.** The most subtle bugs come from assumptions about data format.
- **EXIF orientation is a silent killer** in image processing — always normalize.
- **Log everything during inference** — confidence score distributions revealed the inconsistency immediately.

## Best Practices

- Standardize on a single preprocessing function shared between training and inference
- Always strip and apply EXIF orientation explicitly
- Add integration tests that verify inference determinism for the same input
- Never deploy a healthcare ML model without deterministic input guarantees`,
  },
  {
    slug: "real-time-face-swap-computer-vision",
    title: "Real-Time Face Swap: A Deep Dive into Computer Vision",
    excerpt: "Building a real-time face swapping application with OpenCV — facial landmark detection, image blending algorithms, and the performance optimization tricks that made it run at 30 FPS.",
    category: "AI",
    tags: ["OpenCV", "Computer Vision", "Python", "Real-Time", "Image Processing"],
    date: "2024-01-15",
    readingTime: "7 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/cc09964f1_generated_image.png",
    content: `## The Challenge

Creating realistic face swaps requires complex computer vision algorithms that handle varying lighting, angles, and facial features — all in real-time.

## Technical Architecture

The pipeline used **dlib** for facial landmark detection and **OpenCV** for image blending:

1. **Face Detection** — Haar cascades or dlib's HOG detector
2. **Landmark Extraction** — 68-point facial landmarks
3. **Alignment** — Delaunay triangulation for warping
4. **Blending** — Poisson blending for seamless integration
5. **Color Correction** — histogram matching for skin tone consistency

## The Bug: Memory Leaks at 30 FPS

The application ran smoothly for the first 30 seconds, then **frame rate dropped to 5 FPS** and memory usage climbed steadily.

### Root Cause

The issue was twofold:

1. **dlib's face detector** was being re-initialized on every frame instead of being cached
2. **OpenCV video writer buffers** were not being released between capture sessions

\`\`\`python
# BAD: Re-creating detector every frame
def process_frame(frame):
    detector = dlib.get_frontal_face_detector()  # expensive!
    # ...

# GOOD: Cache the detector
detector = dlib.get_frontal_face_detector()  # once

def process_frame(frame, detector=detector):
    # ...
\`\`\`

### The Fix

- Cached the detector and predictor models outside the frame loop
- Used context managers for video capture resources
- Implemented frame skipping for non-critical processing

## Debugging Process

1. **Profiled with cProfile** to identify the bottleneck — detector initialization was 60% of frame time
2. **Monitored memory with tracemalloc** — found OpenCV Mat objects accumulating
3. **Tested with incremental frames** to confirm the leak was per-frame, not per-session

## Lessons Learned

- **Object initialization cost matters** in real-time pipelines — cache everything possible
- **Memory management in Python + C++ bindings** is tricky — always release native resources
- **Profile before optimizing** — assumptions about bottlenecks are usually wrong

## Best Practices

- Separate model loading from inference — load once, infer many times
- Use object pools for frequently allocated/deallocated resources
- Set a target FPS and skip frames intelligently to maintain it
- Always wrap native resource handles in context managers`,
  },
  {
    slug: "scaling-mern-ecommerce-architecture",
    title: "Scaling a MERN E-Commerce Platform: Architecture Decisions",
    excerpt: "How I architected a full-stack e-commerce platform with React, Node.js, and MongoDB — from authentication to payment integration, and the scaling challenges that taught me about database indexing.",
    category: "Web",
    tags: ["React", "Node.js", "MongoDB", "Architecture", "Performance"],
    date: "2023-08-30",
    readingTime: "9 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/bc162286e_generated_image.png",
    content: `## The Challenge

Small businesses need affordable, scalable e-commerce solutions without high platform fees. The goal was to build a custom MERN-stack platform with authentication, payments, and an admin dashboard.

## Technical Architecture

- **Frontend**: React with context-based state management
- **Backend**: Node.js + Express with JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **Payments**: Stripe integration with webhook handling
- **Images**: Cloudinary for media storage

## The Bug: Cart Data Disappearing on Refresh

Users reported that their shopping cart was **randomly emptying on page refresh**. It happened intermittently — sometimes the cart persisted, sometimes it didn't.

### Root Cause

The cart was stored in React Context state, which was **only synced to localStorage on unmount**. If the user refreshed the page before the unmount handler fired (e.g., during a fast refresh), the cart state was lost.

\`\`\`javascript
// BAD: Only persisting on unmount
useEffect(() => {
  return () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
}, [cart]);

// GOOD: Persist on every change
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
\`\`\`

### The Fix

Changed the persistence strategy to save on every state change, and added a debounced sync to the server for logged-in users.

## The Bug: Slow Product Search

As the product catalog grew past 10,000 items, search queries took **3-5 seconds**. Users were abandoning the site.

### Root Cause

MongoDB was performing **collection scans** because the \`name\` and \`category\` fields had no indexes.

### The Fix

\`\`\`javascript
// Add compound text index
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
\`\`\`

Search time dropped from 3 seconds to **under 50ms**.

## Lessons Learned

- **State persistence must be immediate**, not deferred to lifecycle events
- **Database indexing is not optional** — design indexes based on your query patterns, not your data model
- **Monitor query performance** in production, not just in development

## Best Practices

- Always sync critical state (cart, auth) to localStorage on change, not on unmount
- Create database indexes for every field you filter or sort by
- Use pagination for large result sets — never load everything at once
- Implement server-side search with text indexes rather than client-side filtering
- Use webhooks for payment confirmation — never trust client-side success callbacks`,
  },
  {
    slug: "websocket-real-time-messaging",
    title: "Building Real-Time Messaging: WebSocket Architecture",
    excerpt: "How I built a real-time messaging system for a dating platform using WebSockets — connection management, message delivery guarantees, and the reconnection logic that made it reliable.",
    category: "Web",
    tags: ["WebSocket", "Node.js", "React", "Real-Time", "Socket.io"],
    date: "2023-02-28",
    readingTime: "8 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/bfb80df8c_generated_image.png",
    content: `## The Challenge

Building real-time social features with low latency while maintaining security and user privacy. Messages needed to be delivered instantly, with no duplicates and no losses.

## Technical Architecture

- **Transport**: Socket.io over WebSockets with HTTP long-polling fallback
- **Message Queue**: Redis pub/sub for multi-server scaling
- **Storage**: MongoDB for message persistence
- **Auth**: JWT token verified on socket connection

## The Bug: Duplicate Messages

Users reported receiving **each message 2-3 times**. The duplicates appeared randomly, not on every message.

### Root Cause

The socket reconnection logic was creating **multiple event listeners**. When a socket disconnected and reconnected, the old listener was not cleaned up, so the message event fired on both the old (zombie) and new listeners.

\`\`\`javascript
// BAD: Listener accumulates on reconnect
socket.on('connect', () => {
  socket.on('message', handleMessage); // added every reconnect!
});

// GOOD: Clean up and re-register
useEffect(() => {
  const handler = (msg) => setMessages(prev => [...prev, msg]);
  socket.on('message', handler);
  return () => socket.off('message', handler);
}, []);
\`\`\`

### The Fix

- Used proper cleanup in \`useEffect\` to remove listeners on unmount
- Added message deduplication using message IDs on the client
- Implemented a single connection manager instead of per-component connections

## The Bug: Messages Lost During Reconnection

When a user's connection dropped briefly, messages sent during that window were **permanently lost**.

### Root Cause

The server only pushed messages to connected sockets. There was no mechanism to **catch up** on missed messages after reconnection.

### The Fix

\`\`\`javascript
// On reconnect, fetch missed messages
socket.on('connect', () => {
  fetchMissedMessages(lastMessageTimestamp).then(msgs => {
    setMessages(prev => [...msgs, ...prev]);
  });
});
\`\`\`

## Lessons Learned

- **WebSocket event listeners are a common source of bugs** — always clean them up
- **Network is unreliable** — design for disconnections, reconnections, and message ordering
- **Idempotency is essential** — every message should have a unique ID for deduplication

## Best Practices

- Always remove event listeners in \`useEffect\` cleanup
- Implement message deduplication using unique IDs
- Store a \`lastMessageTimestamp\` to fetch missed messages on reconnect
- Use Redis pub/sub when scaling across multiple server instances
- Implement exponential backoff for reconnection attempts
- Never trust that a message was delivered — use acknowledgment callbacks`,
  },
  {
    slug: "shopify-theme-performance-conversion",
    title: "Custom Shopify Themes: Performance & Conversion Optimization",
    excerpt: "Building a custom Shopify theme for a fashion brand — Liquid template optimization, Core Web Vitals improvements, and the conversion rate strategies that increased sales by 35%.",
    category: "Shopify",
    tags: ["Shopify", "Liquid", "Performance", "SEO", "E-Commerce"],
    date: "2022-05-18",
    readingTime: "7 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/d9ee1c97b_generated_image.png",
    content: `## The Challenge

Fashion brands need unique, high-converting storefronts that stand out from generic Shopify templates. The goal was a custom theme with responsive design, optimized checkout, and third-party integrations.

## Technical Architecture

- **Templating**: Shopify Liquid
- **Styling**: Tailwind CSS via custom build pipeline
- **JavaScript**: Vanilla JS (no framework) for performance
- **Images**: Responsive \`srcset\` with WebP conversion

## The Bug: 6-Second Page Load Times

The initial theme loaded in **6.2 seconds** on mobile. Google PageSpeed Insights gave it a score of 28.

### Root Cause

1. **Unoptimized images** — 3MB hero images served to all devices
2. **Render-blocking JavaScript** — jQuery loaded synchronously in \`<head>\`
3. **Excessive Liquid loops** — product collections rendered with nested loops
4. **No lazy loading** — all images loaded immediately

### The Fix

\`\`\`liquid
{%- comment -%} Responsive images with lazy loading {%- endcomment -%}
{%- if product.featured_image -%}
  <img
    src="{{ product.featured_image | image_url: width: 400 }}"
    srcset="{{ product.featured_image | image_url: width: 400 }} 400w,
            {{ product.featured_image | image_url: width: 800 }} 800w,
            {{ product.featured_image | image_url: width: 1200 }} 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
    loading="lazy"
    alt="{{ product.title | escape }}"
    width="{{ product.featured_image.width }}"
    height="{{ product.featured_image.height }}"
  />
{%- endif -%}
\`\`\`

Page load dropped from **6.2s to 1.4s**. PageSpeed score went from 28 to **94**.

## The Bug: Checkout Abandonment at 68%

The checkout flow was losing 68% of users. The abandoned cart recovery emails weren't triggering.

### Root Cause

The custom theme was overriding Shopify's built-in checkout button with a JavaScript-driven version that **broke the native checkout flow** on some browsers.

### The Fix

- Reverted to native Shopify checkout buttons
- Added a sticky "Add to Cart" bar on mobile
- Implemented a one-page quick-view with instant add-to-cart

Conversion rate increased by **35%**.

## Lessons Learned

- **Performance is a feature** — every second of load time costs conversions
- **Don't fight the platform** — Shopify's native checkout is optimized; extend it, don't replace it
- **Mobile-first is non-negotiable** — 70% of fashion traffic is mobile

## Best Practices

- Always use responsive \`srcset\` with WebP for product images
- Lazy-load below-the-fold images and defer non-critical JavaScript
- Use Shopify's native checkout flow — don't override it
- Implement a sticky add-to-cart bar on mobile
- Cache Liquid snippets using \`{% render %}\` with caching headers
- Monitor Core Web Vitals (LCP, FID, CLS) in production`,
  },
  {
    slug: "web3-ethereum-smart-contract-integration",
    title: "Integrating Ethereum Smart Contracts: A Web3 Journey",
    excerpt: "Building a Web3 dashboard with React and Solidity — wallet connectivity, smart contract interactions, and the gas optimization strategies that reduced transaction costs by 60%.",
    category: "Blockchain",
    tags: ["Solidity", "Ethereum", "Web3", "React", "Smart Contracts"],
    date: "2022-08-22",
    readingTime: "8 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/0076f58b6_generated_image.png",
    content: `## The Challenge

Managing blockchain assets across different protocols is complex. The goal was to build a unified Web3 dashboard with Ethereum wallet integration, smart contract interactions, and real-time data visualization.

## Technical Architecture

- **Frontend**: React with ethers.js for Web3 interactions
- **Smart Contracts**: Solidity deployed on Ethereum
- **Wallet**: MetaMask integration via \`window.ethereum\`
- **Data**: The Graph protocol for indexed blockchain data

## The Bug: Transactions Silently Failing

Smart contract transactions were **silently failing** — the UI showed "pending" forever, but the transaction never confirmed. Users had no feedback.

### Root Cause

The transaction was being sent with an **insufficient gas estimate**. ethers.js's \`estimateGas\` was returning a value that was too low because it didn't account for the contract's internal state changes.

\`\`\`javascript
// BAD: Trusting estimateGas blindly
const gasEstimate = await contract.estimateGas.transfer(to, amount);
const tx = await contract.transfer(to, amount, { gasLimit: gasEstimate });

// GOOD: Add a buffer and handle errors
const gasEstimate = await contract.estimateGas.transfer(to, amount);
const tx = await contract.transfer(to, amount, {
  gasLimit: Math.floor(gasEstimate * 1.2), // 20% buffer
});
await tx.wait(); // wait for confirmation
\`\`\`

### The Fix

- Added a 20% gas buffer to all estimates
- Implemented proper transaction status tracking with \`tx.wait()\`
- Added user-facing error messages for failed transactions
- Implemented a transaction queue with retry logic

## The Bug: Wallet Connection Lost on Refresh

Users had to **reconnect their wallet on every page refresh**. This created friction and reduced engagement.

### Root Cause

The app was not persisting the wallet connection state. MetaMask's \`window.ethereum\` remembers the connection, but the app wasn't checking for an existing connection on load.

### The Fix

\`\`\`javascript
// Check for existing connection on load
useEffect(() => {
  const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };
  checkConnection();
}, []);
\`\`\`

## Lessons Learned

- **Gas estimation is not reliable** — always add a buffer
- **Blockchain state is asynchronous** — always wait for confirmations
- **Wallet UX matters** — auto-reconnect on load, and handle account/network changes gracefully

## Best Practices

- Always add a 20% buffer to gas estimates
- Use \`tx.wait()\` to confirm transactions before updating UI
- Auto-check for existing wallet connections on page load
- Listen for \`accountsChanged\` and \`chainChanged\` events
- Show clear transaction status: pending, confirmed, failed
- Cache blockchain data using The Graph instead of making repeated RPC calls
- Implement proper error handling for user-rejected transactions`,
  },
  {
    slug: "cryptocheckmate-decentralized-chess-blockchain",
    title: "Building CryptoCheckmate: Decentralized Chess on the Blockchain",
    excerpt: "How I built a Web3 chess gaming platform with Next.js and Solidity — on-chain move verification, FlowChain integration, and the gas optimization strategies that reduced transaction costs by 95%.",
    category: "Blockchain",
    tags: ["Solidity", "Next.js", "Web3", "FlowChain", "Gaming"],
    date: "2024-03-12",
    readingTime: "8 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/6f13d1b1b_generated_image.png",
    content: `## The Challenge

CryptoCheckmate was born from a simple question: *can competitive chess be made fair, transparent, and rewarding using blockchain technology?* Online chess platforms struggle with match integrity — players can't verify that their opponent isn't using engines, and reward distribution is opaque.

The goal was to build a decentralized chess platform where every move is verifiable on-chain, and winners receive crypto rewards through trustless smart contracts.

## Technical Architecture

The system was built with **Next.js** on the frontend and **Solidity** smart contracts on FlowChain:

1. **Game Creation** — players create or join matches with staked tokens
2. **Move Verification** — each move is validated against chess rules and recorded on-chain
3. **Game Resolution** — smart contracts determine the winner and distribute rewards
4. **Real-Time Sync** — WebSocket connections handle live multiplayer state

## The Bug: Move Verification Gas Costs

The first version recorded every single move as a separate blockchain transaction. Each move cost ~0.05 ETH in gas — a full game could cost $15+ in transaction fees.

### Root Cause

We were using a simple mapping to store each move individually:

\`\`\`solidity
// BAD: One transaction per move
mapping(uint256 => Move[]) public gameMoves;

function makeMove(uint256 gameId, uint8 from, uint8 to) external {
    gameMoves[gameId].push(Move(from, to, block.timestamp));
}
\`\`\`

### The Fix

Instead of storing every move on-chain, we switched to a **commit-reveal scheme** where the full game state is only written to the chain at game end:

\`\`\`solidity
// GOOD: Only settle at game end
function settleGame(uint256 gameId, bytes32 moveHash, bytes32 finalState) external {
    require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2);
    games[gameId].finalState = finalState;
    games[gameId].settled = true;
}
\`\`\`

Gas costs dropped from **~$15 per game to ~$0.80** — a 95% reduction.

## The Bug: Real-Time Sync Race Conditions

When two players moved simultaneously, the WebSocket sync occasionally caused **double-move bugs** where a piece appeared to move twice on one player's screen.

### Root Cause

The client was updating local state optimistically before the server confirmed the move was legal. If both players moved within the same 100ms window, the local states diverged.

### The Fix

Implemented a **server-authoritative model** where the client always waits for server confirmation:

\`\`\`javascript
socket.emit('move', { gameId, from, to });
socket.on('moveConfirmed', (move) => {
  updateBoard(move); // Only update after server confirms
});
\`\`\`

## Lessons Learned

- **Don't store high-frequency data on-chain** — use commit-reveal or off-chain settlement
- **Server authority prevents race conditions** in real-time multiplayer
- **Gas optimization is critical** for blockchain games

## Best Practices

- Use commit-reveal schemes for turn-based games to minimize on-chain transactions
- Always implement server-authoritative state management for multiplayer
- Profile gas costs early and often
- Use WebSocket connections for real-time sync, but never trust client state as source of truth
- Implement proper dispute resolution for player disconnections`,
  },
  {
    slug: "ai-powered-crm-chatbot-to-sales-engine",
    title: "Building an AI-Powered CRM: From Chatbot to Sales Engine",
    excerpt: "How I transformed a traditional CRM into an AI-driven sales assistant using Next.js and LLM integration — conversation routing, automated lead scoring, and the prompt engineering that made it work.",
    category: "AI",
    tags: ["React", "Next.js", "AI", "LLM", "CRM"],
    date: "2024-02-08",
    readingTime: "9 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/073e73e42_generated_image.png",
    content: `## The Challenge

Traditional CRMs are graveyards of data. Sales reps spend hours logging activities, managers drown in dashboards, and the system never actually *helps* anyone sell. The goal was to build an AI-powered CRM that actively assists — analyzing conversations, scoring leads, and recommending next actions.

## Technical Architecture

- **Frontend**: React with Next.js App Router
- **AI Integration**: LLM-powered conversation analysis via API
- **Backend**: Node.js with REST API
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket for live conversation analysis

## The Bug: AI Hallucinating Lead Scores

The LLM was generating **inconsistent lead scores** for the same conversation. A lead scored 85/100 in the morning would score 42/100 in the afternoon — with the exact same conversation data.

### Root Cause

The prompt was **vague and unstructured**:

\`\`\`javascript
// BAD: Vague prompt
const prompt = \`Analyze this conversation and give a lead score from 0-100: \${conversation}\`;
\`\`\`

The LLM had no consistent scoring criteria, so it interpreted "lead score" differently each time.

### The Fix

Created a **structured prompt with explicit scoring rubric**:

\`\`\`javascript
// GOOD: Structured rubric
const prompt = \`Score this sales lead on a 0-100 scale using these criteria:
- Budget mentioned (0-25 points)
- Authority/decision-maker identified (0-25 points)
- Need/pain point expressed (0-25 points)
- Timeline/urgency indicated (0-25 points)

Return JSON: { score: number, reasoning: string, criteria: { budget, authority, need, timeline } }

Conversation: \${conversation}\`;
\`\`\`

Scores became consistent within ±3 points across runs.

## The Bug: Conversation Analysis Timeout

Processing long sales conversations (30+ minutes of chat history) caused the LLM API to **timeout after 30 seconds**.

### Root Cause

We were sending the entire conversation as a single prompt. For long conversations, the token count exceeded the model's context window, causing timeouts.

### The Fix

Implemented **chunked conversation summarization**:

\`\`\`javascript
// Summarize in chunks, then analyze the summary
const chunks = splitConversation(conversation, 2000); // tokens per chunk
const summaries = await Promise.all(
  chunks.map(chunk => summarizeChunk(chunk))
);
const analysis = await analyzeLeadScore(summaries.join('\\n'));
\`\`\`

Processing time dropped from 30s+ timeouts to consistent **3-5 second** responses.

## Lessons Learned

- **Structured prompts with explicit criteria** produce consistent LLM outputs
- **Token limits are real** — chunk and summarize long inputs
- **AI features need observability** — log every prompt and response for debugging

## Best Practices

- Always provide a scoring rubric or output schema in your prompts
- Use JSON schema responses for structured data extraction
- Implement chunked processing for long text inputs
- Cache LLM responses for identical inputs to reduce API costs
- Monitor token usage and API latency as key metrics
- Always have a fallback when the AI service is unavailable`,
  },
  {
    slug: "metaverse-expo-3d-virtual-trade-show",
    title: "Metaverse Expo: Building a 3D Virtual Trade Show Platform",
    excerpt: "How I built a real-time 3D virtual exhibition platform with React, Three.js, and Socket.io — avatar synchronization, spatial audio, and the WebGL performance optimizations that made it smooth at scale.",
    category: "Web",
    tags: ["React", "Socket.io", "Three.js", "WebGL", "Real-Time"],
    date: "2023-11-20",
    readingTime: "10 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/993d5d0cb_generated_image.png",
    content: `## The Challenge

Virtual events during the pandemic were flat — video calls in grid layouts. The goal was to build a **3D virtual trade show** where attendees could walk around, visit booths, and network with other attendees' avatars in real-time.

## Technical Architecture

- **3D Rendering**: Three.js with React Three Fiber
- **Real-Time Sync**: Socket.io for avatar position and state
- **Backend**: Node.js with Redis for pub/sub scaling
- **Spatial Audio**: WebRTC for proximity-based voice chat
- **Assets**: GLTF models for booths and environment

## The Bug: FPS Drops with 50+ Avatars

With 50 concurrent avatars in the same virtual space, frame rates **dropped to 8-12 FPS** — the experience was unusable.

### Root Cause

Every avatar was a full GLTF model with **8,000+ polygons**. Three.js was rendering all 50 at full detail, even for avatars that were far away or behind the camera.

### The Fix

Implemented **level-of-detail (LOD) management**:

\`\`\`javascript
// Use simplified models for distant avatars
const lod = new THREE.LOD();
lod.addLevel(highDetailModel, 0);    // Full detail within 10m
lod.addLevel(mediumDetailModel, 10); // 2,000 polys within 50m
lod.addLevel(lowDetailModel, 50);    // 500 polys beyond 50m
lod.addLevel(billboardSprite, 100);  // 2D sprite beyond 100m
scene.add(lod);
\`\`\`

Also implemented **frustum culling** to skip rendering avatars outside the camera view. FPS improved to **consistent 60 FPS** with 100+ avatars.

## The Bug: Avatar Position Jitter

Avatars appeared to **jitter and teleport** when moving. The movement was jerky and disorienting.

### Root Cause

We were sending avatar position updates on every animation frame — **60 updates per second per avatar**. The server was overwhelmed, and updates arrived out of order.

### The Fix

Implemented **dead reckoning** with interpolation:

\`\`\`javascript
// Send position updates at 10Hz, interpolate between updates
socket.emit('position', { x, y, z, vx, vy, vz }); // 10 times/second

// Client interpolates between updates
function updateAvatar(avatar, targetPosition) {
  avatar.position.lerp(targetPosition, 0.15); // smooth interpolation
}
\`\`\`

Position updates dropped from 60Hz to 10Hz, with client-side interpolation making movement appear smooth. Network traffic reduced by **83%**.

## Lessons Learned

- **LOD is essential** for 3D scenes with many objects — don't render full detail for distant objects
- **Dead reckoning reduces network load** — send state less frequently and interpolate
- **Profile WebGL performance early** — polygon counts and draw calls matter more than you think

## Best Practices

- Use Three.js LOD for any scene with 10+ complex models
- Implement frustum culling and occlusion culling
- Send network updates at 10-15Hz, not 60Hz — interpolate on the client
- Use instanced meshes for repeated objects (e.g., booth templates)
- Implement spatial partitioning for proximity queries (who's near whom)
- Test with 100+ concurrent users before launch — performance issues only appear at scale`,
  },
  {
    slug: "chatbot-health-assistant-medical-ai-django",
    title: "ChatBot Health Assistant: Building Medical AI with Django",
    excerpt: "How I built a healthcare chatbot with Django and Python — medical intent classification, HIPAA-compliant data handling, and the safety guardrails required for responsible health-tech.",
    category: "AI",
    tags: ["Python", "Django", "NLP", "Healthcare", "AI"],
    date: "2023-09-15",
    readingTime: "7 min",
    cover: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/25ee960a4_generated_image.png",
    content: `## The Challenge

Building AI for healthcare is fundamentally different from building AI for e-commerce or entertainment. **Safety is non-negotiable.** A wrong recommendation in a shopping app costs a sale; a wrong recommendation in health can cost a life.

The goal was to build a chatbot that provides **responsible, helpful health guidance** while never pretending to be a doctor or giving definitive medical advice.

## Technical Architecture

- **Backend**: Django with Django REST Framework
- **AI**: Python NLP for intent classification
- **Database**: PostgreSQL with encrypted fields for PHI
- **Compliance**: HIPAA-compliant data handling and audit logging
- **Safety**: Multi-layer guardrails and escalation logic

## The Bug: Chatbot Giving Definitive Medical Advice

Early testing showed the chatbot was **diagnosing conditions** — "You likely have strep throat" — which is both dangerous and legally problematic.

### Root Cause

The system prompt was too permissive:

\`\`\`python
# BAD: No guardrails
prompt = "You are a helpful health assistant. Answer the user's health questions."
\`\`\`

### The Fix

Created a **strict system prompt with explicit boundaries**:

\`\`\`python
SAFETY_PROMPT = """
You are a health information chatbot, NOT a doctor.

RULES:
- NEVER diagnose conditions
- NEVER recommend specific medications or treatments
- NEVER use phrases like "you have" or "you likely have"
- ALWAYS use "this could be related to" or "common causes include"
- ALWAYS recommend consulting a healthcare professional for diagnosis
- If symptoms suggest an emergency, direct user to call emergency services

If unsure, respond: "I recommend speaking with a healthcare professional about this."
"""
\`\`\`

The chatbot now provides **informational context** while always deferring to professionals.

## The Bug: PHI Leaking in API Logs

During debugging, we discovered that **Protected Health Information (PHI)** — symptoms, medications, and personal details — was being logged in plain text in our server logs.

### Root Cause

The Django middleware was logging all request bodies for debugging, including chat messages containing health information.

### The Fix

Implemented **PHI-aware logging** that redacts sensitive fields:

\`\`\`python
class PHIRedactingMiddleware:
    SENSITIVE_FIELDS = ['symptoms', 'medications', 'diagnosis', 'message']
    
    def process_request(self, request):
        if request.path.startswith('/api/chat/'):
            # Don't log chat request bodies at all
            request._skip_body_logging = True
        return None
\`\`\`

Also encrypted all PHI fields at the database level using Django's field encryption.

## Lessons Learned

- **Safety prompts are critical** for health AI — be explicit about what NOT to do
- **Logs are a compliance risk** — audit what gets logged in production
- **Encryption at rest is non-negotiable** for healthcare applications

## Best Practices

- Always include explicit negative instructions in health AI prompts ("NEVER diagnose")
- Implement multi-layer escalation: bot → nurse line → emergency services
- Encrypt all PHI at the database field level, not just at the disk level
- Audit log retention policies to comply with HIPAA
- Always include a "consult a professional" disclaimer in responses
- Build an emergency keyword detector that triggers immediate escalation
- Never store conversation data longer than legally required`,
  },
];

export const blogCategories = ["All", "AI", "Web", "Shopify", "Blockchain", "Design"];

export const allBlogTags = [
  "TensorFlow", "OpenCV", "Computer Vision", "Python", "React", "Node.js",
  "MongoDB", "Architecture", "Performance", "WebSocket", "Real-Time",
  "Shopify", "Liquid", "SEO", "E-Commerce", "Solidity", "Ethereum", "Web3",
  "Smart Contracts", "Healthcare", "Image Processing", "Socket.io", "JavaScript",
  "Next.js", "Gaming", "LLM", "CRM", "Three.js", "WebGL", "Django", "NLP",
  "FlowChain", "AI",
];
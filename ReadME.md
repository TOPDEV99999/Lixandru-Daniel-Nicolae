<!-- README.md with animated effects -->
<div align="center">

<!-- Animated Title with Gradient -->
<h1 align="center">
  <span style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 15s ease infinite;
    display: inline-block;
  ">✨ Portfolio & Contact Management System ✨</span>
</h1>

<!-- Animated Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

<!-- Animated Description -->
<p align="center">
  <span style="
    animation: pulse 2s infinite;
    display: inline-block;
  ">🚀</span>
  <strong>A modern, animated full-stack portfolio with contact management, meeting scheduling, and admin dashboard</strong>
  <span style="
    animation: pulse 2s infinite;
    animation-delay: 1s;
    display: inline-block;
  ">💫</span>
</p>

<!-- Animated Demo Preview -->
<div align="center" style="
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  border-radius: 15px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
">
  <h3 style="color: white; margin-bottom: 15px;">✨ Live Demo Features ✨</h3>
  <div style="
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  ">
    <span style="
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      animation: float 3s ease-in-out infinite;
    ">🎨 Animated UI</span>
    <span style="
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      animation: float 3s ease-in-out infinite;
      animation-delay: 0.5s;
    ">📱 Responsive</span>
    <span style="
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      animation: float 3s ease-in-out infinite;
      animation-delay: 1s;
    ">⚡ Fast Performance</span>
    <span style="
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      animation: float 3s ease-in-out infinite;
      animation-delay: 1.5s;
    ">🔒 Secure</span>
  </div>
</div>

</div>

<!-- CSS Animations in HTML Comments (for GitHub README) -->
<style>
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px #667eea; }
    50% { box-shadow: 0 0 20px #667eea, 0 0 30px #764ba2; }
  }
</style>

<!-- Animated Feature Cards -->
<div align="center" style="animation: fadeIn 1s ease-out;">

## 🎯 **Key Features**

<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
">

<!-- Feature Card 1 -->
<div style="
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
  border-radius: 15px;
  color: white;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: move 20s linear infinite;
  "></div>
  <h3 style="margin-top: 0; z-index: 1; position: relative;">✨ Interactive Portfolio</h3>
  <p style="z-index: 1; position: relative;">Animated sections with smooth scroll navigation and interactive elements</p>
</div>

<!-- Feature Card 2 -->
<div style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 15px;
  color: white;
  text-align: center;
  animation: fadeIn 0.8s ease-out 0.2s;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: move 20s linear infinite reverse;
  "></div>
  <h3 style="margin-top: 0; z-index: 1; position: relative;">📊 Admin Dashboard</h3>
  <p style="z-index: 1; position: relative;">Real-time analytics with animated charts and data visualization</p>
</div>

<!-- Feature Card 3 -->
<div style="
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 20px;
  border-radius: 15px;
  color: white;
  text-align: center;
  animation: fadeIn 0.8s ease-out 0.4s;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: move 20s linear infinite;
  "></div>
  <h3 style="margin-top: 0; z-index: 1; position: relative;">📅 Meeting Scheduler</h3>
  <p style="z-index: 1; position: relative;">Interactive calendar with animated time slots and notifications</p>
</div>

</div>
</div>

<style>
  @keyframes move {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
  }
</style>

<!-- Animated Tech Stack Section -->
<div style="animation: slideIn 1s ease-out;">

## 🛠️ **Tech Stack**

<div align="center">
  
### **Frontend Magic** ✨
<div style="
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 15px;
">
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #61DAFB;">⚛️</span> <strong style="color: #010A0B;">React 18</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.1s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #06B6D4;">🎨</span> <strong style="color: #010A0B;">Tailwind CSS</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #0055FF;">🌀</span> <strong style="color: #010A0B;">Framer Motion</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.3s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #3178C6;">📘</span> <strong style="color: #010A0B;">TypeScript</strong>
  </div>
</div>

### **Backend Power** ⚡
<div style="
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
  border-radius: 15px;
">
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.4s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #339933;">🟢</span> <strong style="color: #010A0B;">Node.js</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.5s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #000000;">🚂</span> <strong style="color: #010A0B;">Express</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.6s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #2D3748;">🗄️</span> <strong style="color: #010A0B;">Prisma</strong>
  </div>
  <div style="
    background: white;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: popIn 0.5s ease-out 0.7s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="color: #306998;">🐍</span> <strong style="color: #010A0B;">PostgreSQL</strong>
  </div>
</div>

</div>

<style>
  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .tech-item:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
</style>

</div>

<!-- Animated Quick Start Section -->
<div style="
  background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  padding: 30px;
  border-radius: 15px;
  margin: 30px 0;
  animation: fadeIn 1s ease-out;
  color:black;
">

## ⚡ **Quick Start**

<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
">

<!-- Step 1 -->
<div style="
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
  animation: slideIn 0.8s ease-out;
">
  <div style="
    position: absolute;
    top: -15px;
    left: -15px;
    background: #667eea;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    animation: bounce 2s infinite;
  ">1</div>
  <h3>Clone & Setup</h3>
  <pre style="
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 15px 0;
    animation: typewriter 2s steps(40);
  "><code style="color:black">git clone https://github.com/TOPDEV99999/portfolio-system.git
cd portfolio-system</code></pre>
</div>

<!-- Step 2 -->
<div style="
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
  animation: slideIn 0.8s ease-out 0.2s;
">
  <div style="
    position: absolute;
    top: -15px;
    left: -15px;
    background: #764ba2;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    animation: bounce 2s infinite 0.2s;
  ">2</div>
  <h3>Install Dependencies</h3>
  <pre style="
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 15px 0;
    animation: typewriter 2s steps(40) 0.2s;
  "><code style="color:black">cd server && npm install
cd ../client && npm install</code></pre>
</div>

<!-- Step 3 -->
<div style="
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
  animation: slideIn 0.8s ease-out 0.4s;
">
  <div style="
    position: absolute;
    top: -15px;
    left: -15px;
    background: #f093fb;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    animation: bounce 2s infinite 0.4s;
  ">3</div>
  <h3>Run Development</h3>
  <pre style="
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 15px 0;
    color:black;
    animation: typewriter 2s steps(40) 0.4s;
  "><code style="color:black"># Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev</code></pre>
</div>

</div>

</div>

<style>
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .step-card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
</style>

<!-- Animated Project Structure -->
<div style="animation: fadeIn 1s ease-out;">

## 📁 **Project Structure**

<div style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px;
  border-radius: 15px;
  color: white;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%);
    background-size: 20px 100%;
    animation: scan 2s linear infinite;
  "></div>
  
  <pre style="
    background: rgba(0,0,0,0.3);
    padding: 20px;
    border-radius: 10px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    position: relative;
    z-index: 1;
    animation: glow 2s infinite;
  "><code style="color: #ffffff;">
portfolio-system/
├── 📁 client/                    # 🎨 Frontend React App
│   ├── 📁 public/               # 🖼️ Static Assets
│   ├── 📁 src/                  # ���� Source Code
│   │   ├── 📁 components/       # 🧩 React Components
│   │   ├── 📁 pages/           # 📄 Page Components
│   │   ├── 📁 api/             # 🔌 API Clients
│   │   └── 📁 lib/             # 🛠️ Utilities
│   └── package.json            # 📦 Dependencies
│
├── 📁 server/                   # ⚡ Backend API
│   ├── 📁 src/                  # 🔧 Source Code
│   │   ├── 📁 routes/          # 🛣️ API Routes
│   │   ├── 📁 services/        # ⚙️ Business Logic
│   │   ├── 📁 controllers/     # 🎮 Request Handlers
│   │   └── 📁 middleware/      # 🛡️ Express Middleware
│   └── package.json            # 📦 Dependencies
│
└── README.md                   # 📖 Documentation
  </code></pre>
</div>

</div>

<style>
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
</style>

<!-- Animated Footer -->
<div align="center" style="
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  border-radius: 15px;
  margin-top: 40px;
  color: white;
  animation: fadeIn 1s ease-out;
">

## 🚀 **Ready to Launch?**

<div style="
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin: 30px 0;
">

<!-- Deploy Button -->
<a href="#" style="
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s ease;
  border: 2px solid rgba(255,255,255,0.3);
  animation: pulse 2s infinite;
">
  <span>🚀</span> Deploy Now
</a>

<!-- Demo Button -->
<a href="#" style="
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #667eea;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s ease;
  border: 2px solid white;
  animation: pulse 2s infinite 0.5s;
">
  <span>✨</span> Live Demo
</a>

<!-- Docs Button -->
<a href="#" style="
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s ease;
  border: 2px solid rgba(255,255,255,0.3);
  animation: pulse 2s infinite 1s;
">
  <span>📚</span> View Documentation
</a>

</div>

<!-- Social Links -->
<div style="margin-top: 30px;">
  <h3 style="margin-bottom: 20px;">🌟 Connect with Me</h3>
  <div style="
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  ">
    <a href="https://github.com/TOPDEV99999" style="
      background: rgba(255,255,255,0.1);
      padding: 10px 20px;
      border-radius: 25px;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    ">🐙 GitHub</a>
    <a href="mailto:uhajucewog80@gmail.com" style="
      background: rgba(255,255,255,0.1);
      padding: 10px 20px;
      border-radius: 25px;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    ">📧 Email</a>
    <a href="#" style="
      background: rgba(255,255,255,0.1);
      padding: 10px 20px;
      border-radius: 25px;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    ">💼 LinkedIn</a>
  </div>
</div>

<!-- Final Animation -->
<div style="
  margin-top: 40px;
  padding: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  animation: glow 2s infinite alternate;
">
  <p style="margin: 0; font-size: 18px;">
    <span style="animation: pulse 2s infinite;">❤️</span>
    Built with passion by <strong>Daniel Lixandru</strong>
    <span style="animation: pulse 2s infinite 1s;">🚀</span>
  </p>
  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
    Full-Stack Developer | AI Engineer | Web3 Enthusiast
  </p>
</div>

</div>

<style>
  a:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  
  .social-link:hover {
    background: rgba(255,255,255,0.2) !important;
    transform: scale(1.05);
  }
</style>

<!-- Note about GitHub README compatibility -->
<div style="
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  text-align: center;
  border-left: 4px solid #667eea;
">
  <strong>Note:</strong> This README uses HTML/CSS animations that work best when viewed directly. 
  Some animations may be limited in GitHub's markdown renderer. 
  For the full animated experience, view the README in a browser or copy the HTML to a webpage.
</div>
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const resumeData = {
  name: "Lixandru Daniel Nicolae",
  title: "Senior AI Engineer & Full-Stack Developer",
  email: "uhajucewog80@gmail.com",
  phone: "+40756216117",
  location: "Bucharest, Romania",
  summary: "Full-Stack Software Engineer with 8+ years of experience building scalable web applications using React, Next.js, Node.js, Python, TypeScript, PHP, Shopify, WooCommerce, AI, and Web3 technologies. Passionate about developing secure, high-performance software with clean architecture, modern development practices, and a focus on delivering business value.",
  resumeUrl: "https://manufacturer-word-improvements-appreciation.trycloudflare.com/api/resume",
  socials: {
    github: "https://github.com/TOPDEV99999",
    linkedin: "https://linkedin.com/in/daniellixandru",
    email: "mailto:uhajucewog80@gmail.com"
  },
  languages: ["English", "Romanian"]
};

export const experienceData = [
  {
    id: 1,
    company: "TechNova Solutions",
    position: "Senior Full-Stack Developer",
    
    duration: "Jul 2022 – Present",
    location: "Bucharest, Romania",
    responsibilities: [
      "Led the development of scalable full-stack web applications using React, Next.js, Node.js, and TypeScript",
      "Built RESTful APIs and microservices for enterprise platforms",
      "Integrated AI features using Python and OpenAI APIs",
      "Optimized application performance, security, and cloud deployments",
      "Mentored junior developers and participated in Agile development processes"
    ],
    achievements: ["Led enterprise platform architecture", "40% performance improvement", "AI feature integration"],
    stack: ["React", "Next.js", "Node.js", "TypeScript", "Python", "OpenAI", "AWS"],
    impact: "+40% Performance"
  },
  {
    id: 2,
    company: "Digital Commerce Labs",
    position: "Full-Stack Developer",
    duration: "Jun 2019 – Jun 2022",
    location: "Bucharest, Romania",
    responsibilities: [
      "Developed Shopify and WooCommerce stores with custom themes and plugins",
      "Built backend services using Node.js, Express, and Laravel",
      "Designed responsive user interfaces with React and Tailwind CSS",
      "Integrated payment gateways, inventory systems, and third-party APIs",
      "Improved website performance, SEO, and conversion rates"
    ],
    achievements: ["25+ e-commerce stores launched", "SEO & conversion optimization", "Custom payment integrations"],
    stack: ["React", "Shopify", "WooCommerce", "Node.js", "Laravel", "Tailwind CSS"],
    impact: "+35% Conversions"
  },
  {
    id: 3,
    company: "InnovateX Technologies",
    position: "Software Engineer",
    duration: "Aug 2016 – May 2019",
    location: "Bucharest, Romania",
    responsibilities: [
      "Developed web applications using JavaScript, PHP, and Python",
      "Built secure REST APIs and database-driven systems",
      "Worked with MySQL, PostgreSQL, and MongoDB",
      "Collaborated with designers and QA engineers to deliver high-quality software",
      "Participated in code reviews and CI/CD deployment pipelines"
    ],
    achievements: ["Full-stack development foundation", "CI/CD pipeline implementation", "Database architecture"],
    stack: ["JavaScript", "PHP", "Python", "MySQL", "PostgreSQL", "MongoDB"],
    impact: "20+ Projects"
  }
];

export const educationData = {
  degree: "Bachelor of Science (B.Sc.) in Computer Science",
  institution: "University of Bucharest",
  duration: "Sep 2014 – Jun 2017",
  location: "Bucharest, Romania",
  highlights: [
    "Software engineering and algorithms focus",
    "Data Structures, Database Systems, Operating Systems, Computer Networks, Web Development",
    "Full-stack web applications using modern technologies",
    "Team-based software development with Git and Agile"
  ]
};

export const projectsData = [
  {
    id: "dermaiq",
    title: "DermaIQ",
    subtitle: "AI-Powered Skin Disease Detection Platform",
    duration: "Jan 2024 – May 2024",
    category: ["AI", "Computer Vision"],
    overview: "An AI-powered healthcare platform that analyzes skin conditions using advanced machine learning models for image classification and diagnosis.",
    problem: "Dermatological diagnosis often requires specialist access, which can be expensive and slow, especially in underserved areas.",
    solution: "Built an AI-powered platform that provides instant skin condition analysis using deep learning models, making preliminary diagnosis accessible to everyone.",
    responsibilities: [
      "Developed an AI-powered healthcare platform for skin disease analysis",
      "Built the backend using Python and integrated machine learning models for image classification",
      "Designed responsive user interfaces and secure REST APIs",
      "Improved diagnostic accuracy through optimized image preprocessing and inference pipelines"
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "React", "REST API", "Machine Learning"],
    impact: "Healthcare AI platform serving diagnostic needs",
    github: "https://github.com/TOPDEV99999/ai-healthcare-platform.git",
    live: "http://www.dermaiq.com/"
  },
  {
    id: "faceswap",
    title: "Face Swap",
    subtitle: "AI Face Recognition & Image Processing Application",
    duration: "Sep 2023 – Dec 2023",
    category: ["AI", "Computer Vision"],
    overview: "An AI-powered face swapping application leveraging computer vision for real-time facial landmark detection and seamless image blending.",
    problem: "Creating realistic face swaps requires complex computer vision algorithms that handle varying lighting, angles, and facial features.",
    solution: "Implemented advanced facial landmark detection and image blending algorithms using Python and OpenCV, optimized for real-time performance.",
    responsibilities: [
      "Developed an AI-powered face swapping application using Python and OpenCV",
      "Implemented facial landmark detection and image blending algorithms",
      "Optimized processing speed and image quality for real-time performance",
      "Built an intuitive interface for seamless user interaction"
    ],
    stack: ["Python", "OpenCV", "Computer Vision", "AI", "Image Processing"],
    impact: "Real-time computer vision processing",
    github: "https://github.com/TOPDEV99999/face-swap.git",
    live: "https://face-swap-topdev.netlify.app/"
  },
  {
    id: "mern-ecommerce",
    title: "MERN Ecommerce Platform",
    subtitle: "Full-Stack Online Shopping System",
    duration: "Mar 2023 – Aug 2023",
    category: ["Web"],
    overview: "A scalable full-stack e-commerce platform with complete shopping experience including authentication, payments, and admin management.",
    problem: "Small businesses need affordable, scalable e-commerce solutions without high platform fees.",
    solution: "Built a custom e-commerce platform using the MERN stack with full authentication, payment integration, and admin dashboard.",
    responsibilities: [
      "Built a scalable e-commerce platform using React, Node.js, Express, and MongoDB",
      "Implemented authentication, payment integration, product management, and order processing",
      "Optimized application performance and responsive user experience",
      "Developed secure REST APIs and admin dashboard functionality"
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "REST API", "Payment Integration"],
    impact: "Full-stack e-commerce solution",
    github: "https://github.com/TOPDEV99999/MERN-Eco.git",
    live: "https://mern-ecommerce-omega.vercel.app/"
  },
  {
    id: "dating-platform",
    title: "Dating Platform",
    subtitle: "Social Networking & Real-Time Messaging Application",
    duration: "Sep 2022 – Feb 2023",
    category: ["Web"],
    overview: "A modern social networking platform with real-time messaging, intelligent user matching, and comprehensive profile management.",
    problem: "Building real-time social features with low latency while maintaining security and user privacy.",
    solution: "Developed a modern platform with WebSocket-based real-time messaging, secure authentication, and optimized matching algorithms.",
    responsibilities: [
      "Developed a modern dating platform using React and Node.js",
      "Implemented real-time messaging, user matching, and profile management",
      "Integrated secure authentication and media uploads",
      "Enhanced user engagement through responsive UI and optimized performance"
    ],
    stack: ["React", "Node.js", "WebSocket", "MongoDB", "Authentication"],
    impact: "Real-time messaging platform",
    github: "https://github.com/TOPDEV99999/Dating-Platform.git",
    live: "https://genzfrontend.onrender.com/"
  },
  {
    id: "fashion-ecommerce",
    title: "Fashion E-commerce Store",
    subtitle: "Custom Shopify Theme Development",
    duration: "Jan 2022 – May 2022",
    category: ["Web", "Shopify"],
    overview: "A premium fashion e-commerce storefront with custom Shopify theme, optimized for performance and conversion.",
    problem: "Fashion brands need unique, high-converting storefronts that stand out from generic Shopify templates.",
    solution: "Developed a fully custom Shopify theme with responsive design, optimized checkout flow, and third-party integrations.",
    responsibilities: [
      "Developed a custom Shopify storefront with responsive design",
      "Customized Shopify Liquid templates and theme components",
      "Integrated payment gateways and third-party applications",
      "Improved performance, SEO, and user experience"
    ],
    stack: ["Shopify", "Liquid", "JavaScript", "CSS", "Payment Gateways"],
    impact: "Custom e-commerce storefront",
    github: "https://github.com/TOPDEV99999/Fashion-eCommerce-Shop-in-React.git",
    live: "https://fashion-ecommerce0.netlify.app/"
  },
  {
    id: "blinkify",
    title: "Blinkify",
    subtitle: "Blockchain Asset Management Dashboard",
    duration: "Jun 2022 – Aug 2022",
    category: ["Blockchain", "Web"],
    overview: "A Web3 dashboard for blockchain asset management with Ethereum wallet connectivity and real-time data visualization.",
    problem: "Managing blockchain assets across different protocols is complex and requires multiple tools.",
    solution: "Built a unified Web3 dashboard with Ethereum wallet integration, smart contract interactions, and real-time blockchain data visualization.",
    responsibilities: [
      "Developed a Web3 dashboard using React and Solidity",
      "Integrated Ethereum wallet connectivity and smart contract interactions",
      "Built real-time blockchain data visualization",
      "Focused on secure and intuitive decentralized application workflows"
    ],
    stack: ["React", "Solidity", "Ethereum", "Web3", "Smart Contracts"],
    impact: "Blockchain asset management",
    github: "https://github.com/TOPDEV99999/Blinkify-tm.git",
    live: "https://blinkify-tm.netlify.app"
  },
  {
    id: "chatbot-health",
    title: "ChatBot Health Assistant",
    subtitle: "AI-Powered Medical Guidance Chatbot",
    duration: "Jun 2022 – Aug 2022",
    category: ["AI", "Web"],
    overview: "A healthcare chatbot platform providing personalized medical guidance, symptom checking, and health resource recommendations with HIPAA-compliant data handling.",
    problem: "Patients need accessible, instant health guidance without overwhelming medical systems or replacing professional care.",
    solution: "Built an AI-powered health chatbot with Django backend, medical intent classification, and safety guardrails for responsible health guidance.",
    responsibilities: [
      "Built an AI-powered health chatbot with Python and Django",
      "Implemented medical intent classification and response generation",
      "Developed HIPAA-compliant data handling and privacy safeguards",
      "Created safety guardrails for responsible health guidance"
    ],
    stack: ["Python", "Django", "AI", "NLP", "Healthcare"],
    impact: "Accessible AI health guidance platform",
    github: "https://github.com/TOPDEV99999/ai-healthcare-chatbot.git",
    live: "https://medical-ai-agent.netlify.app"
  },

];

export const skillsData = [
  {
    category: "Frontend",
    icon: "Monitor",
    skills: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 95 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML/CSS", level: 95 }
    ]
  },
  {
    category: "Backend",
    icon: "Server",
    skills: [
      { name: "Node.js", level: 92 },
      { name: "Python", level: 88 },
      { name: "Express", level: 90 },
      { name: "Laravel/PHP", level: 80 },
      { name: "REST APIs", level: 95 },
      { name: "GraphQL", level: 75 }
    ]
  },
  {
    category: "AI & ML",
    icon: "Brain",
    skills: [
      { name: "OpenAI / GPT", level: 85 },
      { name: "TensorFlow", level: 78 },
      { name: "Computer Vision", level: 80 },
      { name: "OpenCV", level: 80 },
      { name: "Prompt Engineering", level: 88 },
      { name: "AI Agents", level: 82 }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: "Cloud",
    skills: [
      { name: "AWS", level: 78 },
      { name: "Docker", level: 80 },
      { name: "CI/CD", level: 82 },
      { name: "Vercel", level: 90 },
      { name: "Git/GitHub", level: 95 },
      { name: "Linux", level: 80 }
    ]
  },
  {
    category: "Databases",
    icon: "Database",
    skills: [
      { name: "MongoDB", level: 90 },
      { name: "PostgreSQL", level: 85 },
      { name: "MySQL", level: 85 },
      { name: "Redis", level: 72 }
    ]
  },
  {
    category: "E-Commerce",
    icon: "ShoppingCart",
    skills: [
      { name: "Shopify", level: 90 },
      { name: "WooCommerce", level: 85 },
      { name: "WordPress", level: 85 },
      { name: "Liquid", level: 88 }
    ]
  },
  {
    category: "Blockchain",
    icon: "Link",
    skills: [
      { name: "Solidity", level: 75 },
      { name: "Ethereum", level: 75 },
      { name: "Web3.js", level: 78 },
      { name: "Rust", level: 70 }
    ]
  },
  {
    category: "Testing & QA",
    icon: "CheckCircle",
    skills: [
      { name: "Jest", level: 80 },
      { name: "Cypress", level: 75 },
      { name: "Unit Testing", level: 82 },
      { name: "Code Reviews", level: 90 }
    ]
  }
];

export const faqData = [
  { q: "What is your tech stack?", a: "I primarily work with React, Next.js, Node.js, Python, TypeScript, and various AI technologies including OpenAI, TensorFlow, and OpenCV." },
  { q: "Do you have experience with AI?", a: "Yes, I have extensive experience building AI-powered applications including skin disease detection (DermaIQ), face recognition systems, and AI chatbots using OpenAI, TensorFlow, and computer vision libraries." },
  { q: "Are you available for hire?", a: "Yes, I'm open to both full-time roles and freelance/contract opportunities. Feel free to reach out via email or LinkedIn." },
  { q: "What industries have you worked in?", a: "I've worked across healthcare (AI diagnostics), e-commerce (Shopify/WooCommerce), social networking, blockchain/Web3, and enterprise software." },
  { q: "Do you have cloud experience?", a: "Yes, I work with AWS, Docker, CI/CD pipelines, Vercel, and various cloud deployment strategies." },
  { q: "Can you work with blockchain?", a: "Yes, I've built Web3 dashboards using React and Solidity, integrated Ethereum wallets, and worked with smart contracts." }
];
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const resumeData = {
  name: "Lixandru Daniel Nicolae",
  title: "Senior AI Engineer & Full-Stack Developer",
  email: "uhajucewog80@gmail.com",
  phone: "+40756216117",
  location: "Bucharest, Romania",
  summary: "Full-Stack Software Engineer with 8+ years of experience building scalable web applications using React, Next.js, Node.js, Python, TypeScript, PHP, Shopify, WooCommerce, AI, and Web3 technologies. Passionate about developing secure, high-performance software with clean architecture, modern development practices, and a focus on delivering business value.",
  resumeUrl: "http://localhost:3001/api/resume",
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
    impact: "Healthcare AI platform serving diagnostic needs"
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
    impact: "Real-time computer vision processing"
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
    impact: "Full-stack e-commerce solution"
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
    impact: "Real-time messaging platform"
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
    impact: "Custom e-commerce storefront"
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
    impact: "Blockchain asset management"
  },
  {
    id: "cryptocheckmate",
    title: "CryptoCheckmate",
    subtitle: "Decentralised Chess on FlowChain",
    duration: "Feb 2024 – Apr 2024",
    category: ["Blockchain", "Web"],
    overview: "A Web3 chess gaming platform where players compete in decentralized chess matches on-chain, with verifiable move history and crypto rewards for winners.",
    problem: "Online chess platforms lack transparency in match integrity and reward distribution, with no verifiable proof of fair play.",
    solution: "Built a decentralized chess platform on FlowChain with on-chain move verification, smart contract-based reward distribution, and real-time multiplayer using WebSockets.",
    responsibilities: [
      "Developed a Web3 chess gaming platform with Next.js and Solidity smart contracts",
      "Implemented on-chain move verification and game state management",
      "Integrated FlowChain wallet connectivity and crypto reward distribution",
      "Built real-time multiplayer chess engine with WebSocket synchronization"
    ],
    stack: ["Next.js", "Solidity", "FlowChain", "WebSocket", "Web3"],
    impact: "Decentralized competitive gaming platform"
  },
  {
    id: "ai-nft",
    title: "AI NFT",
    subtitle: "AI-Powered NFT Creation & Marketplace",
    duration: "Nov 2023 – Jan 2024",
    category: ["Blockchain", "AI"],
    overview: "A platform that enables users to create, collect, and sell NFTs generated by AI, combining generative art with blockchain ownership.",
    problem: "NFT creation typically requires artistic skill and technical knowledge of blockchain smart contracts.",
    solution: "Built an AI-powered NFT marketplace where users generate unique digital art through AI prompts and mint them directly to the blockchain.",
    responsibilities: [
      "Built an AI-powered NFT creation platform with generative art pipeline",
      "Integrated blockchain minting and marketplace smart contracts",
      "Developed AI image generation pipeline for unique NFT artwork",
      "Implemented wallet connectivity and trading functionality"
    ],
    stack: ["Blockchain", "HTML", "Solidity", "AI", "Web3"],
    impact: "AI-generated NFT marketplace"
  },
  {
    id: "kogaea",
    title: "KOGAEA",
    subtitle: "Blockchain Fantasy Gaming World",
    duration: "Jul 2023 – Oct 2023",
    category: ["Blockchain", "Web"],
    overview: "An immersive fantasy gaming world built on blockchain, featuring collectible creatures, player-driven economy, and decentralized asset ownership.",
    problem: "Traditional gaming ecosystems lock players' assets and progress within centralized servers, removing true ownership.",
    solution: "Built a blockchain-based fantasy game where players truly own their in-game assets as NFTs, with a player-driven marketplace and decentralized governance.",
    responsibilities: [
      "Developed a blockchain fantasy gaming platform with React",
      "Implemented NFT-based asset ownership and trading system",
      "Built decentralized marketplace for in-game items",
      "Integrated Web3 wallet connectivity and smart contract interactions"
    ],
    stack: ["React", "Blockchain", "Solidity", "Web3", "NFT"],
    impact: "Blockchain gaming with true asset ownership"
  },
  {
    id: "topps",
    title: "Topps",
    subtitle: "Digital Trading Cards Platform",
    duration: "May 2023 – Jul 2023",
    category: ["Web", "Blockchain"],
    overview: "A digital trading cards platform that combines collectible card mechanics with blockchain authenticity verification and a peer-to-peer trading marketplace.",
    problem: "Digital collectibles lack verifiable authenticity and scarcity, making trading risky and untrustworthy.",
    solution: "Built a platform with blockchain-backed digital trading cards, each verifiable and scarce, with a seamless peer-to-peer trading experience.",
    responsibilities: [
      "Built a digital trading cards platform with Web Development and Python",
      "Implemented blockchain verification for card authenticity",
      "Developed peer-to-peer trading marketplace",
      "Created card collection management and display interface"
    ],
    stack: ["Python", "Web Development", "Blockchain", "React"],
    impact: "Verifiable digital collectibles platform"
  },
  {
    id: "custom-built",
    title: "Custom Built",
    subtitle: "Custom PC Builder & E-commerce Platform",
    duration: "Mar 2023 – May 2023",
    category: ["Web"],
    overview: "An e-commerce platform for custom computer towers with an interactive PC builder, real-time compatibility checking, and component specification displays.",
    problem: "Buying custom PCs is complex — customers struggle with component compatibility and configuration.",
    solution: "Built a custom PC builder platform with real-time compatibility checking, interactive configuration, and seamless e-commerce checkout.",
    responsibilities: [
      "Developed an interactive custom PC builder with PHP and JavaScript",
      "Implemented real-time component compatibility checking",
      "Built e-commerce checkout and order management system",
      "Created product specification displays and comparison tools"
    ],
    stack: ["PHP", "JavaScript", "E-commerce", "Web Design"],
    impact: "Interactive custom PC e-commerce platform"
  },
  {
    id: "sema",
    title: "SEMA",
    subtitle: "Automotive Showcase & E-commerce Platform",
    duration: "Jan 2023 – Mar 2023",
    category: ["Shopify", "Web"],
    overview: "An automotive showcase and e-commerce platform featuring performance car parts, with a custom Shopify theme optimized for visual product display.",
    problem: "Automotive parts e-commerce needs to balance detailed technical specifications with visually compelling product presentation.",
    solution: "Built a custom Shopify theme with enhanced product galleries, technical spec displays, and optimized checkout for automotive enthusiasts.",
    responsibilities: [
      "Built a custom Shopify theme for automotive e-commerce",
      "Developed enhanced product galleries and technical spec displays",
      "Optimized checkout flow for high-conversion automotive sales",
      "Integrated payment gateways and third-party automotive apps"
    ],
    stack: ["Shopify", "HTML", "Liquid", "JavaScript"],
    impact: "High-conversion automotive e-commerce"
  },
  {
    id: "buzznerd",
    title: "Buzznerd",
    subtitle: "Trucks E-commerce Platform",
    duration: "Oct 2022 – Dec 2022",
    category: ["WordPress", "Web"],
    overview: "A comprehensive trucks e-commerce platform with 25 service centers, parts stores across multiple states, and a robust inventory management system.",
    problem: "Truck and heavy vehicle parts businesses need a scalable e-commerce solution with complex inventory across multiple locations.",
    solution: "Built a WordPress and WooCommerce platform with multi-location inventory management, advanced search, and integrated service center locator.",
    responsibilities: [
      "Built a trucks e-commerce platform with WordPress and WooCommerce",
      "Implemented multi-location inventory management system",
      "Developed service center locator and parts search functionality",
      "Optimized for large product catalogs and complex categorization"
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "JavaScript"],
    impact: "Multi-location truck parts e-commerce"
  },
  {
    id: "neurogym",
    title: "Neurogym",
    subtitle: "Cognitive Training & Learning Platform",
    duration: "Aug 2022 – Oct 2022",
    category: ["Web", "AI"],
    overview: "A cognitive training platform with personalized learning paths, video course modules, and progress tracking dashboards for brain fitness and skill development.",
    problem: "Online learning platforms lack personalized progress tracking and engaging cognitive training experiences.",
    solution: "Built a React and Next.js cognitive training platform with personalized learning paths, progress analytics, and interactive video modules.",
    responsibilities: [
      "Developed a cognitive training platform with React and Next.js",
      "Built personalized learning path recommendation system",
      "Implemented progress tracking dashboard with analytics",
      "Created interactive video course modules with quizzes"
    ],
    stack: ["React", "Next.js", "Node.js", "Analytics"],
    impact: "Personalized cognitive training platform"
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
    impact: "Accessible AI health guidance platform"
  },
  {
    id: "bandieredelmondo",
    title: "BandieredelMondo",
    subtitle: "Flag E-commerce Store",
    duration: "Apr 2022 – Jun 2022",
    category: ["WordPress", "Web"],
    overview: "A premium flag e-commerce store with custom WooCommerce integration, supporting international shipping, multi-language support, and custom flag configurations.",
    problem: "Flag retailers need a specialized e-commerce solution that handles custom configurations, international shipping, and large product variations.",
    solution: "Built a WooCommerce-based flag e-commerce platform with custom product configurator, international shipping integration, and multi-language support.",
    responsibilities: [
      "Built a flag e-commerce store with WordPress and WooCommerce",
      "Developed custom flag configuration and customization tools",
      "Implemented international shipping and multi-language support",
      "Optimized product catalog for large flag variations"
    ],
    stack: ["Web Development", "WooCommerce", "WordPress", "PHP"],
    impact: "International flag e-commerce platform"
  },
  {
    id: "ayana-bali",
    title: "AYANA Bali",
    subtitle: "Luxury 5-Star Resort & Spa Website",
    duration: "Feb 2022 – Apr 2022",
    category: ["Design", "Web"],
    overview: "A breathtaking luxury resort website for AYANA Bali, featuring immersive visual storytelling, booking integration, and a premium design reflecting the resort's 5-star experience.",
    problem: "Luxury resorts need websites that convey their premium experience while maintaining fast performance and seamless booking functionality.",
    solution: "Designed and developed a visually stunning resort website with immersive imagery, smooth animations, and integrated booking system.",
    responsibilities: [
      "Designed luxury resort website with Adobe Illustrator and HTML",
      "Created immersive visual storytelling with parallax animations",
      "Developed integrated booking and reservation system",
      "Optimized for premium visual experience and fast performance"
    ],
    stack: ["Adobe Illustrator", "HTML", "CSS", "JavaScript"],
    impact: "Premium luxury resort digital experience"
  },
  {
    id: "metaverse-expo",
    title: "Metaverse Expo Platform",
    subtitle: "3D Virtual Trade Show Environment",
    duration: "Dec 2021 – Feb 2022",
    category: ["Web"],
    overview: "A 3D virtual trade show platform enabling real-time exhibition experiences with avatar interaction, virtual booths, and spatial networking — built for the next era of digital events.",
    problem: "Virtual events lack the interactivity and networking experience of in-person trade shows, limiting engagement and business connections.",
    solution: "Built a real-time 3D virtual trade show platform with React, Three.js, and Socket.io, featuring avatar synchronization, virtual booths, and spatial audio.",
    responsibilities: [
      "Developed a 3D virtual trade show platform with React and Three.js",
      "Implemented real-time avatar synchronization with Socket.io",
      "Built virtual booth management and interaction systems",
      "Optimized WebGL rendering for smooth 3D performance at scale"
    ],
    stack: ["React", "Socket.io", "Three.js", "WebGL", "Node.js"],
    impact: "Immersive 3D virtual event platform"
  },
  {
    id: "kaho-enterprise",
    title: "Kaho Enterprise",
    subtitle: "Enterprise DX & Data Analytics Consulting",
    duration: "Oct 2021 – Dec 2021",
    category: ["Web"],
    overview: "An enterprise digital transformation platform providing data analytics consulting, DX strategy tools, and data visualization dashboards for enterprise clients.",
    problem: "Enterprises struggle with digital transformation, lacking unified tools for data analytics and DX strategy execution.",
    solution: "Built an enterprise consulting platform with AWS-backed data analytics, custom dashboards, and DX strategy management tools.",
    responsibilities: [
      "Developed enterprise DX platform with AWS and PHP",
      "Built data analytics dashboards and visualization tools",
      "Implemented enterprise-grade security and data governance",
      "Created DX strategy management and reporting interfaces"
    ],
    stack: ["Amazon Web Services (AWS)", "PHP", "Data Analytics", "React"],
    impact: "Enterprise digital transformation platform"
  },
  {
    id: "brazilian-style",
    title: "Brazilian Style E-commerce",
    subtitle: "Premium Fashion E-commerce Platform",
    duration: "Aug 2021 – Oct 2021",
    category: ["Web", "Shopify"],
    overview: "A premium fashion e-commerce platform showcasing Brazilian fashion with curated collections, lookbook integration, and an optimized shopping experience for fashion-forward customers.",
    problem: "Fashion e-commerce needs to balance visual editorial content with a smooth, high-conversion shopping experience.",
    solution: "Built a premium fashion e-commerce platform with curated lookbook integration, advanced product filtering, and optimized checkout.",
    responsibilities: [
      "Built a premium fashion e-commerce platform",
      "Developed curated lookbook and collection management",
      "Implemented advanced product filtering and search",
      "Optimized checkout flow for fashion retail conversion"
    ],
    stack: ["E-commerce", "Web Design", "JavaScript", "CSS"],
    impact: "Premium fashion e-commerce experience"
  },
  {
    id: "club-ange",
    title: "Club Ange",
    subtitle: "Premium Dating Club Platform",
    duration: "Jun 2021 – Aug 2021",
    category: ["WordPress", "Web"],
    overview: "A premium dating club and social platform with membership management, profile verification, and sophisticated matching features for an exclusive dating experience.",
    problem: "Premium dating services need exclusive membership management with verification, privacy controls, and sophisticated matching.",
    solution: "Built a WordPress-based premium dating platform with membership tiers, profile verification, and advanced matching algorithms.",
    responsibilities: [
      "Built a premium dating club platform with WordPress",
      "Implemented membership tiers and profile verification system",
      "Developed sophisticated matching and privacy features",
      "Created exclusive member dashboard and communication tools"
    ],
    stack: ["WordPress", "Web Design", "PHP", "JavaScript"],
    impact: "Exclusive premium dating platform"
  },
  {
    id: "booty-fitness",
    title: "Booty Fitness",
    subtitle: "Women's Exclusive Personal Gym Platform",
    duration: "Apr 2021 – Jun 2021",
    category: ["Design", "Web"],
    overview: "A women's exclusive fitness platform with personalized training programs, workout tracking, and a supportive community focused on body positivity and strength.",
    problem: "Women seeking fitness guidance need a specialized platform with personalized programs and a supportive, body-positive community.",
    solution: "Built a women's fitness platform with personalized workout programs, progress tracking, and community features with premium branding.",
    responsibilities: [
      "Designed and built a women's fitness platform with Graphic Design and PHP",
      "Developed personalized workout program management",
      "Implemented progress tracking and fitness analytics",
      "Created community features and premium branding"
    ],
    stack: ["Graphic Design", "PHP", "JavaScript", "Web Design"],
    impact: "Women's specialized fitness platform"
  },
  {
    id: "ai-crm",
    title: "AI-Powered CRM",
    subtitle: "Intelligent Customer Relationship Management",
    duration: "Feb 2021 – Apr 2021",
    category: ["AI", "Web"],
    overview: "An AI-powered CRM system that transforms customer interactions into actionable insights, with intelligent lead scoring, conversation analysis, and automated sales workflows.",
    problem: "Traditional CRMs require manual data entry and lack intelligent insights, leaving sales teams reactive rather than proactive.",
    solution: "Built an AI-driven CRM with LLM-powered conversation analysis, automated lead scoring, and intelligent sales workflow recommendations.",
    responsibilities: [
      "Developed an AI-powered CRM with React and Next.js",
      "Integrated LLM-powered conversation analysis and lead scoring",
      "Built automated sales workflow and recommendation engine",
      "Implemented intelligent customer interaction analytics"
    ],
    stack: ["React", "Next.js", "AI", "LLM", "Node.js"],
    impact: "AI-driven sales intelligence platform"
  },
  {
    id: "joie-tv-tabi",
    title: "Joie TV Tabi",
    subtitle: "Solo Travel Discovery Platform",
    duration: "Dec 2020 – Feb 2021",
    category: ["Design", "Web"],
    overview: "A solo travel discovery platform featuring curated travel experiences, destination guides, and immersive visual storytelling for independent travelers.",
    problem: "Solo travelers lack a curated platform that combines destination discovery with practical travel planning and inspiring visual content.",
    solution: "Built a travel discovery platform with curated destination guides, immersive visual storytelling, and practical travel planning tools.",
    responsibilities: [
      "Designed and built a solo travel discovery platform",
      "Created immersive visual storytelling with Adobe Illustrator",
      "Developed curated destination guides and travel planning tools",
      "Implemented travel content management with PHP backend"
    ],
    stack: ["Adobe Illustrator", "PHP", "JavaScript", "Web Design"],
    impact: "Curated solo travel discovery platform"
  },
  {
    id: "fanfan-online",
    title: "FanFan Online",
    subtitle: "Social Discovery & Connection Platform",
    duration: "Oct 2020 – Dec 2020",
    category: ["Design", "Web"],
    overview: "A social discovery platform focused on meaningful connections, with AI-assisted matching, interest-based communities, and premium visual design.",
    problem: "Social platforms often prioritize engagement metrics over meaningful, quality connections between users.",
    solution: "Built a social discovery platform with AI-assisted matching, interest-based community features, and a premium, design-forward interface.",
    responsibilities: [
      "Designed and built a social discovery platform",
      "Created premium visual design with Graphic Design tools",
      "Developed AI-assisted matching and community features with Next.js",
      "Implemented interest-based recommendation system"
    ],
    stack: ["Graphic Design", "Next.js", "AI", "JavaScript"],
    impact: "Meaningful social discovery platform"
  }
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
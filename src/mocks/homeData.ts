export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Advice', href: '#categories' },
  { label: 'Resources', href: '#dashboard' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Chat', href: '/chat' },
];

export const adviceCategories = [
  {
    id: 'hr-policies',
    title: 'HR Policies',
    description: 'Employee handbooks, code of conduct, and workplace policy templates — explained in plain English.',
    icon: 'ri-file-list-3-line',
    color: 'primary',
    count: 124,
  },
  {
    id: 'employee-relations',
    title: 'Employee Relations',
    description: 'Conflict resolution, workplace mediation, and team communication guides that actually help.',
    icon: 'ri-team-line',
    color: 'secondary',
    count: 98,
  },
  {
    id: 'performance',
    title: 'Performance Management',
    description: 'Goal setting frameworks, review templates, and feedback best practices without the fluff.',
    icon: 'ri-line-chart-line',
    color: 'accent',
    count: 156,
  },
  {
    id: 'recruitment',
    title: 'Recruitment & Hiring',
    description: 'Interview guides, job description templates, and talent acquisition strategies that work.',
    icon: 'ri-user-search-line',
    color: 'primary',
    count: 187,
  },
  {
    id: 'benefits',
    title: 'Benefits & Compensation',
    description: 'Salary benchmarking, benefits planning, and total rewards frameworks made simple.',
    icon: 'ri-gift-line',
    color: 'secondary',
    count: 142,
  },
  {
    id: 'compliance',
    title: 'Compliance & Legal',
    description: 'Labor law updates, regulatory checklists, and compliance documentation you can understand.',
    icon: 'ri-shield-check-line',
    color: 'accent',
    count: 89,
  },
];

export const dashboardCards = [
  {
    id: 'recent-advice',
    title: 'Recently Viewed',
    subtitle: 'Pick up where you left off',
    items: [
      { label: 'Remote Work Policy Template', type: 'Template', icon: 'ri-file-text-line' },
      { label: 'Performance Review Guide', type: 'Guide', icon: 'ri-book-open-line' },
      { label: 'Conflict Resolution Framework', type: 'Framework', icon: 'ri-scales-line' },
    ],
  },
  {
    id: 'recommended',
    title: 'Recommended For You',
    subtitle: 'Based on your role & interests',
    items: [
      { label: 'New Manager Onboarding Kit', type: 'Kit', icon: 'ri-rocket-line' },
      { label: 'DEI Best Practices 2025', type: 'Report', icon: 'ri-pie-chart-line' },
      { label: 'Employee Engagement Survey', type: 'Tool', icon: 'ri-clipboard-line' },
    ],
  },
  {
    id: 'trending',
    title: 'Trending Resources',
    subtitle: 'Popular with HR professionals',
    items: [
      { label: 'AI in HR: Implementation Guide', type: 'Guide', icon: 'ri-robot-line' },
      { label: 'Hybrid Workplace Playbook', type: 'Playbook', icon: 'ri-building-line' },
      { label: 'Mental Health Resource Kit', type: 'Kit', icon: 'ri-heart-pulse-line' },
    ],
  },
  {
    id: 'saved',
    title: 'Your Saved Items',
    subtitle: 'Bookmarked for later',
    items: [
      { label: 'Compensation Benchmarking', type: 'Report', icon: 'ri-funds-line' },
      { label: 'Exit Interview Template', type: 'Template', icon: 'ri-logout-box-line' },
      { label: 'Team Building Activities', type: 'Guide', icon: 'ri-group-line' },
    ],
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'HR Director, TechVista Inc.',
    quote: 'HR Voodoo completely transformed how our team handles everyday HR challenges. The policy templates alone saved us countless hours, and the personalized recommendations helped us build a more engaged workforce.',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20Asian%20female%20HR%20professional%20in%20her%20thirties%2C%20warm%20natural%20office%20lighting%2C%20friendly%20approachable%20expression%2C%20clean%20neutral%20background%2C%20professional%20attire%20in%20neutral%20tones%2C%20editorial%20photography%20style%20with%20soft%20natural%20shadows%2C%20calm%20and%20trustworthy%20vibe&width=600&height=600&seq=hr-testimonial-sarah-v2&orientation=squarish',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'People Operations Manager, GreenLeaf Co.',
    quote: 'As a growing startup, we needed HR guidance that was practical and accessible. HR Voodoo became our go-to resource. The compliance checklists alone are worth their weight in gold.',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20friendly%20African%20American%20male%20manager%20in%20his%20thirties%2C%20warm%20natural%20office%20lighting%2C%20genuine%20confident%20smile%2C%20clean%20neutral%20background%2C%20casual%20professional%20attire%2C%20editorial%20photography%20style%20with%20soft%20shadows%2C%20approachable%20and%20trustworthy%20atmosphere&width=600&height=600&seq=hr-testimonial-marcus-v2&orientation=squarish',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'VP of Talent, Nexus Financial',
    quote: 'The personalized dashboard feature is a game-changer. My team can quickly access relevant resources without digging through folders. HR Voodoo made HR self-service actually work.',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20Latina%20female%20executive%20in%20her%20forties%2C%20warm%20natural%20office%20lighting%2C%20assured%20professional%20expression%2C%20clean%20neutral%20background%2C%20elegant%20business%20attire%2C%20editorial%20photography%20style%20with%20soft%20natural%20shadows%2C%20authoritative%20yet%20warm%20presence&width=600&height=600&seq=hr-testimonial-elena-v2&orientation=squarish',
  },
];

export const footerLinks = {
  platform: {
    title: 'Platform',
    links: [
      { label: 'Advice Categories', href: '#categories' },
      { label: 'Resource Library', href: '#dashboard' },
      { label: 'Dashboard', href: '#dashboard' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Privacy Policy', href: '/legal' },
    ],
  },
  connect: {
    title: 'Connect',
    links: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
};

export const pricingPlans = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for individuals exploring HR guidance',
    price: 0,
    period: 'forever free',
    features: [
      'Access to 50+ HR resources',
      'Basic policy templates',
      'Community Q&A access',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For HR teams that need serious guidance',
    price: 24,
    period: 'per user / month',
    features: [
      'Unlimited HR resources',
      'Advanced policy builder',
      'Priority support',
      'Team collaboration',
      'Custom templates',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-scale HR transformation for large organizations',
    price: 69,
    period: 'per user / month',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'SSO & advanced security',
      'Custom integrations',
      'Onboarding training',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const chatMessages = [
  {
    id: 1,
    sender: 'user',
    content: 'What is a PIP and what should I expect?',
    time: '10:32 AM',
  },
  {
    id: 2,
    sender: 'ai',
    content: "A PIP — Performance Improvement Plan — is a structured plan your manager creates to help you meet specific job expectations. It's not a punishment. Think of it as a clear roadmap with goals, support, and check-ins. Here's what typically happens:",
    time: '10:32 AM',
    bullets: [
      'You receive a written document with specific goals and timelines',
      'Regular one-on-one meetings to check progress',
      'Access to training or resources to help you succeed',
      'A final review at the end of the plan period',
    ],
  },
  {
    id: 3,
    sender: 'user',
    content: 'Can I negotiate my notice period?',
    time: '10:35 AM',
  },
  {
    id: 4,
    sender: 'ai',
    content: "Yes, notice periods can often be negotiated — but it depends on your contract and company policy. Here is what you should know:",
    time: '10:35 AM',
    bullets: [
      'Check your employment contract for the standard notice clause',
      'Employers can sometimes waive notice with mutual agreement',
      'You may be able to use accrued leave to reduce the notice period',
      'Always get any changes in writing',
    ],
  },
  {
    id: 5,
    sender: 'ai',
    content: "Would you like me to explain what happens if you leave without serving your full notice period?",
    time: '10:36 AM',
    isFollowUp: true,
  },
];

export const chatSuggestions = [
  'What is a PIP?',
  'How do I request flexible working?',
  'Can my employer change my contract?',
  'What are my rights during redundancy?',
];
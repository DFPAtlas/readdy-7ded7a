import { useState } from 'react';
import { adviceCategories } from '@/mocks/homeData';

const colorMap: Record<string, { bg: string; badge: string; text: string; iconBg: string; hoverBorder: string }> = {
  primary: {
    bg: 'bg-primary-50',
    badge: 'bg-primary-100 text-primary-700',
    text: 'text-primary-700',
    iconBg: 'bg-primary-500',
    hoverBorder: 'hover:border-primary-300',
  },
  accent: {
    bg: 'bg-accent-50',
    badge: 'bg-accent-100 text-accent-700',
    text: 'text-accent-700',
    iconBg: 'bg-accent-500',
    hoverBorder: 'hover:border-accent-300',
  },
  secondary: {
    bg: 'bg-secondary-50',
    badge: 'bg-secondary-100 text-secondary-700',
    text: 'text-secondary-700',
    iconBg: 'bg-secondary-500',
    hoverBorder: 'hover:border-secondary-300',
  },
};

export default function AdviceCategories() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { key: 'all', label: 'All Categories' },
    { key: 'policies', label: 'Policies' },
    { key: 'relations', label: 'Relations' },
    { key: 'performance', label: 'Performance' },
    { key: 'hiring', label: 'Hiring' },
  ];

  const filteredCategories = activeTab === 'all'
    ? adviceCategories
    : adviceCategories.filter((cat) => {
        const map: Record<string, string> = {
          policies: 'hr-policies',
          relations: 'employee-relations',
          performance: 'performance',
          hiring: 'recruitment',
        };
        return cat.id === map[activeTab];
      });

  return (
    <section id="categories" className="relative bg-background-100 py-16 md:py-20 lg:py-24">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary-200/60 text-primary-600 text-xs font-medium tracking-wide mb-4">
              <i className="ri-folders-line text-xs"></i>
              What We Cover
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-900 font-bold leading-tight">
              Expert advice across
              <br />
              <span className="text-accent-500">every HR domain.</span>
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-background-200/60 rounded-full p-1 overflow-x-auto flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-foreground-500 hover:text-foreground-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredCategories.map((category) => {
            const colors = colorMap[category.color] || colorMap.primary;
            return (
              <div
                key={category.id}
                className={`group relative overflow-hidden rounded-xl ${colors.bg} border border-transparent ${colors.hoverBorder} p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl ${colors.iconBg} text-white mb-4 shadow-sm`}>
                    <i className={`${category.icon} text-xl md:text-2xl`}></i>
                  </div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-primary-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-foreground-500 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                      <i className="ri-article-line text-xs"></i>
                      {category.count} resources
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Browse <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
const PageHeader = ({ tag, title, subtitle, bgFrom = 'from-pink-light', bgVia = 'via-cream', bgTo = 'to-gold-light' }) => (
  <div className={`pt-20 bg-gradient-to-br ${bgFrom} ${bgVia} ${bgTo}`}>
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
      {tag && (
        <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">{tag}</p>
      )}
      <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">{title}</h1>
      {subtitle && (
        <p className="text-gray-500 text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  </div>
);

export default PageHeader;

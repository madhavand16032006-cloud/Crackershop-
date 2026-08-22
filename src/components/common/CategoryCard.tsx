import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.slug || category.name)}`}
      id={`category-card-${category.id}`}
      className="group relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-end"
    >
      {/* Background Image with Gradient */}
      <img
        src={category.image}
        alt={category.name}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-75 group-hover:brightness-85"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

      {/* Content overlay */}
      <div className="relative p-3.5 sm:p-4 z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {category.itemCount !== undefined ? `${category.itemCount} Items` : 'Sivakasi Special'}
          </span>
          <span className="w-6 h-6 rounded-full bg-amber-500/20 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 group-hover:text-slate-200 transition-colors">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

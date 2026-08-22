import React from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryCard } from '../components/common/CategoryCard';

export const CategoriesPage: React.FC = () => {
  const { categories, loading } = useShop();

  return (
    <div id="categories-directory-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            Complete Product Range
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Sivakasi Fireworks Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From sparkling family favourites to grand night aerial shows and value gift boxes. Click any category to explore available wholesale packs.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

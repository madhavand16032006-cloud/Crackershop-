import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Flame,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const ProductsPage: React.FC = () => {
  const { categories } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'discount' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch products from server
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ activeOnly: true });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync category and sort from URL
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    const sortParam = searchParams.get('sort');
    if (sortParam === 'discount' || searchParams.get('offers') === 'true') {
      setSortBy('discount');
    }
  }, [searchParams]);

  // Client-side filtering & sorting for instant snappy feel
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match (by slug, name or categoryId)
      if (selectedCategory && selectedCategory !== 'all') {
        const catMatch =
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.categoryId === selectedCategory ||
          p.slug.includes(selectedCategory.toLowerCase());
        if (!catMatch) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
        if (!match) return false;
      }

      // Stock match
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Price match
      if (p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      }
      // default 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const handleCategorySelect = (catSlugOrName: string) => {
    setSelectedCategory(catSlugOrName);
    if (catSlugOrName === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlugOrName);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(3000);
    setSearchParams({});
  };

  return (
    <div id="products-catalogue-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              100% Genuine Sivakasi Fireworks
            </div>
            {sortBy === 'discount' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                60% Festive Deals Applied (Highest Discount First)
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {sortBy === 'discount' ? '60% Factory Discount Deals & Offers' : 'Wholesale Fireworks Catalogue'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Browse our full 2026 festival selection at direct factory rates. Add items to your cart and send your order straight to the shop owner on WhatsApp.
          </p>
        </div>
      </div>

      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="products-search-input"
            placeholder="Search crackers by name, category, or sound level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            Filters
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 absolute left-3 pointer-events-none" />
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-8 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount %</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(selectedCategory !== 'all' || searchQuery || inStockOnly || maxPrice < 3000) && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                Filter Products
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Categories Filter List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>All Fireworks</span>
                  <span>{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory === cat.slug ||
                    selectedCategory === cat.name ||
                    selectedCategory === cat.id;

                  const count = products.filter(
                    (p) => p.categoryId === cat.id || p.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug || cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[11px] opacity-80">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Max Price</span>
                <span className="text-amber-400">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>₹50</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-9 space-y-6">
          {/* Active filter pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> of {products.length} fireworks
            </div>

            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                Category: {selectedCategory}
                <button
                  onClick={() => handleCategorySelect('all')}
                  className="hover:text-white ml-1"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                Try adjusting your search query, increasing maximum price, or resetting your category filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

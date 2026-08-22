import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/whatsapp';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ search: query, activeOnly: true });
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div
        id="search-modal-card"
        className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search sparklers, flower pots, sky shots, gift boxes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="close-search-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="text-center py-8 text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              Searching Sivakasi catalogue...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p className="text-base text-slate-300 font-medium">No fireworks found for "{query}"</p>
              <p className="text-sm mt-1 text-slate-500">Try searching for "Sparkler", "Flower Pot", "Sky Shot", or "Box"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Sparklers', '12 Shot Sky Cake', 'Flower Pots', 'Ground Chakkars', 'Diwali Gift Box', 'Rockets'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-sm border border-slate-700/60 hover:border-amber-500/40 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && results.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={onClose}
              id={`search-result-${product.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-amber-500/30 transition-all group"
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-lg object-cover bg-slate-800 border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {product.category}
                  </span>
                  {product.stock <= 0 && (
                    <span className="text-xs text-rose-400 font-medium">Out of stock</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors mt-0.5">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-amber-400 font-bold text-sm">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-slate-500 text-xs line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
          Showing direct factory wholesale rates • Send orders directly to WhatsApp
        </div>
      </div>
    </div>
  );
};

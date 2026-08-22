import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Flame,
  Check,
  X,
  Package,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/whatsapp';

export const AdminProducts: React.FC = () => {
  const { categories, showToast, refreshShopData } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    description: '',
    image: '',
    pieceCount: '',
    soundLevel: 'Medium',
    stock: '50',
    featured: false,
    active: true
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ activeOnly: false });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.name || 'Sparklers & Flares',
      categoryId: categories[0]?.id || 'cat_sparklers',
      price: '',
      originalPrice: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
      pieceCount: '1 Box / 10 Pcs',
      soundLevel: 'Low',
      stock: '50',
      featured: false,
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      categoryId: product.categoryId || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      description: product.description || '',
      image: product.image,
      pieceCount: product.pieceCount || '',
      soundLevel: product.soundLevel || 'Medium',
      stock: product.stock.toString(),
      featured: product.featured || false,
      active: product.active
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Please provide a product name and price', 'error');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        category: formData.category,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
        pieceCount: formData.pieceCount.trim(),
        soundLevel: formData.soundLevel,
        stock: Number(formData.stock) || 0,
        featured: formData.featured,
        active: formData.active
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        showToast('New fireworks product added to catalogue!');
      }

      setModalOpen(false);
      loadProducts();
      refreshShopData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from catalogue?`)) {
      return;
    }

    try {
      await api.deleteProduct(id);
      showToast('Product deleted from catalogue');
      loadProducts();
      refreshShopData();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { active: !product.active });
      showToast(`Product marked as ${!product.active ? 'Active' : 'Hidden'}`);
      loadProducts();
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStock = product.stock > 0 ? 0 : 50;
    try {
      await api.updateProduct(product.id, { stock: newStock });
      showToast(`Stock updated: ${newStock > 0 ? 'In Stock' : 'Out of Stock'}`);
      loadProducts();
    } catch (err) {
      showToast('Failed to update stock', 'error');
    }
  };

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category !== selectedCat && p.categoryId !== selectedCat) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="admin-products-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Manage Products Catalogue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, update prices, manage stocks, or feature crackers on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="admin-add-product-btn"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-950/30"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fireworks by name or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading products catalogue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No products matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-3.5 pl-4">Product</th>
                  <th className="py-3.5">Category</th>
                  <th className="py-3.5">Price / MRP</th>
                  <th className="py-3.5">Stock</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Featured</th>
                  <th className="py-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-950/40 transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3.5 pl-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-[200px] sm:max-w-xs">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {product.pieceCount || 'Standard pack'} • {product.soundLevel || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 text-slate-300">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium border border-slate-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5">
                      <div className="font-bold text-amber-400 font-mono">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          product.stock > 0
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-emerald-500/10 hover:text-emerald-400'
                        }`}
                        title="Click to toggle In/Out of Stock"
                      >
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </button>
                    </td>

                    {/* Active Visibility */}
                    <td className="py-3.5">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          product.active
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {product.active ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3.5">
                      {product.featured ? (
                        <span className="text-amber-400 flex items-center gap-1 font-bold text-[10px]">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">
                {editingProduct ? 'Edit Fireworks Product' : 'Add New Fireworks Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50cm Electric Sparklers Deluxe (Pack of 10)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              {/* Category & Piece Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.name === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryId: selected?.id || ''
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pack Packaging / Pieces
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Box / 10 Pcs or 1 Piece"
                    value={formData.pieceCount}
                    onChange={(e) => setFormData({ ...formData, pieceCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Pricing (Wholesale Selling Price & Original Price) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Selling Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 120"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Original MRP (₹) <span className="text-slate-500 font-normal">(For discount display)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 240"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Image URL & Sound Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sound Level Rating
                  </label>
                  <select
                    value={formData.soundLevel}
                    onChange={(e) => setFormData({ ...formData, soundLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Silent / Light Sparkles">Silent / Light Sparkles</option>
                    <option value="Low">Low Decibel</option>
                    <option value="Medium">Medium Decibel</option>
                    <option value="High (Traditional Sound)">High (Traditional Sound)</option>
                    <option value="Multi-Aerial Whistle">Multi-Aerial Whistle</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Product Description & Effects
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe colors, aerial burst height, sparkle duration, etc..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Flags: Featured & Active */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Visible in Catalogue</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-950/40"
                >
                  {formSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

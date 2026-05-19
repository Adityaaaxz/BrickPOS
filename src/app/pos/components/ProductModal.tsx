"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Package, Tag, Layers, Star, Users, DollarSign, BarChart2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

type Product = {
  id?: number; name: string; price: number; category: string;
  image: string; imageUrl?: string; stock: number; pieces: number;
  ageRange: string; rating: number;
};

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => Promise<void>;
}

const categories = [
  "technic","starwars","city","creator",
  "harrypotter","architecture","ninjago","friends",
  "minecraft","ideas","icons","duplo",
];

type FormFieldKey = "name" | "price" | "stock" | "pieces" | "ageRange" | "rating";

const fields: { key: FormFieldKey; label: string; icon: React.ElementType; type: string; placeholder: string }[] = [
  { key: "name",     label: "Product Name",  icon: Package,   type: "text",   placeholder: "e.g. Millennium Falcon" },
  { key: "price",    label: "Price (USD)",   icon: DollarSign,type: "number", placeholder: "e.g. 299.99" },
  { key: "stock",    label: "Stock Qty",     icon: Layers,    type: "number", placeholder: "e.g. 15" },
  { key: "pieces",   label: "Piece Count",   icon: Tag,       type: "number", placeholder: "e.g. 7541" },
  { key: "ageRange", label: "Age Range",     icon: Users,     type: "text",   placeholder: "e.g. 18+" },
  { key: "rating",   label: "Rating (0-5)",  icon: Star,      type: "number", placeholder: "e.g. 4.9" },
];

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "", price: 0, category: "technic", image: "technic",
    imageUrl: "", stock: 0, pieces: 0, ageRange: "6+", rating: 4.5,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({ ...product, imageUrl: product.imageUrl || "" });
    }
  }, [product]);

  const set = (key: keyof typeof form, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.price || form.price <= 0) e.price = "Price must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ ...form, image: form.category });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
          style={{
            background: "linear-gradient(145deg, #131325, #0d0d1a)",
            border: "1.5px solid rgba(255,213,0,0.15)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,213,0,0.04)",
          }}
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header bar */}
          <div className="h-1 rounded-t-3xl" style={{
            background: "linear-gradient(90deg, #D1120D, #FFD500, #0055BF, #00852B)"
          }} />

          <div className="p-6 sm:p-8">
            {/* Title */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {product ? "✏️ Edit Product" : "➕ Add New Product"}
                </h2>
                <p className="text-sm text-white/30 mt-1">Fill in the details below</p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Product Image
                </label>
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => set("imageUrl", url)}
                  onClear={() => set("imageUrl", "")}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      className="py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all"
                      style={{
                        background: form.category === cat ? "rgba(255,213,0,0.15)" : "rgba(255,255,255,0.04)",
                        border: form.category === cat ? "1.5px solid rgba(255,213,0,0.5)" : "1.5px solid rgba(255,255,255,0.06)",
                        color: form.category === cat ? "#FFD500" : "rgba(255,255,255,0.4)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => set("category", cat)}
                    >
                      {cat.length > 8 ? cat.slice(0, 7) + "…" : cat}
                    </motion.button>
                  ))}
                  <div className="col-span-2 relative">
                    <input 
                      type="text" 
                      placeholder="Custom..." 
                      className="w-full h-full py-2 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none"
                      style={{
                        background: categories.includes(form.category) ? "rgba(255,255,255,0.04)" : "rgba(255,213,0,0.15)",
                        border: categories.includes(form.category) ? "1.5px solid rgba(255,255,255,0.06)" : "1.5px solid rgba(255,213,0,0.5)",
                        color: categories.includes(form.category) ? "rgba(255,255,255,0.4)" : "#FFD500",
                      }}
                      value={categories.includes(form.category) ? "" : form.category}
                      onChange={(e) => set("category", e.target.value.toLowerCase())}
                    />
                  </div>
                </div>
              </div>

              {/* Form fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </label>
                    <div className="relative">
                      <input
                        type={type}
                        step={type === "number" ? "0.01" : undefined}
                        value={form[key]}
                        onChange={(e) => set(key, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                        placeholder={placeholder}
                        className="lego-input"
                        style={{
                          borderColor: errors[key] ? "rgba(209,18,13,0.5)" : undefined,
                        }}
                      />
                      {errors[key] && (
                        <p className="absolute -bottom-5 left-0 text-xs text-lego-red">{errors[key]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-3 py-3 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <BarChart2 className="w-4 h-4 text-white/30" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/30 mb-1.5">
                    <span>Stock Level</span>
                    <span>{form.stock} units</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: form.stock > 20 ? "#00852B" : form.stock > 5 ? "#FFD500" : "#D1120D",
                        width: `${Math.min((form.stock / 50) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white/50 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black text-black"
                  style={{
                    background: saving ? "rgba(255,213,0,0.5)" : "linear-gradient(135deg, #FFE44D, #FFD500, #E6BF00)",
                    boxShadow: saving ? "none" : "0 4px 0 #B89B00, 0 6px 20px rgba(255,213,0,0.3)",
                  }}
                  whileHover={saving ? {} : { scale: 1.02, boxShadow: "0 6px 0 #B89B00, 0 10px 30px rgba(255,213,0,0.5)" }}
                  whileTap={saving ? {} : { scale: 0.98 }}
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Save className="w-4 h-4" /> {product ? "Save Changes" : "Create Product"}</>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

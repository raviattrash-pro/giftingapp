import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useGiftStore } from '../../store/giftStore';
import { useUiStore } from '../../store/uiStore';
import { Plus, Search, Edit2, Trash2, Tag, IndianRupee, Image, ClipboardList, Info, Package, ShieldAlert, Boxes, Percent, Truck, MapPin, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const AdminCatalogPage = () => {
  const { catalog, fetchCatalog, addProduct, updateProduct, deleteProduct } = useGiftStore();
  const { addToast, navCategories, updateNavCategories } = useUiStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- Delivery Settings State ---
  const [deliverySettings, setDeliverySettings] = useState({
    storeAddress: '100 Main St, Mumbai',
    splitPercentage: '50',
    bulkThreshold: '2000',
    bufferDays: '1',
    hideDeliveryCharges: false
  });

  const fetchConfigs = async () => {
    try {
      const { data } = await api.get('/admin/app-config');
      setDeliverySettings({
        storeAddress: data.STORE_ADDRESS || '100 Main St, Mumbai',
        splitPercentage: data.DELIVERY_SPLIT_PERCENTAGE || '50',
        bulkThreshold: data.BULK_ORDER_THRESHOLD || '2000',
        bufferDays: data.DELIVERY_BUFFER_DAYS || '1',
        hideDeliveryCharges: data.DELIVERY_CHARGES_HIDDEN === 'true'
      });
      if (data.WRAPPING_OPTIONS) {
        setWrappingStyles(JSON.parse(data.WRAPPING_OPTIONS));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDeliverySettings = async () => {
    try {
      await api.put('/admin/app-config/STORE_ADDRESS', { value: deliverySettings.storeAddress });
      await api.put('/admin/app-config/DELIVERY_SPLIT_PERCENTAGE', { value: deliverySettings.splitPercentage });
      await api.put('/admin/app-config/BULK_ORDER_THRESHOLD', { value: deliverySettings.bulkThreshold });
      await api.put('/admin/app-config/DELIVERY_BUFFER_DAYS', { value: deliverySettings.bufferDays });
      await api.put('/admin/app-config/DELIVERY_CHARGES_HIDDEN', { value: deliverySettings.hideDeliveryCharges ? 'true' : 'false' });
      addToast('Delivery settings saved successfully.', 'success');
    } catch (err) {
      addToast('Failed to save delivery settings.', 'error');
    }
  };

  // --- Local State for Nav Categories ---
  const [localNavCategories, setLocalNavCategories] = useState(navCategories || []);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('All');

  // --- Wrapping Styles State ---
  const [wrappingStyles, setWrappingStyles] = useState([
    { label: 'Classic Parchment Paper & Wax Seal', price: 0 },
    { label: 'Premium Silk Furoshiki Wrap', price: 1200 },
    { label: 'Midnight Blue Velvet Box', price: 800 }
  ]);
  const [newWrapLabel, setNewWrapLabel] = useState('');
  const [newWrapPrice, setNewWrapPrice] = useState('');
  const [editingWrapIndex, setEditingWrapIndex] = useState(null);

  const handleSaveWrappingStyles = async (stylesToSave = wrappingStyles) => {
    try {
      await api.put('/admin/app-config/WRAPPING_OPTIONS', { value: JSON.stringify(stylesToSave) });
      addToast('Wrapping styles saved successfully.', 'success');
    } catch (err) {
      addToast('Failed to save wrapping styles.', 'error');
    }
  };

  const handleAddWrappingStyle = () => {
    if (!newWrapLabel.trim()) return;
    const updated = [...wrappingStyles, { label: newWrapLabel.trim(), price: Number(newWrapPrice) || 0 }];
    setWrappingStyles(updated);
    setNewWrapLabel('');
    setNewWrapPrice('');
    handleSaveWrappingStyles(updated);
  };

  const handleDeleteWrappingStyle = (index) => {
    const updated = [...wrappingStyles];
    updated.splice(index, 1);
    setWrappingStyles(updated);
    handleSaveWrappingStyles(updated);
  };

  const handleUpdateWrappingStyle = (index, newLabel, newPrice) => {
    if (!newLabel.trim()) return;
    const updated = [...wrappingStyles];
    updated[index].label = newLabel.trim();
    updated[index].price = Number(newPrice) || 0;
    setWrappingStyles(updated);
    setEditingWrapIndex(null);
    handleSaveWrappingStyles(updated);
  };

  useEffect(() => {
    if (navCategories) setLocalNavCategories(navCategories);
  }, [navCategories]);

  const handleToggleNavCategory = (index) => {
    const updated = [...localNavCategories];
    updated[index].visible = !updated[index].visible;
    setLocalNavCategories(updated);
  };

  const handleUpdateNavCategory = (index, newLabel, newCat) => {
    if (!newLabel.trim()) return;
    const updated = [...localNavCategories];
    updated[index].label = newLabel.trim();
    updated[index].category = newCat;
    setLocalNavCategories(updated);
    setEditingCategoryIndex(null);
  };

  const handleDeleteNavCategory = (index) => {
    const updated = [...localNavCategories];
    updated.splice(index, 1);
    setLocalNavCategories(updated);
  };

  const handleAddNavCategory = () => {
    if (!newCategoryLabel.trim()) return;
    const updated = [...localNavCategories, { label: newCategoryLabel.trim(), category: newCategoryType, visible: true }];
    setLocalNavCategories(updated);
    setNewCategoryLabel('');
  };

  const handleSaveNavCategories = async () => {
    await updateNavCategories(localNavCategories);
  };
  // ----------------------------------------

  // Modal control
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // null for "Add", product object for "Edit"

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '20',
    tags: '',
    luxuryTax: '8',
    courierHandling: '50'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCatalog();
    fetchConfigs();
  }, [fetchCatalog]);

  // Categories derived dynamically from Navigation Events
  const categories = navCategories && navCategories.length > 0 
    ? navCategories.map(cat => cat.label) 
    : [
        'Home & Living',
        'Stationery',
        'Fragrance',
        'Self Care',
        'Travel',
        'Technology',
        'Fine Wine & Spirits',
        'Soft Toys',
        'Traditional Gifts'
      ];

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

  // Filtering
  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      price: '',
      category: categories[0],
      description: '',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
      additionalImages: '',
      stock: '20',
      tags: 'premium, curated',
      luxuryTax: '8',
      courierHandling: '50'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      additionalImages: Array.isArray(product.additionalImages) ? product.additionalImages.join(', ') : '',
      stock: String(product.stock ?? 20),
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
      luxuryTax: String(product.luxuryTax ?? 8),
      courierHandling: String(product.courierHandling ?? 50)
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Please enter a valid price greater than 0';
    }
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.image.trim()) errors.image = 'Product image URL is required';
    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock, 10) < 0) {
      errors.stock = 'Stock must be 0 or higher';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
      
    const rawParts = (formData.additionalImages || '').split(',');
    const additionalImagesArray = [];
    for (let i = 0; i < rawParts.length; i++) {
      let part = rawParts[i].trim();
      if (part.startsWith('data:') && !part.includes('base64,') && i + 1 < rawParts.length) {
        part = part + ',' + rawParts[i + 1].trim();
        i++;
      }
      if (part) additionalImagesArray.push(part);
    }

    const productPayload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description.trim(),
      image: formData.image.trim(),
      additionalImages: additionalImagesArray.length > 0 ? additionalImagesArray : [],
      stock: parseInt(formData.stock, 10),
      tags: tagsArray,
      luxuryTax: parseFloat(formData.luxuryTax || 8),
      courierHandling: parseFloat(formData.courierHandling || 50)
    };

    try {
      if (currentProduct) {
        // Edit Mode
        await updateProduct({ ...productPayload, id: currentProduct.id });
        addToast(`Updated product "${formData.name}" successfully.`, 'success');
      } else {
        // Add Mode
        await addProduct(productPayload);
        addToast(`Added new product "${formData.name}" to the catalog.`, 'success');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      addToast('Error saving product.', 'error');
    }
  };

  const totalStock = catalog.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStockCount = catalog.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const outOfStockCount = catalog.filter((product) => Number(product.stock || 0) <= 0).length;

  const handleDeleteConfirm = async () => {
    if (!currentProduct) return;
    try {
      await deleteProduct(currentProduct.id);
      addToast(`Deleted product "${currentProduct.name}" from the catalog.`, 'success');
      setIsDeleteModalOpen(false);
    } catch (err) {
      addToast('Error deleting product.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontWeight: 800, 
              fontSize: '2rem',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}
          >
            Catalog Management
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Create, view, modify, and delete curated items in the active gift registry.
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary" icon={Plus}>
          Add Catalog Item
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <Card hoverable={false} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(32, 201, 151, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Units</p>
            <h3 style={{ fontSize: '1.4rem' }}>{totalStock}</h3>
          </div>
        </Card>
        <Card hoverable={false} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 196, 87, 0.08)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low Stock Items</p>
            <h3 style={{ fontSize: '1.4rem' }}>{lowStockCount}</h3>
          </div>
        </Card>
        <Card hoverable={false} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 94, 125, 0.08)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Out of Stock</p>
            <h3 style={{ fontSize: '1.4rem' }}>{outOfStockCount}</h3>
          </div>
        </Card>
      </div>

      {/* Delivery Settings Management */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Delivery & Logistics Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Configure fee splits, bulk order thresholds, and store location for courier auto-booking.</p>
          </div>
          <Button variant="primary" onClick={handleSaveDeliverySettings}>
            Save Settings
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Input 
            label="Admin Origin Address" 
            placeholder="e.g. 100 Main St, Mumbai" 
            value={deliverySettings.storeAddress} 
            onChange={(e) => setDeliverySettings({...deliverySettings, storeAddress: e.target.value})} 
            icon={MapPin}
          />
          <Input 
            label="Admin Fee Split (%)" 
            type="number"
            placeholder="e.g. 50" 
            value={deliverySettings.splitPercentage} 
            onChange={(e) => setDeliverySettings({...deliverySettings, splitPercentage: e.target.value})} 
            icon={Percent}
            title="Percentage of the delivery fee paid by the Admin for normal orders."
          />
          <Input 
            label="Bulk Order Threshold (₹)" 
            type="number"
            placeholder="e.g. 2000" 
            value={deliverySettings.bulkThreshold} 
            onChange={(e) => setDeliverySettings({...deliverySettings, bulkThreshold: e.target.value})} 
            icon={IndianRupee}
            title="Orders above this amount get free delivery for customers within 3km."
          />
          <Input 
            label="Standard Buffer Days" 
            type="number"
            placeholder="e.g. 1" 
            value={deliverySettings.bufferDays} 
            onChange={(e) => setDeliverySettings({...deliverySettings, bufferDays: e.target.value})} 
            icon={Clock}
            title="Days added to standard delivery for locations beyond 3km."
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
            <input 
              type="checkbox" 
              id="hideDeliveryToggle"
              checked={deliverySettings.hideDeliveryCharges}
              onChange={(e) => setDeliverySettings({...deliverySettings, hideDeliveryCharges: e.target.checked})}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="hideDeliveryToggle" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
              Hide Delivery Charges from Users (Show as ₹0)
            </label>
          </div>
        </div>
      </Card>

      {/* Navigation Events Management */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Navigation Events Management</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add, edit, delete, or toggle events in the main navigation bar.</p>
          </div>
          <Button variant="primary" onClick={handleSaveNavCategories}>
            Save Changes
          </Button>
        </div>

        {/* Add new event row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="New Event Label" 
              placeholder="e.g. Mother's Day" 
              value={newCategoryLabel} 
              onChange={(e) => setNewCategoryLabel(e.target.value)} 
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Select 
              label="Linked Category" 
              options={[{value: 'All', label: 'All'}, ...categoryOptions]} 
              value={newCategoryType} 
              onChange={(e) => setNewCategoryType(e.target.value)} 
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button variant="secondary" onClick={handleAddNavCategory} style={{ height: '42px', padding: '0 24px' }}>
            Add Event
          </Button>
        </div>

        {/* List of events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {localNavCategories.map((cat, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '12px' }}>
              {editingCategoryIndex === index ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    defaultValue={cat.label} 
                    id={`edit-label-${index}`}
                    style={{ flex: 1, minWidth: '150px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                  <select 
                    defaultValue={cat.category} 
                    id={`edit-cat-${index}`}
                    style={{ flex: 1, minWidth: '150px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  >
                    <option value="All">All</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Button variant="primary" onClick={() => handleUpdateNavCategory(index, document.getElementById(`edit-label-${index}`).value, document.getElementById(`edit-cat-${index}`).value)} style={{ padding: '8px 16px' }}>Save</Button>
                  <Button variant="glass" onClick={() => setEditingCategoryIndex(null)} style={{ padding: '8px 16px' }}>Cancel</Button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={cat.visible} 
                        onChange={() => handleToggleNavCategory(index)} 
                        style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: cat.visible ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {cat.label}
                      </span>
                    </label>
                    <Badge variant="info">{cat.category}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingCategoryIndex(index)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteNavCategory(index)} style={{ background: 'rgba(255,0,127,0.05)', border: '1px solid rgba(255,0,127,0.2)', borderRadius: '4px', color: 'var(--color-danger)', cursor: 'pointer', padding: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {localNavCategories.length === 0 && (
             <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No navigation events defined.</div>
          )}
        </div>
      </Card>

      {/* Wrapping Styles Management */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Wrapping Style Management</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add, edit, or delete custom wrapping styles and their prices.</p>
          </div>
        </div>

        {/* Add new wrapping style row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="Style Label" 
              placeholder="e.g. Premium Silk Furoshiki Wrap" 
              value={newWrapLabel} 
              onChange={(e) => setNewWrapLabel(e.target.value)} 
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="Price (₹)" 
              type="number"
              placeholder="e.g. 1200" 
              value={newWrapPrice} 
              onChange={(e) => setNewWrapPrice(e.target.value)} 
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button variant="secondary" onClick={handleAddWrappingStyle} style={{ height: '42px', padding: '0 24px' }}>
            Add Style
          </Button>
        </div>

        {/* List of wrapping styles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {wrappingStyles.map((wrap, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '12px' }}>
              {editingWrapIndex === index ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    defaultValue={wrap.label} 
                    id={`edit-wrap-label-${index}`}
                    style={{ flex: 1, minWidth: '150px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                  <input 
                    type="number" 
                    defaultValue={wrap.price} 
                    id={`edit-wrap-price-${index}`}
                    style={{ flex: 1, minWidth: '100px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                  <Button variant="primary" onClick={() => handleUpdateWrappingStyle(index, document.getElementById(`edit-wrap-label-${index}`).value, document.getElementById(`edit-wrap-price-${index}`).value)} style={{ padding: '8px 16px' }}>Save</Button>
                  <Button variant="glass" onClick={() => setEditingWrapIndex(null)} style={{ padding: '8px 16px' }}>Cancel</Button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {wrap.label}
                    </span>
                    <Badge variant="info">₹{wrap.price}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingWrapIndex(index)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteWrappingStyle(index)} style={{ background: 'rgba(255,0,127,0.05)', border: '1px solid rgba(255,0,127,0.2)', borderRadius: '4px', color: 'var(--color-danger)', cursor: 'pointer', padding: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {wrappingStyles.length === 0 && (
             <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No wrapping styles defined.</div>
          )}
        </div>
      </Card>

      {/* Filter and Search Panel */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <Input
              icon={Search}
              placeholder="Search product name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="custom-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                background: selectedCategory === 'All' 
                  ? 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(247, 37, 133, 0.05) 100%)' 
                  : 'rgba(255, 255, 255, 0.01)',
                border: '1px solid',
                borderColor: selectedCategory === 'All' ? 'var(--color-primary)' : 'var(--glass-border)',
                color: selectedCategory === 'All' ? 'var(--color-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedCategory === cat 
                    ? 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(247, 37, 133, 0.05) 100%)' 
                    : 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--glass-border)',
                  color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Catalog Listing Table / Roster Grid */}
      <Card hoverable={false} style={{ padding: '0px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Price</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Inventory</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCatalog.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlignment: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No products found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredCatalog.map((product) => (
                <tr 
                  key={product.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)', 
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Product Details */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        {(product.image?.includes('video/') || product.image?.match(/\.(mp4|webm)$/i)) ? (
                          <video src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                        ) : (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {product.category}
                  </td>
                  {/* Price */}
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{product.price}
                  </td>
                  {/* Availability */}
                  <td style={{ padding: '16px 20px' }}>
                    <Badge variant={product.availability === 'Low Stock' ? 'warning' : product.availability === 'Out of Stock' ? 'danger' : 'success'}>
                      {product.availability || 'In Stock'}
                    </Badge>
                    <span style={{ display: 'block', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {product.stock ?? 0} units
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openEditModal(product)}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(product)}
                        style={{
                          background: 'rgba(255, 0, 127, 0.05)',
                          border: '1px solid rgba(255, 0, 127, 0.2)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          color: 'var(--color-danger)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Product Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={currentProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <Input
            label="Product Name"
            placeholder="e.g. Baccarat Champagne Flutes"
            value={formData.name}
            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }); }}
            error={formErrors.name}
            icon={ClipboardList}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Price (INR)"
              type="number"
              placeholder="e.g. 250"
              value={formData.price}
              onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setFormErrors({ ...formErrors, price: '' }); }}
              error={formErrors.price}
              icon={IndianRupee}
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Select Category"
            />
          </div>

          <Input
            label="Stock Quantity"
            type="number"
            min="0"
            placeholder="e.g. 25"
            value={formData.stock}
            onChange={(e) => { setFormData({ ...formData, stock: e.target.value }); setFormErrors({ ...formErrors, stock: '' }); }}
            error={formErrors.stock}
            icon={Package}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Luxury Tax (%)"
              type="number"
              placeholder="e.g. 8"
              value={formData.luxuryTax}
              onChange={(e) => setFormData({ ...formData, luxuryTax: e.target.value })}
              icon={Percent}
            />

            <Input
              label="Courier & Handling (₹)"
              type="number"
              placeholder="e.g. 50"
              value={formData.courierHandling}
              onChange={(e) => setFormData({ ...formData, courierHandling: e.target.value })}
              icon={Truck}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Input
              label="Image URL or Upload"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setFormErrors({ ...formErrors, image: '' }); }}
              error={formErrors.image}
              icon={Image}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-title)' }}>Or upload from device:</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, image: reader.result });
                      setFormErrors({ ...formErrors, image: '' });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  cursor: 'pointer',
                  flex: 1
                }}
              />
            </div>
            
            <Input
              label="Additional Media URLs (Comma Separated, max 10, mp4 supported)"
              placeholder="https://...image2.jpg, https://...video.mp4"
              value={formData.additionalImages}
              onChange={(e) => setFormData({ ...formData, additionalImages: e.target.value })}
              icon={Image}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-title)' }}>Or upload from device:</span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length > 0) {
                    const readPromises = files.map(file => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                      });
                    });
                    
                    Promise.all(readPromises).then(results => {
                      const existingUrls = formData.additionalImages ? formData.additionalImages + ',' : '';
                      setFormData({ ...formData, additionalImages: existingUrls + results.join(',') });
                    });
                  }
                }}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  cursor: 'pointer',
                  flex: 1
                }}
              />
            </div>
          </div>

          <Input
            label="Product Tags (Comma Separated)"
            placeholder="e.g. celebration, luxury, premium"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            icon={Tag}
          />

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'var(--font-title)' }}>
              Product Description
            </label>
            <textarea
              className={`glass-input ${formErrors.description ? 'glass-input-error' : ''}`}
              rows={4}
              placeholder="Enter elegant marketing text and details for clients..."
              value={formData.description}
              onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setFormErrors({ ...formErrors, description: '' }); }}
              style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
            />
            {formErrors.description && (
              <span style={{ display: 'block', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-danger)' }}>{formErrors.description}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button type="button" onClick={() => setIsFormModalOpen(false)} variant="glass">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {currentProduct ? 'Save Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info color="var(--color-danger)" size={24} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
                Are you sure you want to delete this product?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                This will permanently remove <strong>{currentProduct?.name}</strong> from the curated catalog.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button onClick={() => setIsDeleteModalOpen(false)} variant="glass">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="danger">
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminCatalogPage;

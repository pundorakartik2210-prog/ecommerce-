import { useState, useEffect } from 'react';
import { initiateRazorpayPayment } from './utils/razorpay';
import { API_URL } from './config.js';
import { PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import PromoSlider from './components/PromoSlider';
import ProductGrid from './components/ProductGrid';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import OrderTracking from './components/OrderTracking';
import Footer from './components/Footer';
import PolicyModals from './components/PolicyModals';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';
import AdminPanel from './components/AdminPanel';
import QualityBenefits from './components/QualityBenefits';
import AboutUs from './components/AboutUs';

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('nuvera_products');
      const storedDeletedIds = localStorage.getItem('nuvera_deleted_product_ids');
      const deletedIds = storedDeletedIds ? JSON.parse(storedDeletedIds) : [];
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically sync product info from the static PRODUCTS array
        const synced = parsed.map(storedProd => {
          const match = PRODUCTS.find(p => p.id === storedProd.id);
          if (match) {
            return {
              ...storedProd,
              name: match.name,
              tagline: match.tagline,
              description: match.description,
              image: match.image,
              baseWeight: match.baseWeight,
              prices: match.prices,
              rating: match.rating,
              reviewsCount: match.reviewsCount,
              reviews: match.reviews
            };
          }
          return storedProd;
        });

        // Add any new products from the static PRODUCTS array that are not in localStorage AND not deleted
        const missing = PRODUCTS.filter(p => !parsed.some(sp => sp.id === p.id) && !deletedIds.includes(p.id));
        return [...synced, ...missing];
      }
      return PRODUCTS.filter(p => !deletedIds.includes(p.id));
    } catch {
      return PRODUCTS;
    }
  });

  // Recycle Bin state for soft-deleted products
  const [deletedProducts, setDeletedProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('nuvera_deleted_products');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nuvera_deleted_products', JSON.stringify(deletedProducts));
  }, [deletedProducts]);

  // Track all deleted product IDs (both soft and permanently deleted)
  // to prevent them from being restored from static PRODUCTS array on page refresh
  const [deletedProductIds, setDeletedProductIds] = useState(() => {
    try {
      const stored = localStorage.getItem('nuvera_deleted_product_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nuvera_deleted_product_ids', JSON.stringify(deletedProductIds));
  }, [deletedProductIds]);

  // Load products from backend and merge/fallback to local/static state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Respect frontend soft-delete state
            const activeProducts = data.filter(p => !deletedProductIds.includes(p.id));
            setProducts(activeProducts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
      }
    };
    fetchProducts();
  }, [deletedProductIds]);

  // Admin panel visibility
  const [showAdmin, setShowAdmin] = useState(false);

  // Persist products whenever they change
  useEffect(() => {
    localStorage.setItem('nuvera_products', JSON.stringify(products));
  }, [products]);

  // Product CRUD handlers (used by AdminPanel)
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(prev => [...prev, data.product]);
        }
      } else {
        // Fallback to local state if backend API is not responding/fails
        setProducts(prev => [...prev, newProduct]);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setProducts(prev => [...prev, newProduct]);
    }
  };
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p));
        }
      } else {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }
  };
  const handleDeleteProduct = async (productId) => {
    const productToDelete = products.find(p => p.id === productId);
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setDeletedProducts(prev => {
        if (prev.some(p => p.id === productId)) return prev;
        return [...prev, productToDelete];
      });
      setDeletedProductIds(prev => {
        if (prev.includes(productId)) return prev;
        return [...prev, productId];
      });

      try {
        await fetch(`${API_URL}/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        });
      } catch (err) {
        console.error("Error soft-deleting product from backend:", err);
      }
    }
  };
  const handleRestoreProduct = async (productId) => {
    const productToRestore = deletedProducts.find(p => p.id === productId);
    if (productToRestore) {
      setDeletedProducts(prev => prev.filter(p => p.id !== productId));
      setDeletedProductIds(prev => prev.filter(id => id !== productId));
      setProducts(prev => {
        if (prev.some(p => p.id === productId)) return prev;
        return [...prev, productToRestore];
      });

      try {
        await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(productToRestore)
        });
      } catch (err) {
        console.error("Error restoring product to backend:", err);
      }
    }
  };
  const handlePermanentlyDeleteProduct = async (productId) => {
    setDeletedProducts(prev => prev.filter(p => p.id !== productId));
    setDeletedProductIds(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });

    try {
      await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (err) {
      console.error("Error permanently deleting product from backend:", err);
    }
  };

  // User Authentication State
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nuvera_active_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }); // { email, name }
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Drawer/Modal Visibility States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState("store"); // "store" | "cart" | "wishlist" | "tracking"
  const [activePolicy, setActivePolicy] = useState(null); // 'about' | 'contact' | 'privacy' | 'return' | null

  // sessionOrders tracks orders placed by the current user — persisted to localStorage
  const [sessionOrders, setSessionOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('nuvera_session_orders');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [globalVerifying, setGlobalVerifying] = useState(false);
  const [globalVerifyError, setGlobalVerifyError] = useState("");
  const [globalVerifySuccess, setGlobalVerifySuccess] = useState("");
  const [autoTrackOrderId, setAutoTrackOrderId] = useState(null);

  // Persist session orders whenever they change
  useEffect(() => {
    localStorage.setItem('nuvera_session_orders', JSON.stringify(sessionOrders));
  }, [sessionOrders]);

  // Fetch logged-in user's past orders from database to ensure tracking sync
  useEffect(() => {
    if (user && user.email) {
      const fetchUserOrders = async () => {
        try {
          const res = await fetch(`${API_URL}/api/orders/user/${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setSessionOrders(prev => {
                const updated = { ...prev };
                data.forEach(order => {
                  updated[order.id] = {
                    orderId: order.id,
                    customer: order.name,
                    email: order.email,
                    date: order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                    total: parseFloat(order.total),
                    statusStep: order.statusStep || 0,
                    items: Array.isArray(order.cart) ? order.cart.map(item => ({
                      name: item.name,
                      selectedWeight: item.selectedWeight || '1kg',
                      quantity: item.quantity || 1,
                      price: item.price || 0
                    })) : []
                  };
                });
                return updated;
              });
            }
          }
        } catch (err) {
          console.error("Error fetching user orders from backend:", err);
        }
      };
      fetchUserOrders();
    }
  }, [user]);

  const handleDeleteSessionOrder = (orderId) => {
    setSessionOrders(prev => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  // Listen for order verification links in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const confirmOrder = params.get('confirm_order');
    const orderId = params.get('order_id');
    const code = params.get('code');

    if (confirmOrder === '1' && orderId && code) {
      setGlobalVerifying(true);
      setGlobalVerifyError('');
      setGlobalVerifySuccess('');

      // Step 1: Verify the email confirmation link
      fetch(`${API_URL}/api/orders/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ orderId, code }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (!data.success) {
            setGlobalVerifyError(data.message || 'Failed to verify order.');
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }

          // Step 2: Order verified — now collect payment via Razorpay
          const verifiedOrder = data.order;
          setGlobalVerifySuccess('Order confirmed! Launching secure payment...');

          try {
            await initiateRazorpayPayment({
              orderId: verifiedOrder.orderId,
              amount: verifiedOrder.total,
              name: verifiedOrder.name,
              email: verifiedOrder.email,
            });

            // Step 3: Payment successful — commit the order
            const trackingOrder = {
              orderId: verifiedOrder.orderId,
              customer: verifiedOrder.name,
              email: verifiedOrder.email,
              date: verifiedOrder.date,
              total: verifiedOrder.total,
              statusStep: 0,
              items: verifiedOrder.cart.map((item) => ({
                name: item.name,
                selectedWeight: item.selectedWeight,
                quantity: item.quantity,
                price: item.prices[item.selectedWeight],
              })),
            };

            setSessionOrders((prev) => ({ ...prev, [orderId]: trackingOrder }));
            window.history.replaceState({}, document.title, window.location.pathname);

            setGlobalVerifySuccess(`Payment successful! Order ${orderId} placed. Redirecting...`);
            setTimeout(() => {
              setCart([]);
              setAutoTrackOrderId(orderId);
              setCurrentPage('tracking');
              setGlobalVerifying(false);
              setGlobalVerifySuccess('');
            }, 2000);
          } catch (payErr) {
            // Payment was cancelled or failed — do NOT place the order
            setGlobalVerifyError(
              payErr.message || 'Payment failed. Your order has NOT been placed.'
            );
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch(() => {
          setGlobalVerifyError('Connection error. Could not verify your order link.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  // Sync user state changes to localStorage and redirect admin
  useEffect(() => {
    if (user) {
      localStorage.setItem("nuvera_active_user", JSON.stringify(user));
      if (user.email === 'nuvera@gmail.com') {
        setShowAdmin(true);
      }
    } else {
      localStorage.removeItem("nuvera_active_user");
      setShowAdmin(false);
    }
  }, [user]);

  // Dynamic Tab Titles for SPA SEO Optimization & Automatic Page Scroll-to-Top
  useEffect(() => {
    window.scrollTo(0, 0);
    switch (currentPage) {
      case "store":
        document.title = "nuvera natural | Premium Organic Slow-Roasted Peanut Butter";
        break;
      case "cart":
        document.title = "Shopping Cart | nuvera natural Premium Spread Store";
        break;
      case "wishlist":
        document.title = "My Wishlist Favorites | nuvera natural Organic Jars";
        break;
      case "tracking":
        document.title = "Shipment Tracking & Status | nuvera natural Dispatch";
        break;
      case "about":
        document.title = "About Our Safety Standards & Sourcing | nuvera natural";
        break;
      default:
        document.title = "nuvera natural | Premium Organic Peanut Butter";
    }
  }, [currentPage]);

  // 1. Search filter callback
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      setCurrentPage("store");
      setActiveCategory("all");
    }
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  const handleAdminPortalClick = () => {
    if (user?.email === 'nuvera@gmail.com') {
      setShowAdmin(true);
    } else {
      setIsSignInOpen(true);
    }
  };

  // 2. Add to Cart Handler
  const handleAddToCart = (product, weight = null) => {
    const selectedWeight = (weight || product.baseWeight || "250g").replace(/\s+/g, '');
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === product.id && item.selectedWeight.replace(/\s+/g, '') === selectedWeight);
      if (existingIdx > -1) {
        return prevCart.map((item, idx) => {
          if (idx === existingIdx) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        return [...prevCart, { ...product, selectedWeight: selectedWeight, quantity: 1 }];
      }
    });
  };

  // 3. Update Cart Item Quantity
  const handleUpdateCartQuantity = (id, weight, delta) => {
    const cleanWeight = weight.replace(/\s+/g, '');
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === id && item.selectedWeight.replace(/\s+/g, '') === cleanWeight);
      if (existingIdx > -1) {
        const newQty = prevCart[existingIdx].quantity + delta;
        if (newQty <= 0) {
          return prevCart.filter((_, i) => i !== existingIdx);
        } else {
          return prevCart.map((item, idx) => {
            if (idx === existingIdx) {
              return { ...item, quantity: newQty };
            }
            return item;
          });
        }
      }
      return prevCart;
    });
  };

  // 4. Remove Item from Cart
  const handleRemoveCartItem = (id, weight) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.selectedWeight === weight)));
  };

  // 5. Toggle item in Wishlist
  const handleWishlistToggle = (product) => {
    setWishlist(prevList => {
      const isAlreadySaved = prevList.some(item => item.id === product.id);
      if (isAlreadySaved) {
        return prevList.filter(item => item.id !== product.id);
      } else {
        return [...prevList, product];
      }
    });
  };

  // 6. Move from Wishlist directly to Cart
  const handleMoveWishlistToCart = (product) => {
    // Add to cart with baseWeight
    handleAddToCart(product, product.baseWeight);
    // Remove from wishlist
    setWishlist(prevList => prevList.filter(item => item.id !== product.id));
  };

  // 7. Successful simulated Checkout callback
  const handleCheckoutComplete = (orderId, checkoutItems, total) => {
    const trackingOrder = {
      orderId: orderId,
      customer: user ? user.name : "Online Customer",
      email: user ? user.email : "customer@nuvera.com",
      date: new Date().toISOString().split('T')[0],
      total: total,
      statusStep: 0, // Starts at 'Ordered'
      items: checkoutItems.map(item => ({
        name: item.name,
        selectedWeight: item.selectedWeight,
        quantity: item.quantity,
        // Safe fallback: use price directly if prices map is missing
        price: (item.prices && item.prices[item.selectedWeight]) || item.price || 0
      }))
    };

    // Store in persistent session tracker
    setSessionOrders(prev => ({
      ...prev,
      [orderId]: trackingOrder
    }));

    // Clear shopping cart
    setCart([]);
  };

  // 8. Total counts for Navbar badges & sticky summary
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.prices[item.selectedWeight] * item.quantity), 0);

  // 9. Filter the database by Search Query
  const filteredProductsBySearch = products.filter(prod => {
    const matchesSearch = searchQuery.trim() === "" ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="app-container">

      {/* 1. Header/Navbar */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onStoreClick={() => { setActivePolicy(null); setCurrentPage("store"); }}
        onCartClick={() => { setActivePolicy(null); setCurrentPage("cart"); }}
        onWishlistClick={() => { setActivePolicy(null); setCurrentPage("wishlist"); }}
        onTrackingClick={() => { setActivePolicy(null); setAutoTrackOrderId(null); setCurrentPage("tracking"); }}
        onAboutClick={() => { setActivePolicy(null); setCurrentPage("about"); }}
        onAdminClick={handleAdminPortalClick}
        activeTab={currentPage}
        onSearch={handleSearch}
        onLogoClick={handleResetSearch}
        user={user}
        onLoginClick={() => setIsSignInOpen(true)}
        onSignUpClick={() => setIsSignUpOpen(true)}
        onLogout={() => setUser(null)}
      />

      <div className="main-content">
        <div className="app-body-container container">

          {/* Right Main Dynamic Content Area */}
          <div className="main-content-wrapper">

            {currentPage === 'store' && (
              <>

                {/* Carousel Banner Promos */}
                <PromoSlider 
                  products={products}
                  onShopNow={() => {
                    const el = document.getElementById("products-catalog");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                />

                {/* Quality Standards and Benefits Section */}
                <QualityBenefits />

                {/* Main Product Catalog */}
                <ProductGrid
                  products={filteredProductsBySearch}
                  wishlist={wishlist}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  onProductClick={(prod) => setSelectedProduct(prod)}
                  activeCategory={activeCategory}
                  onResetSearch={handleResetSearch}
                  cart={cart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                />
              </>
            )}

            {currentPage === 'cart' && (
              <CartPage
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onCheckoutComplete={handleCheckoutComplete}
                user={user}
                onLoginPrompt={() => setIsSignInOpen(true)}
                onContinueShopping={() => setCurrentPage('store')}
                onTrackOrder={(orderId) => {
                  setAutoTrackOrderId(orderId);
                  setCurrentPage('tracking');
                }}
              />
            )}

            {currentPage === 'wishlist' && (
              <WishlistPage
                wishlist={wishlist}
                onRemoveItem={handleWishlistToggle}
                onMoveToCart={handleMoveWishlistToCart}
                onContinueShopping={() => setCurrentPage('store')}
                onProductClick={(prod) => setSelectedProduct(prod)}
              />
            )}

            {currentPage === 'tracking' && (
              <OrderTracking
                sessionOrders={sessionOrders}
                autoTrackOrderId={autoTrackOrderId}
                onClearAutoTrack={() => setAutoTrackOrderId(null)}
              />
            )}

            {currentPage === 'about' && (
              <AboutUs />
            )}

          </div>

        </div>
      </div>

      {/* 4. Footer links */}
      <Footer
        products={products}
        onPolicyClick={(policyType) => setActivePolicy(policyType)}
        onTrackClick={() => { setAutoTrackOrderId(null); setCurrentPage("tracking"); }}
        onAboutClick={() => { setActivePolicy(null); setCurrentPage("about"); }}
      />

      {/* --- MODALS OVERLAYS --- */}

      {/* Product Nutritional Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
          isWishlisted={wishlist.some(item => item.id === selectedProduct.id)}
          cart={cart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onViewCart={() => {
            setSelectedProduct(null);
            setCurrentPage("cart");
          }}
        />
      )}

      {/* Policy and About Modals Overlay */}
      {activePolicy && (
        <PolicyModals
          activePolicy={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onLoginSuccess={(userProfile) => {
          setUser(userProfile);
          setIsSignInOpen(false);
        }}
        onSwitchToSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onLoginSuccess={(userProfile) => {
          setUser(userProfile);
          setIsSignUpOpen(false);
        }}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />

      {/* Sticky Bottom View Cart Bar */}
      {currentPage === 'store' && cartCount > 0 && (
        <div className="sticky-cart-bar">
          <div className="sticky-cart-container container">
            <div className="sticky-cart-info">
              <div className="sticky-cart-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="sticky-cart-badge">{cartCount}</span>
              </div>
              <div className="sticky-cart-details">
                <span className="sticky-cart-count">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
                <span className="sticky-cart-total">Total: ₹{totalCartPrice}</span>
              </div>
            </div>
            <button className="sticky-cart-btn" onClick={() => setCurrentPage("cart")}>
              <span>View Cart</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {globalVerifying && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(92, 58, 33, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          color: 'var(--brand-primary)'
        }}>
          <div style={{
            background: 'var(--bg-white)',
            padding: '40px 32px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
            maxWidth: '440px',
            width: '90%',
            borderTop: '5px solid var(--brand-accent)'
          }}>
            {globalVerifyError ? (
              <>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(234, 67, 53, 0.1)',
                  border: '2px solid rgba(234, 67, 53, 0.3)',
                  color: 'var(--error)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--error)', fontSize: '20px', margin: '0 0 8px 0' }}>Verification Failed</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.4' }}>{globalVerifyError}</p>
                <button
                  onClick={() => setGlobalVerifying(false)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--brand-primary)',
                    color: 'var(--bg-white)',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Return to Store
                </button>
              </>
            ) : globalVerifySuccess ? (
              <>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '2px solid rgba(40, 167, 69, 0.3)',
                  color: 'var(--success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '20px', margin: '0 0 8px 0' }}>Order Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{globalVerifySuccess}</p>
              </>
            ) : (
              <>
                <div className="success-icon-badge" style={{ margin: '0 auto 20px', width: '56px', height: '56px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin" style={{ color: 'var(--brand-accent)' }}>
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '20px', margin: '0 0 8px 0' }}>Verifying Confirmation Link</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Please hold on while we secure and place your order...</p>
              </>
            )}
          </div>
        </div>
      )}



      {/* Admin Panel Command Center overlay */}
      {showAdmin && (
        <AdminPanel
          products={products}
          deletedProducts={deletedProducts}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onRestoreProduct={handleRestoreProduct}
          onPermanentlyDeleteProduct={handlePermanentlyDeleteProduct}
          onDeleteSessionOrder={handleDeleteSessionOrder}
          onClose={() => setShowAdmin(false)}
          sessionOrders={sessionOrders}
          onLogout={() => setUser(null)}
        />
      )}

    </div>
  );
}

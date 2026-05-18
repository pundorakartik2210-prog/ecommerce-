import { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import PromoSlider from './components/PromoSlider';
import ProductGrid from './components/ProductGrid';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import OrderTracking from './components/OrderTracking';
import Footer from './components/Footer';
import PolicyModals from './components/PolicyModals';
import LoginModal from './components/LoginModal';
import SidebarPanel from './components/SidebarPanel';

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // User Authentication State
  const [user, setUser] = useState(null); // { email, name }
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Drawer/Modal Visibility States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState("store"); // "store" | "cart" | "wishlist" | "tracking"
  const [activePolicy, setActivePolicy] = useState(null); // 'about' | 'contact' | 'privacy' | 'return' | null

  // sessionOrders tracks mock orders created in this active user session
  const [sessionOrders, setSessionOrders] = useState({});

  // Dynamic Tab Titles for SPA SEO Optimization
  useEffect(() => {
    switch (currentPage) {
      case "store":
        document.title = "Nuvera Naturals | Premium Organic Slow-Roasted Peanut Butter";
        break;
      case "cart":
        document.title = "Shopping Cart | Nuvera Naturals Premium Spread Store";
        break;
      case "wishlist":
        document.title = "My Wishlist Favorites | Nuvera Naturals Organic Jars";
        break;
      case "tracking":
        document.title = "Shipment Tracking & Status | Nuvera Naturals Dispatch";
        break;
      default:
        document.title = "Nuvera Naturals | Premium Organic Peanut Butter";
    }
  }, [currentPage]);

  // 1. Search filter callback
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  // 2. Add to Cart Handler
  const handleAddToCart = (product, weight = "500g") => {
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === product.id && item.selectedWeight === weight);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, selectedWeight: weight, quantity: 1 }];
      }
    });
    
    // Route to shopping cart page for immediate premium visual feedback!
    setCurrentPage("cart");
  };

  // 3. Update Cart Item Quantity
  const handleUpdateCartQuantity = (id, weight, delta) => {
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === id && item.selectedWeight === weight);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIdx].quantity + delta;
        if (newQty <= 0) {
          return newCart.filter((_, i) => i !== existingIdx);
        } else {
          newCart[existingIdx].quantity = newQty;
          return newCart;
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
      date: new Date().toISOString().split('T')[0],
      total: total,
      statusStep: 0, // Starts at 'Ordered'
      items: checkoutItems.map(item => ({
        name: item.name,
        selectedWeight: item.selectedWeight,
        quantity: item.quantity,
        price: item.prices[item.selectedWeight]
      }))
    };

    // Store in session tracker
    setSessionOrders(prev => ({
      ...prev,
      [orderId]: trackingOrder
    }));

    // Clear shopping cart
    setCart([]);
  };

  // 8. Total counts for Navbar badges
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // 9. Filter the database by Search Query
  const filteredProductsBySearch = PRODUCTS.filter(prod => {
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
        onCartClick={() => setCurrentPage("cart")}
        onWishlistClick={() => setCurrentPage("wishlist")}
        onTrackingClick={() => setCurrentPage("tracking")}
        onSearch={handleSearch}
        onLogoClick={handleResetSearch}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={() => setUser(null)}
      />

      <div className="main-content">
        <div className="app-body-container container">
          
          {/* Flipkart-Style Sticky Left Navigation Sidebar */}
          <SidebarPanel 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            user={user}
          />

          {/* Right Main Dynamic Content Area */}
          <div className="main-content-wrapper">
            
            {currentPage === 'store' && (
              <>
                {/* 2. Category selection */}
                <CategoryBar 
                  activeCategory={activeCategory}
                  onCategoryChange={(catId) => { setActiveCategory(catId); }}
                />

                {/* Carousel Banner Promos */}
                <PromoSlider onShopNow={() => {
                  const el = document.getElementById("products-catalog");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} />

                {/* Main Product Catalog */}
                <ProductGrid 
                  products={filteredProductsBySearch}
                  wishlist={wishlist}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  onProductClick={(prod) => setSelectedProduct(prod)}
                  activeCategory={activeCategory}
                  onResetSearch={handleResetSearch}
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
                onLoginPrompt={() => setIsLoginOpen(true)}
                onContinueShopping={() => setCurrentPage('store')}
              />
            )}

            {currentPage === 'wishlist' && (
              <WishlistPage 
                wishlist={wishlist}
                onRemoveItem={handleWishlistToggle}
                onMoveToCart={handleMoveWishlistToCart}
                onContinueShopping={() => setCurrentPage('store')}
              />
            )}

            {currentPage === 'tracking' && (
              <OrderTracking 
                sessionOrders={sessionOrders}
              />
            )}

          </div>

        </div>
      </div>

      {/* 4. Footer links */}
      <Footer 
        onPolicyClick={(policyType) => setActivePolicy(policyType)}
        onTrackClick={() => setCurrentPage("tracking")}
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
        />
      )}

      {/* Policy and About Modals Overlay */}
      {activePolicy && (
        <PolicyModals 
          activePolicy={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

      {/* Secure Auth Modal Overlay */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userProfile) => {
          setUser(userProfile);
          setIsLoginOpen(false);
        }}
      />

    </div>
  );
}

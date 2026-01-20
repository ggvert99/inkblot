import { useState } from 'react';

interface Props {
  variantId: string;
  buttonText?: string;
  className?: string;
}

const CART_ID_KEY = 'inkblot_cart_id';

export default function AddToCart({ 
  variantId, 
  buttonText = 'Add to Cart',
  className = '' 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddToCart() {
    setLoading(true);
    setError(null);
    
    try {
      const existingCartId = localStorage.getItem(CART_ID_KEY);
      
      let response;
      
      if (existingCartId) {
        // Add to existing cart
        response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cartId: existingCartId,
            variantId, 
            quantity: 1 
          }),
        });
      } else {
        // Create new cart
        response = await fetch('/api/cart/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId, quantity: 1 }),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      const { cart } = await response.json();
      
      // Save cart ID for future requests
      localStorage.setItem(CART_ID_KEY, cart.id);
      
      // Redirect to Shopify checkout
      window.location.href = cart.checkoutUrl;
      
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button 
        onClick={handleAddToCart} 
        disabled={loading}
        className="btn btn-primary btn-full"
      >
        {loading ? (
          <span className="btn-loading">
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                strokeDasharray="31.4" 
                strokeDashoffset="10"
              />
            </svg>
          </span>
        ) : (
          <span className="btn-text">{buttonText}</span>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

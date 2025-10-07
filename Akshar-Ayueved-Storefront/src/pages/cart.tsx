import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Card, Badge } from '@components/ui';
import { useCartWithSync, useUpdateLineItem, useDeleteLineItem } from '@hooks/cart';
import { convertToLocale } from '@lib/util/money';
import Breadcrumb from '@components/about/Breadcrumb';
import CartTable from '@components/cart/CartTable';
import CartTotals from '@components/cart/CartTotals';
import CouponCode from '@components/cart/CouponCode';

export default function Cart() {
  const router = useRouter();
  
  // Use the synchronized cart hook - enable cart fetching even without country code
  const { data: cart, isLoading: cartLoading, error: cartError } = useCartWithSync({
    enabled: true // Always enable cart fetching
  });

  const itemsSubtotal = cart && cart.items && Array.isArray(cart.items)
    ? cart.items.reduce((sum, item) => sum + ((item.unit_price || 0) * (item.quantity || 0)), 0)
    : 0;
  
  const updateLineItemMutation = useUpdateLineItem();
  const deleteLineItemMutation = useDeleteLineItem();

  React.useEffect(() => {
    router.prefetch('/checkout').catch(() => {});
  }, [router]);

  // Cart count is automatically updated by useCartWithSync hook

  const updateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Prevent multiple rapid clicks
    if (updateLineItemMutation.isPending) return;

    try {
      await updateLineItemMutation.mutateAsync({ lineId, quantity: newQuantity });
    } catch {
    }
  };

  const removeItem = async (lineId: string) => {
    try {
      await deleteLineItemMutation.mutateAsync({ lineId });
    } catch {
    }
  };

  const handleCheckout = () => {
    if (cart?.id && cart.items && cart.items.length > 0) {
      // Validate that all items have valid pricing
      const hasValidItems = cart.items.every(item => {
        const variant = item.variant;
        return variant?.calculated_price?.calculated_amount && variant.calculated_price.calculated_amount > 0;
      });

      if (hasValidItems) {
        router.push('/checkout');
      } else {
        // Show error if some items don't have valid pricing
        alert('Some items in your cart have invalid pricing. Please refresh the page and try again.');
      }
    } else {
      alert('Please add items to your cart before proceeding to checkout.');
    }
  };

  // Show loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-green-600 mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading your cart...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <svg className="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading cart</h2>
            <p className="text-gray-600 mb-8">Something went wrong while loading your cart. Please try again.</p>
            <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        {/* Breadcrumb Section */}
        <Breadcrumb 
          title="Cart"
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Cart' }
          ]}
          imageSrc="/assets/images/bredcrumb-bg.jpg"
        />
        
        <div className="h-auto bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Shopping Cart Icon */}
              <div className="mb-2">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E7E4D1] to-[#D8BFA3] rounded-full mb-6 shadow-lg border-4 border-white/50">
                  <svg className="w-10 h-10 text-[#878E4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                Start your wellness journey with our premium Ayurvedic products. 
                Add items to your cart and experience the benefits of natural healing!
              </p>

              {/* Call to Action */}
              <div className="space-y-4">
                <Link href="/products">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="hover:from-[#676E3F] hover:to-[#B89F73] text-gray-800  px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Start Shopping Now
                  </Button>
                </Link>
                
                <div className="text-sm text-gray-500">
                  <p>Explore our curated collection of authentic Ayurvedic products</p>
                </div>
              </div>

              {/* Popular Categories */}
              {/* <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Herbal Supplements', icon: '🌿', href: '/products?category=supplements' },
                    { name: 'Skincare', icon: '✨', href: '/products?category=skincare' },
                    { name: 'Wellness', icon: '🧘', href: '/products?category=wellness' },
                    { name: 'Personal Care', icon: '🛁', href: '/products?category=personal-care' }
                  ].map((category, index) => (
                    <Link key={index} href={category.href}>
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 hover:bg-white/80 transition-all duration-300 cursor-pointer group">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div> */}

              {/* Benefits Section */}
              {/* <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Why Choose Ayurvedic Products?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">100% Natural</h4>
                    <p className="text-gray-600 text-sm">Pure herbal ingredients with no harmful chemicals</p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Fast Delivery</h4>
                    <p className="text-gray-600 text-sm">Quick and secure shipping to your doorstep</p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Expert Care</h4>
                    <p className="text-gray-600 text-sm">Curated by Ayurvedic practitioners and experts</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <Breadcrumb 
        title="Cart"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart' }
        ]}
        imageSrc="/assets/images/bredcrumb-bg.jpg"
      />

      {/* Cart Page Section */}
      <div className="py-[90px]">
        <div className="max-w-[1200px] mx-auto px-[15px]">
          <div className="w-full">
            {/* Cart Table */}
            <CartTable
              items={cart.items || []}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              isUpdating={updateLineItemMutation.isPending}
            />
             <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
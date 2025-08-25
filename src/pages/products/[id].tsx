import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Badge, Product360View } from '@/components/ui';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Ashwagandha Churna - Natural Stress Relief',
    description: 'Traditional Ayurvedic powder for stress relief and energy boost.',
    detailedDescription: 'Ashwagandha (Withania somnifera) is a powerful adaptogenic herb that has been used in Ayurvedic medicine for over 3,000 years. Known as "Indian Winter Cherry" or "Indian Ginseng," this remarkable herb helps the body manage stress, boost energy levels, and promote overall well-being.',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1609501676725-7186f734d4ca?w=600&h=600&fit=crop',
    ],
    images360: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=100',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=95',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=90',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=85',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=75',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=70',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=65',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=60',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=55',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=50',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=45',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=40',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=35',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=30',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=25',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=20',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=15',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=10',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=5',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=0&brightness=0',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=10&brightness=5',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=10&brightness=10',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&sat=10&brightness=15',
    ],
    category: 'health-care-energy-booster',
    categoryName: 'Health Care & Energy Booster',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    weight: '100g',
    ingredients: ['Pure Ashwagandha Root Powder (Withania somnifera)', 'No artificial additives', 'No preservatives', 'No chemicals'],
    benefits: [
      'Reduces stress and anxiety levels',
      'Boosts energy and stamina naturally',
      'Improves sleep quality',
      'Enhances immune system function',
      'Supports healthy cortisol levels',
      'Promotes muscle strength and recovery',
      'Improves cognitive function and memory',
      'Balances hormones naturally'
    ],
    usage: 'Take 1-2 teaspoons (3-6g) twice daily with warm water or milk, preferably after meals. For best results, use consistently for 2-3 months.',
    dosage: '3-6g (1-2 teaspoons) twice daily',
    precautions: [
      'Consult your healthcare provider before use if pregnant or nursing',
      'Not recommended for children under 12 years',
      'May interact with certain medications',
      'Discontinue use if any adverse reactions occur'
    ],
    certifications: ['Organic Certified', 'FSSAI Approved', 'GMP Certified', 'Lab Tested'],
    shelfLife: '24 months from manufacturing date',
    storage: 'Store in a cool, dry place away from direct sunlight',
    origin: 'Sourced from organic farms in Rajasthan, India',
  },
  {
    id: '2',
    name: 'Triphala Churna - Digestive Health',
    description: 'Three-fruit blend for digestive health and detoxification',
    detailedDescription: 'Triphala is a traditional Ayurvedic formulation combining three powerful fruits: Amalaki (Emblica officinalis), Bibhitaki (Terminalia bellirica), and Haritaki (Terminalia chebula). This time-tested formula supports digestive health, natural detoxification, and overall wellness.',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1609501676725-7186f734d4ca?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=600&fit=crop',
    ],
    images360: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=100',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=95',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=90',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=85',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=75',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=70',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=65',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=60',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=55',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=50',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=45',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=40',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=35',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=30',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=25',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=20',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=15',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=10',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=5',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=0&brightness=0',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=10&brightness=5',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=10&brightness=10',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&sat=10&brightness=15',
    ],
    category: 'natural-antacid',
    categoryName: 'Natural Antacid',
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    weight: '100g',
    ingredients: ['Amalaki (Emblica officinalis)', 'Bibhitaki (Terminalia bellirica)', 'Haritaki (Terminalia chebula)', 'Equal proportions of each fruit'],
    benefits: [
      'Supports healthy digestion',
      'Natural detoxification of the body',
      'Promotes regular bowel movements',
      'Rich in Vitamin C and antioxidants',
      'Supports immune system health',
      'Helps maintain healthy cholesterol levels',
      'Promotes healthy skin and hair',
      'Supports eye health'
    ],
    usage: 'Take 1 teaspoon (3g) with warm water before bedtime or as directed by your healthcare practitioner.',
    dosage: '3g (1 teaspoon) once daily',
    precautions: [
      'Start with a smaller dose and gradually increase',
      'Consult healthcare provider if pregnant or nursing',
      'May cause loose stools initially - this is normal',
      'Keep away from children'
    ],
    certifications: ['Organic Certified', 'FSSAI Approved', 'GMP Certified', 'Lab Tested'],
    shelfLife: '24 months from manufacturing date',
    storage: 'Store in a cool, dry place in an airtight container',
    origin: 'Sourced from organic farms across India',
  },
];

export default function ProductPage({ product }: { product: typeof mockProducts[0] }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [is360ViewActive, setIs360ViewActive] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert(`Added ${quantity} items to cart!`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button variant="primary" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-green-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-green-600">Products</Link></li>
            <li>/</li>
            <li><Link href={`/products/category/${product.category}`} className="hover:text-green-600">{product.categoryName}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div>
            {/* View Toggle Buttons */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setIs360ViewActive(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !is360ViewActive
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📷 Gallery View
              </button>
              {product.images360 && product.images360.length > 0 && (
                <button
                  onClick={() => setIs360ViewActive(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    is360ViewActive
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔄 360° View
                </button>
              )}
            </div>

            {/* Main Image or 360° View */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
              {is360ViewActive && product.images360 ? (
                <Product360View
                  images={product.images360}
                  productName={product.name}
                  className="w-full h-full"
                  autoRotate={false}
                />
              ) : (
                <>
                  <Image
                    src={product.images?.[activeImageIndex] || product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {discountPercentage > 0 && (
                    <Badge variant="danger" size="lg" className="absolute top-4 left-4">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.certifications && (
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      {product.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="success" size="sm">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Thumbnail Images - Only show in gallery view */}
            {!is360ViewActive && product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 360° View Info */}
            {is360ViewActive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-sm">360° Interactive View</p>
                    <p className="text-xs text-green-600">Drag to rotate • Click controls to navigate • Auto-rotate available</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge variant="secondary" size="sm" className="mb-2">
              {product.categoryName}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-4">{product.description}</p>
            
            {/* Key Features */}
            {product.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.benefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Info */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span className="text-gray-600 ml-2">{product.weight}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Origin:</span>
                  <span className="text-gray-600 ml-2">India</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Shelf Life:</span>
                  <span className="text-gray-600 ml-2">{product.shelfLife}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Form:</span>
                  <span className="text-gray-600 ml-2">Powder</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                fullWidth
              >
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => alert('Added to favorites!')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">100% Authentic</p>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">Free Shipping</p>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'ingredients', 'usage', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'description' && 'Product Details'}
                  {tab === 'ingredients' && 'Ingredients & Benefits'}
                  {tab === 'usage' && 'Usage & Dosage'}
                  {tab === 'reviews' && 'Customer Reviews'}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Product Details Tab */}
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About {product.name}</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">{product.detailedDescription}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h4>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Weight</dt>
                          <dd className="font-medium text-gray-900">{product.weight}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Form</dt>
                          <dd className="font-medium text-gray-900">Powder</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Shelf Life</dt>
                          <dd className="font-medium text-gray-900">{product.shelfLife}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Origin</dt>
                          <dd className="font-medium text-gray-900">{product.origin}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Storage</dt>
                          <dd className="font-medium text-gray-900">{product.storage}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h4>
                      <div className="space-y-2">
                        {product.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ingredients & Benefits</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Pure Ingredients</h4>
                    <ul className="space-y-3">
                      {product.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Health Benefits</h4>
                    <ul className="space-y-3">
                      {product.benefits?.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Usage Instructions & Dosage</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h4>
                    <div className="bg-green-50 rounded-lg p-6 mb-6">
                      <p className="text-gray-700 leading-relaxed">{product.usage}</p>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Dosage</h4>
                    <div className="bg-blue-50 rounded-lg p-6">
                      <p className="text-gray-700 font-medium">{product.dosage}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Important Precautions</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <ul className="space-y-2">
                        {product.precautions?.map((precaution, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 text-sm">{precaution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {product.reviewCount} reviews</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700 w-12">{stars} star</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${stars === 5 ? 65 : stars === 4 ? 25 : stars === 3 ? 8 : stars === 2 ? 2 : 0}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-12">
                            {stars === 5 ? '65%' : stars === 4 ? '25%' : stars === 3 ? '8%' : stars === 2 ? '2%' : '0%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: 'Priya Sharma',
                      rating: 5,
                      date: '2 weeks ago',
                      title: 'Excellent quality and results',
                      comment: 'I have been using this product for 3 months now and I can see significant improvement in my energy levels and stress management. The quality is excellent and it&apos;s completely natural. Highly recommended!'
                    },
                    {
                      name: 'Rajesh Kumar',
                      rating: 4,
                      date: '1 month ago',
                      title: 'Good product, authentic taste',
                      comment: 'The product quality is good and taste is authentic. I&apos;ve noticed some improvements in my overall health. The packaging is also very good and delivery was fast.'
                    },
                    {
                      name: 'Anita Mehta',
                      rating: 5,
                      date: '3 weeks ago',
                      title: 'Amazing results for stress relief',
                      comment: 'This has helped me a lot with my daily stress and anxiety. I feel more calm and focused throughout the day. Will definitely order again!'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.id !== product.id).map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">₹{relatedProduct.price}</span>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/products/${relatedProduct.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              {
                question: 'How long does it take to see results?',
                answer: 'Most customers notice improvements within 2-4 weeks of consistent use. For best results, we recommend using the product for at least 2-3 months as suggested in Ayurvedic practices.'
              },
              {
                question: 'Are there any side effects?',
                answer: 'Our products are made from natural ingredients and are generally safe when used as directed. However, some people may experience mild digestive discomfort initially. If you have any medical conditions or are taking medications, please consult your healthcare provider.'
              },
              {
                question: 'Can I take this with other supplements?',
                answer: 'While our products are natural, we recommend consulting with your healthcare provider before combining with other supplements or medications to ensure there are no interactions.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day money-back guarantee. If you&apos;re not satisfied with your purchase, you can return the product within 30 days for a full refund.'
              },
              {
                question: 'How should I store this product?',
                answer: `Store in ${product.storage.toLowerCase()}. Keep the container tightly closed and away from moisture. Do not refrigerate unless specifically mentioned.`
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = mockProducts.map((product) => ({
    params: { id: product.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = params?.['id'] as string;
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
};

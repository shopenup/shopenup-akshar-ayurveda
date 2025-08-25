import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Card, Badge } from '../components/ui';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Sample orders data
  const orders = [
    {
      id: 'ORD123456',
      date: '2024-12-15',
      status: 'delivered',
      total: 1897.00,
      items: [
        { name: 'START Weight Gainer', quantity: 2, price: 799 },
        { name: 'Organic Ashwagandha Powder', quantity: 1, price: 299 }
      ],
      trackingNumber: 'TRK789456123',
      estimatedDelivery: '2024-12-18',
      deliveredDate: '2024-12-17'
    },
    {
      id: 'ORD123457',
      date: '2024-12-10',
      status: 'shipped',
      total: 1247.00,
      items: [
        { name: 'Turmeric Golden Milk', quantity: 1, price: 199 },
        { name: 'Neem Face Wash', quantity: 1, price: 149 },
        { name: 'Sandalwood Oil', quantity: 1, price: 399 }
      ],
      trackingNumber: 'TRK789456124',
      estimatedDelivery: '2024-12-13'
    },
    {
      id: 'ORD123458',
      date: '2024-12-05',
      status: 'processing',
      total: 899.00,
      items: [
        { name: 'Chyawanprash', quantity: 1, price: 199 },
        { name: 'Triphala Churna', quantity: 1, price: 149 },
        { name: 'Ashwagandha Tablets', quantity: 1, price: 249 },
        { name: 'Brahmi Capsules', quantity: 1, price: 179 }
      ],
      estimatedDelivery: '2024-12-08'
    },
    {
      id: 'ORD123459',
      date: '2024-11-28',
      status: 'cancelled',
      total: 599.00,
      items: [
        { name: 'Organic Honey', quantity: 1, price: 299 },
        { name: 'Ginger Tea', quantity: 1, price: 149 }
      ]
    }
  ];

  const getStatusColor = (status: string): 'green' | 'blue' | 'yellow' | 'red' | 'gray' => {
    switch (status) {
      case 'delivered':
        return 'green';
      case 'shipped':
        return 'blue';
      case 'processing':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <>
      <Head>
        <title>My Orders - AKSHAR</title>
        <meta name="description" content="View and track your orders" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
            
            {/* Order Status Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} (Qty: {item.quantity})
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Tracking Number: {order.trackingNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Estimated Delivery: {order.estimatedDelivery}
                            </p>
                            {order.deliveredDate && (
                              <p className="text-sm text-green-600">
                                Delivered on: {order.deliveredDate}
                              </p>
                            )}
                          </div>
                          {order.status === 'shipped' && (
                            <Link href={`/order-tracking/${order.id}`}>
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {order.status === 'delivered' && (
                      <Link href={`/buy-again/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Buy Again
                        </Button>
                      </Link>
                    )}
                    {order.status === 'delivered' && (
                      <Link href={`/review/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Write Review
                        </Button>
                      </Link>
                    )}
                    <Link href={`/order-details/${order.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' 
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`
                  }
                </p>
                <Link href="/">
                  <Button variant="primary">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

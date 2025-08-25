import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Input, Card } from '../components/ui';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  // Sample cart items
  const cartItems = [
    {
      id: '1',
      name: 'START Weight Gainer',
      price: 799,
      quantity: 2,
      image: 'https://dummyimage.com/100x100/166534/ffffff?text=Weight+Gainer'
    },
    {
      id: '2',
      name: 'Organic Ashwagandha Powder',
      price: 299,
      quantity: 1,
      image: 'https://dummyimage.com/100x100/4ade80/ffffff?text=Ashwagandha'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log('Placing order:', { formData, cartItems, total });
    router.push('/payment');
  };

  return (
    <>
      <Head>
        <title>Checkout - AKSHAR</title>
        <meta name="description" content="Complete your purchase with secure checkout" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-8">
              <span className={`text-sm ${step >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
                Shipping Details
              </span>
              <span className={`text-sm ${step >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
                Payment Method
              </span>
              <span className={`text-sm ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
                Review & Place Order
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive your order</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-semibold">Online Payment</div>
                          <div className="text-sm text-gray-600">Pay securely with card or UPI</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Review & Place Order</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>{formData.firstName} {formData.lastName}</p>
                          <p>{formData.address}</p>
                          <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                          <p>Phone: {formData.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <Button variant="outline" onClick={handlePreviousStep}>
                      Previous
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button variant="primary" onClick={handleNextStep} className="ml-auto">
                      Next
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handlePlaceOrder} className="ml-auto">
                      Place Order
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, FC } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

// Define the shape of the form data for type safety
interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'razorpay' | 'cod';
}

// Define the Razorpay window object
declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      handler: (response: RazorpaySuccessResponse) => void;
      prefill: {
        name: string;
        email: string;
      };
      theme: { color: string };
      modal: {
        ondismiss: () => void;
      };
    }) => {
      open: () => void;
    };
  }
}

// Define a specific type for the Razorpay success response
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const CheckoutPage: FC = () => {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to safely get product price
  const getProductPrice = (product: { price?: { original?: number } | number }): number => {
    if (product.price && typeof product.price === 'object' && 'original' in product.price && typeof product.price.original === 'number') {
      return product.price.original;
    }
    if (typeof product.price === 'number') {
      return product.price;
    }
    return 0;
  };

  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'razorpay'
  });
  
  // Pre-fill form with user data from Clerk when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const subtotal = state.total;
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const makePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.address || !formData.zipCode) {
        toast({ title: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    setIsProcessing(true);
    const amountToPay = formData.paymentMethod === 'cod' ? total * 0.25 : total;

    // Construct the full order data object
    const orderData = {
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      items: state.items,
      pricing: { subtotal, shipping, tax, total },
      paymentMethod: formData.paymentMethod,
    };
    console.log("Submitting Order to Backend:", orderData);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast({ title: "Payment configuration error.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(amountToPay * 100),
      currency: "INR",
      name: "Luxe Home",
      description: `Order Payment: ${formData.paymentMethod === 'cod' ? '25% Advance' : 'Full Amount'}`,
      handler: function (response: RazorpaySuccessResponse) {
        console.log("Payment Successful:", response);
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase. We'll send a confirmation email.",
        });
        clearCart();
        router.push('/order-confirmation'); // Redirect to a confirmation page
        setIsProcessing(false);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      },
      theme: { color: "#5a4a3a" },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          setIsProcessing(false);
        }
      }
    };
    
    if (!window.Razorpay) {
      toast({ title: "Payment gateway is not loaded yet.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (state.items.length === 0 && !isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">
          Your cart is empty
        </h1>
        <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-8">
          Checkout
        </h1>
        <form onSubmit={makePayment}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="border-furniture-sand">
                <CardHeader><CardTitle className="font-inter">Contact Information</CardTitle></CardHeader>
                <CardContent>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                </CardContent>
              </Card>

              <Card className="border-furniture-sand">
                <CardHeader><CardTitle className="font-inter">Shipping Address</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required />
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} required />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleInputChange('zipCode', e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                </CardContent>
              </Card>
              
              <Card className="border-furniture-sand">
                <CardHeader><CardTitle className="font-inter">Payment Method</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-furniture-cream/30 transition-colors ${formData.paymentMethod === 'razorpay' ? 'border-furniture-brown ring-2 ring-furniture-brown' : 'border-furniture-sand'}`} onClick={() => handleInputChange('paymentMethod', 'razorpay')}>
                        <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === 'razorpay'} onChange={() => {}} className="text-furniture-brown focus:ring-furniture-brown"/>
                        <div className="flex-1">
                            <h4 className="font-inter font-medium">Pay Full Amount Online</h4>
                            <p className="text-sm text-gray-600">Securely pay with UPI, Card, or Net Banking.</p>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-furniture-cream/30 transition-colors ${formData.paymentMethod === 'cod' ? 'border-furniture-brown ring-2 ring-furniture-brown' : 'border-furniture-sand'}`} onClick={() => handleInputChange('paymentMethod', 'cod')}>
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => {}} className="text-furniture-brown focus:ring-furniture-brown"/>
                        <div className="flex-1">
                            <h4 className="font-inter font-medium">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600">Pay 25% advance now, remaining on delivery.</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-furniture-sand sticky top-24">
                <CardHeader><CardTitle className="font-inter">Order Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {state.items.map((item, idx) => (
                      <div key={item.product._id?.toString() ?? idx} className="flex items-center space-x-4">
                        <Image src={item.product.images[0]} alt={item.product.name} width={64} height={64} className="w-16 h-16 object-cover rounded"/>
                        <div className="flex-1">
                          <h4 className="font-inter font-medium text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-inter font-medium">₹{(getProductPrice(item.product) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold"><span>Total</span><span className="text-lg">₹{total.toFixed(2)}</span></div>
                  </div>
                   {formData.paymentMethod === 'cod' && (
                     <div className="mt-4 p-3 bg-furniture-cream/50 rounded-md text-center">
                        <p className="text-sm text-furniture-charcoal">Advance Payment (25%)</p>
                        <p className="font-bold text-lg text-furniture-brown">₹{(total * 0.25).toFixed(2)}</p>
                     </div>
                   )}
                  <Button type="submit" className="w-full mt-6 bg-furniture-brown hover:bg-furniture-darkBrown" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ${formData.paymentMethod === 'cod' ? `₹${(total * 0.25).toFixed(2)}` : `₹${total.toFixed(2)}`}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product';
import { notFound } from 'next/navigation';
import ProductClient from '@/components/products/ProductClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
  try {
    await connectDB();
    const { productId } = await params;
    const product = await Product.findById(productId).lean();
    
    if (!product) {
      return { title: 'Product Not Found' };
    }

    // Ensure product is not an array and has the expected properties
    const productObj = Array.isArray(product) ? product[0] : product;

    return {
      title: `${productObj?.name ?? 'Product'} | Luxe Home`,
      description: productObj?.description ?? '',
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return { title: 'Error' };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  try {
    await connectDB();
    const { productId } = await params;

    const product = await Product.findById(productId);

    if (!product) {
      notFound();
    }

    // FIX: Convert the Mongoose document to a plain JavaScript object
    // This makes it serializable and safe to pass from a Server to a Client Component.
    const plainProduct = JSON.parse(JSON.stringify(product));
    
    // If found, pass the plain data object to the Client Component
    return <ProductClient product={plainProduct} />;

  } catch (error) {
    console.error('Error fetching product:', error);
    // If the ID is not a valid MongoDB ObjectId, findById will throw an error
    notFound();
  }
}

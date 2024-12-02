import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import ProductDetails from '../components/Products/ProductDetails'
import Footer from '../components/Layout/Footer'
import { useParams } from 'react-router-dom'
import { productData } from '../static/data'
import { useSelector } from 'react-redux'
import SuggestedProduct from '../components/Products/SuggestedProduct'

const ProductDetailsPage = () => {

  const { products } = useSelector((state) => state.products);
  console.log("Products are", products);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const data2 = products.find((i) => i._id === id);
    setData(data2);
  }, [products, id]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        data && <SuggestedProduct data={data} />
      }
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
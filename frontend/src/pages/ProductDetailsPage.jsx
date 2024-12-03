import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import ProductDetails from '../components/Products/ProductDetails'
import Footer from '../components/Layout/Footer'
import { useParams } from 'react-router-dom'
import { productData } from '../static/data'
import { useSelector } from 'react-redux'
import SuggestedProduct from '../components/Products/SuggestedProduct'
import { useDispatch } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);
  console.log("Products are", allProducts);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const data2 =allProducts && allProducts.find((i) => i._id === id);
    setData(data2);
  }, [allProducts, id]);
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
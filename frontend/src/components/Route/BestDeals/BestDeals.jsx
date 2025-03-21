import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../../redux/actions/product";

const BestDeals = () => {
  const dispatch = useDispatch();
  const { allProducts} = useSelector((state) => state.products);
  console.log("All Products are", allProducts);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.heading}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {data && data.length !== 0 ? (
            data.map((product, index) => <ProductCard data={product} key={index} />)
          ) : (
            <div className="text-center">No products available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;

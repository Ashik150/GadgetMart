import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { productData } from '../../static/data'
import ProductCard from '../Route/ProductCard/ProductCard'
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from '../../redux/actions/event';

const ShopProfileData = ({ isOwner }) => {
    const [active, setActive] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        dispatch(getAllEventsShop(id));
    }, [dispatch, id]);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <div className="w-full flex">
                    <div className="flex items-center" onClick={() => setActive(1)}>
                        <h5 className={`font-[600] text-[20px] 
                    ${active === 1 ? "text-red-500" : "text-[#333]"}
               cursor-pointer pr-[20px]`}>
                            Shop Products
                        </h5>
                    </div>
                    <div className="flex items-center" onClick={() => setActive(2)}>
                        <h5 className={`font-[600] text-[20px]  ${active === 2 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px]`}>
                            Running Events
                        </h5>
                    </div>
                    <div className="flex items-center" onClick={() => setActive(3)}>
                        <h5 className={`font-[600] text-[20px]  ${active === 3 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px]`}>
                            Shop Reviews
                        </h5>
                    </div>
                </div>
                <div>
                    {isOwner && (
                        <div>
                            <Link to="/shopdashboard">
                                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                                    <span className="text-[#fff]">Go ShopDashboard</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                {active === 1 &&
                    products &&
                    products.length > 0 &&
                    products.map((product, index) => (
                        <ProductCard data={product} key={index} isShop={true} />
                    ))}

                {active === 1 && (!products || products.length === 0) && (
                    <p>No products found for this shop.</p>
                )}

                {/* Events Tab */}
                {active === 2 &&
                    events &&
                    events.length > 0 &&
                    events.map((event, index) => (
                        <div key={index}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                        </div>
                    ))}

                {active === 2 && (!events || events.length === 0) && (
                    <p>No running events for this shop.</p>
                )}

                {/* Reviews Tab */}
                {active === 3 && <p>Shop reviews will go here.</p>}
            </div>
        </div>

    )
}

export default ShopProfileData  
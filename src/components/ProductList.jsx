import { useEffect, useRef } from "react";
import { useState } from "react"
import ProductCard from "./ProductCard";
import { Spinner } from "keep-react";



const productsPerPage = 10;

export default function ProductList() {
    const [prouducts, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); //আরো আছে কি না

    const loaderRef = useRef(null);

    useEffect(() => {

        // fetch products
        const fetchProducts = async () => {
            const response = await fetch(`https://dummyjson.com/products?limit=${productsPerPage}&skip=${page * productsPerPage}`);

            const data = await response.json();

            if (data.products.length === 0) {
                setHasMore(false);
            }
            else {
                setProducts((prevProducts) => [...prevProducts, ...data.products]);
            }

            // set page to next page after fetching products 
            setPage((prevPage) => prevPage + 1);
        }

        // intersection observer
        const onIntersection = (items) => {
            const loaderItem = items[0];

            if (loaderItem.isIntersecting && hasMore) {
                fetchProducts(); // isIntersecting is true then fetch products
            }
        }

        const observer = new IntersectionObserver(onIntersection);
        if (observer && loaderRef.current) {
            observer.observe(loaderRef.current); //কি দিয়া observer করব
        }

        // cleanup
        return () => {
            if (observer) observer.disconnect();
        }
    }, [page, hasMore]);

    return (
        <div>
            {
                prouducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            }

            {/* product list will be loaded */}

            {
                hasMore && <div className="py-6" ref={loaderRef}>
                    <Spinner color="info" size="lg" />
                    <span className="ms-2">Loading...</span>
                </div>
            }
        </div>
    )
}

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // Used to send actions to Redux
import { addToCart } from "../store/cartSlice"; // Import the addToCart action

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

// Product Component
const ProductList = () => {
    const [products, setProducts] = useState([]); // State for storing products
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const dispatch = useDispatch(); // Get Redux dispatch function

    // Fetch products from FakeStore API on component mount
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((response) => response.json())
            .then((result) => {
                console.log("Fetched Products:", result); // Debugging API data
                setProducts(result);
            })
            .catch((error) => console.error("Error fetching products:", error)); // Handle errors
    }, []);

    // Function to handle Add to Cart button click
    const handleAddToCart = (product) => {
        dispatch(addToCart(product)); // Dispatch action to add product to cart
        setSuccessMessage(`${product.title} has been added to the cart!`); // Set success message

        // Remove success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    return (
        <div className="container">
            <h1 className="text-center my-4">Product List</h1>

            {/* Show loading message if products are not yet loaded */}
            {products.length === 0 ? <p className="text-center">Loading products...</p> : null}

            {/* Show success message */}
            {successMessage && (
                <div className="alert alert-success text-center" role="alert">
                    {successMessage}
                </div>
            )}

            <div className="row">
                {products.map((product) => (
                    <div className="col-md-3 mb-4" key={product.id} style={{ marginBottom: "10px" }}>
                        <Card className="h-100" style={{ width: "18rem" }}>
                            <div className="text-center">
                                <Card.Img variant="top" src={product.image} style={{ width: "100px", height: "130px" }} />
                            </div>
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Text>${product.price}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                                <Button variant="primary" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;

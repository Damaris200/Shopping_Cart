import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { useState } from "react";

function Cart() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    const handleOrderClick = () => {
        setShowForm(true);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!email || !address) {
            alert("Please enter both your email and address.");
            return;
        }

        setLoading(true); // Show loading state

        const orderData = { email, address, cartItems: JSON.stringify(cartItems), totalPrice };

        try {
            const response = await fetch("http://localhost:5000/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setOrderPlaced(true);
                setShowForm(false);
                dispatch(clearCart());
                setEmail("");  // Clear input fields
                setAddress("");
            } else {
                alert("Failed to place order. Try again later.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="container">
            <h2 className="text-center my-4">🛒 Shopping Cart</h2>

            {cartItems.length === 0 && <p className="text-center">Your cart is empty.</p>}

            {orderPlaced && (
                <div className="alert alert-success text-center" role="alert">
                    ✅ Your order has been placed successfully! You will receive your delivery within 3 days.
                </div>
            )}

            <ul className="list-group">
            {cartItems.map((item) => (
    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <div>
            <img src={item.image} alt={item.title} style={{ width: "50px", marginRight: "10px" }} />
            {item.title} - ${item.price}
        </div>
        <button className="btn btn-danger" onClick={() => dispatch(removeFromCart(item.id))}>
            ❌ Remove
        </button>
    </li>
))}

            </ul>

            {cartItems.length > 0 && (
                <div className="text-center my-4">
                    <h4>Total: <strong>${totalPrice.toFixed(2)}</strong></h4>
                    {!showForm ? (
                        <button className="btn btn-success" onClick={handleOrderClick}>
                            🛍 Place Order
                        </button>
                    ) : (
                        <form className="mt-3 p-3 border rounded shadow-sm bg-light" onSubmit={handlePlaceOrder}>
                            <h5 className="text-center">Enter Order Details</h5>
                            <div className="mb-3">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Home Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Processing..." : "✅ Confirm Order"}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default Cart;

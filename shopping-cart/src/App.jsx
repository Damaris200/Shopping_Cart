import { Routes, Route } from "react-router-dom"; // ✅ No BrowserRouter here
import { Provider } from "react-redux";
import store from "./store/store";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Provider>
    );
}

export default App;

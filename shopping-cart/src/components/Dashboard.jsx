import React from 'react';
import { Link } from "react-router-dom"; // Used to create navigation links
import "../styles/dashboard.css"; // Import the Dashboard CSS file

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to my Shopping App, here we offer good and quality products </h1>
            
            <div className="card-grid">
                {/* Dashboard Cards */}
                <div className="card">
                    <div className="card-header">Products</div>
                    <div className="card-body">Manage and view products in your store</div>
                    <div className="card-footer">
                        <Link to="/products">
                            <button>Go to Products</button>
                        </Link>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">Cart</div>
                    <div className="card-body">View the shopping cart and checkout</div>
                    <div className="card-footer">
                        <Link to="/cart">
                            <button>Go to Cart</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

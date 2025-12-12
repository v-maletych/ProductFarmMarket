import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import {UserProvider} from './context/UserContext';
import {CartProvider} from './context/CartContext';
import {MarketDataProvider} from './context/MarketDataContext';
import {Toaster} from 'react-hot-toast';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <MarketDataProvider>
                    <CartProvider>
                        <App/>
                    </CartProvider>
                </MarketDataProvider>
            </UserProvider>
            <Toaster position="bottom-right" reverseOrder={false}/>
        </BrowserRouter>
    </React.StrictMode>,
)
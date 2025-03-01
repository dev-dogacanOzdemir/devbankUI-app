import React from 'react';
import { NavbarSimpleColored } from './NavbarSimpleColored';
import { Outlet } from "react-router-dom";
import logo from "../assets/devBankLogoBlack.png"
const Layout: React.FC = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom right',
                backgroundSize: '200px',
                opacity: 0.8,
                zIndex: 2,
                pointerEvents: 'none',
            }} />

            {/* Sol tarafta sabit Navbar */}
            <div style={{ flexShrink: 0, zIndex: 1 }}>
                <NavbarSimpleColored />
            </div>

            {/* Sağ tarafta dinamik içerik alanı */}
            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                backgroundColor: '#e5e5e5',
                zIndex: 1,
            }}>
                <div style={{zIndex : 3}}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

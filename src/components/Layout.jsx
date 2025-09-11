import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../Pages/Navbar';
import ResponsiveMenu from '../Pages/ResponsiveMenu';
import Footer from '../Pages/Footer';


const Layout = () => {
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <>
            <Navbar toggleMenu={toggleMenu} />
            <ResponsiveMenu showMenu={showMenu} toggleMenu={toggleMenu} />
            <main>
                <Outlet /> {/* ✅ This renders the current route's component */}
            </main>
            <Footer />
        </>
    );
};

export default Layout;

import React from 'react';
import Banner from '../Pages/Banner';
import Research from '../Pages/Research';
import Expertise from '../Pages/Expertise';
import Projects from '../Pages/Projects';


const Home = () => {
    return (
        <div>
            <Banner />
            <Research />
            <Expertise />
            <Projects showAll={false} limit={3} />
            {/* Your other home page content here */}
            <div className="pt-24">
                {/* Page content goes here */}
            </div>
        </div>
    );
};

export default Home;
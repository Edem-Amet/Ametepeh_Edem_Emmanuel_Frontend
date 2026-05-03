import React from 'react';
import Banner from '../Pages/Banner';
import Research from '../Pages/Research';
import Skills from '../Pages/Expertise';
import Certificates from '../Pages/Certificates';
import Projects from '../Pages/Projects';
import Blog from '../Pages/Blog';

const Home = () => {
    return (
        <div>
            <Banner />
            <Research isHomepage={true} />
            <Skills isHomepage={true} />
            <Certificates isHomepage={true} />
            <Blog isHomepage={true} />
            <Projects showAll={false} limit={3} />
        </div>
    );
};

export default Home;
import React, { useState, useEffect } from "react";
import AOS from "aos";

import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import Filter from "../components/global/Filter";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="home">
      <div className="home__intro">
        <div className="home__intro-title" data-aos="fade-down">
          A powerful JavaScript Image Editor that integrates with every stack
        </div>
        <div className="home__intro-body" data-aos="fade-up">
          A fully configurable image editor SDK that's intuitive on mobile and
          desktop. Set image requirements and help your customers upload better
          pictures.
        </div>
      </div>
      <div className="home__action" data-aos="flip-up">
        <div className="home__darkmode">
          <div
            className={
              isDark === false
                ? "home__darkmode-icon home__darkmode-icon--active"
                : "home__darkmode-icon"
            }
            onClick={() => setIsDark(false)}
          >
            <WbSunnyIcon className="home__icon" />
          </div>
          <div
            className={
              isDark === true
                ? "home__darkmode-icon home__darkmode-icon--active"
                : "home__darkmode-icon"
            }
            onClick={() => setIsDark(true)}
          >
            <NightlightIcon className="home__icon" />
          </div>
        </div>
        <Filter isDark={isDark} />
      </div>
    </div>
  );
};

export default Home;

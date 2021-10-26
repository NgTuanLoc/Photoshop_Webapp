import React, { useEffect } from 'react';
import NightlightIcon from '@mui/icons-material/Nightlight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useState } from 'react';
import {useSelector , useDispatch} from 'react-redux'
import Filter from './Filter';
import { isDarkmode } from '../redux/actions/DarkmodeAction';
const Home = () => {
    const isDark = useSelector(state=>state.darkMode)
    const dispatch = useDispatch()
    return (
        <div className="home">
            <div className="home__intro">
                <div className="home__intro-title">
                    A powerful JavaScript Image Editor that integrates with every stack
                </div>
                <div className="home__intro-body">
                    A fully configurable image editor SDK that's intuitive on mobile and desktop. Set image requirements and help your customers upload better pictures.
                </div>
            </div>

            <div className="home__action">
                <div className="home__darkmode">
                    <div
                        className={isDark === false ? "home__darkmode-icon home__darkmode-icon--active" : "home__darkmode-icon"}
                        onClick={() => dispatch(isDarkmode(false))}
                    >
                        <WbSunnyIcon className="home__icon" />
                    </div>
                    <div
                        className={isDark === true ? "home__darkmode-icon home__darkmode-icon--active" : "home__darkmode-icon"}
                        onClick={()=>dispatch(isDarkmode(true))}
                    >
                        <NightlightIcon className="home__icon" />
                    </div>
                    
                </div>
                <Filter />

            </div>
        </div>
    );
}

export default Home;

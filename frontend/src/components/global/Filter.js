import { useDispatch,useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import CropIcon from '@mui/icons-material/Crop';
import FilterIcon from '@mui/icons-material/Filter';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TuneIcon from '@mui/icons-material/Tune';
import testImg from '../../images/logo.png';

import { isOpenModal } from '../../redux/actions/ModalAction';
import Brigthimage from './brightImage/BrigthImage';
import Cropimage from './CropImage';
import Filterimage from './FilterImage';

const Filter = ({ isDark }) => {
    const handlingImage = useSelector(state => state.imageHandling)
    const dispatch = useDispatch()
    const [isCrop, setIsCrop] = useState(false)
    const [isBright, setIsBright] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [imgSrc, setImgSrc] = useState(testImg)

    useEffect(() => {
        if (handlingImage) setImgSrc(handlingImage)
    }, [handlingImage])

    const setOpenCrop = () => {
        setIsCrop(true)
        setIsBright(false)
        setIsFilter(false)
    }

    const setOpenBright = () => {
        setIsBright(true)
        setIsCrop(false)
        setIsFilter(false)
    }

    const setOpenFilter = () => {
        setIsFilter(true)
        setIsBright(false)
        setIsCrop(false)

    }
    const styleDarkmode = {
        backgroundColor: isDark ? 'rgb(33,34,35)' : 'rgb(255,251,245)',
        color: isDark ? 'rgb(195,198,202)' : ''
    }

    const handleChangeFile = (e) => {
        setImgSrc(URL.createObjectURL(e.target.files[0]))
    }

    const renderTypeComponent = () => {
        if (isBright === false && isCrop === false && isFilter === false) {
            return <img className="filter__image-current" src={imgSrc} style={{ objectFit: "contain" }} alt="" />
        }
        else if (isCrop === false && isBright && isFilter === false) {
            return <Brigthimage imgSrc={imgSrc} />
        }
        else if (isCrop === false && isBright === false && isFilter) {
            return <Filterimage imgSrc={imgSrc}  />
        }

        else return <Cropimage imgSrc={imgSrc} />
    }
    
    return (
        <div className="filter" style={styleDarkmode}>
            <div className="filter__state">
                <div className="filter__state-upload">
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleChangeFile} />
                    <label htmlFor="file" className="filter-file__upload">
                        <InsertPhotoIcon className="filter-file__icon" />
                        <span>Select Image</span>
                    </label>
                </div>
                <div className="filter__state-confirm" onClick={() => dispatch(isOpenModal(true))} >
                    Preview
                </div>
            </div>
            <div className="filter__handle-image">
                <ul className="filter__handle-list">
                    <li
                        className={isCrop ? "filter__handle-item filter__handle-item--active" : "filter__handle-item"}
                        onClick={() => setOpenCrop()}>
                        <CropIcon />
                        <br />
                        <span>Crop</span>
                    </li>
                    <li
                        className={ isBright ? "filter__handle-item filter__handle-item--active" : "filter__handle-item"}
                        onClick={() => setOpenBright()}>
                        <TuneIcon />
                        <br />
                        <span>Bright</span>
                    </li>
                    <li
                        className={isFilter ? "filter__handle-item filter__handle-item--active" : "filter__handle-item"}
                        onClick={() => setOpenFilter()}>
                        <FilterIcon />
                        <br />
                        <span>Filter</span>
                    </li>
                </ul>
                <div className="filter__handle-rotate">
                    {
                        renderTypeComponent()
                    }
                </div>
            </div>
        </div>
    );
}

export default Filter;

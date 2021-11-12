import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch } from 'react-redux';

import CropSquareIcon from '@mui/icons-material/CropSquare';
import Crop54Icon from '@mui/icons-material/Crop54';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import FlipIcon from '@mui/icons-material/Flip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import getCroppedImg from '../utils/function/cropImage';

import { setImageAction } from '../../redux/actions/ImageHandlingAction';

const Cropimage = ({ imgSrc }) => {
    const dispatch = useDispatch()
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotate, setRotate] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [cropShape, setCropShape] = useState(0)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const rotateLeft = () => {
        var newRotate = rotate - 90
        if (newRotate <= -360) {
            newRotate = 0
        }
        setRotate(newRotate)
    }

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imgSrc,
                croppedAreaPixels,
                rotate
            )
            await setCroppedImage(croppedImage)
            dispatch(setImageAction(croppedImage))
            alert('Success')
        } catch (e) {
            alert(e)
        }
    }, [croppedAreaPixels, rotate])

    const getCropShape = () => {
        if (cropShape === 0) return <Cropper
            image={imgSrc}
            crop={crop}
            rotation={rotate}
            zoom={zoom}
            cropShape="rect"
            aspect={3 / 3}
            onCropChange={setCrop}
            onRotationChange={rotate}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            restrictPosition={false}
        />
        else if (cropShape === -1)
            return <Cropper
                image={imgSrc}
                crop={crop}
                rotation={rotate}
                zoom={zoom}
                cropShape="rect"
                aspect={2 / 3}
                onCropChange={setCrop}
                onRotationChange={rotate}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                restrictPosition={false}
            />
        else return <Cropper
            image={imgSrc}
            crop={crop}
            rotation={rotate}
            zoom={zoom}
            cropShape="rect"
            aspect={3 / 2}
            onCropChange={setCrop}
            onRotationChange={rotate}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            restrictPosition={false}
        />
    }

    return (
        <>
            <ul className="filter__rotate-list">
                <li className="filter__rotate-item">
                    <Rotate90DegreesCcwIcon />
                    <div onClick={rotateLeft}>Rotate left</div>
                </li>
                <li className="filter__rotate-item">
                    <FlipIcon />
                    <div>Flip horizontal</div>
                </li>
                <li className="filter__rotate-item">
                    <DashboardIcon />
                    <div>Crop Shape</div>
                    <ul className="filter__shape-lists">
                        <li
                            className="filter__shape-item"
                            onClick={() => setCropShape(0)}>
                            <CropSquareIcon />
                            <div>Square</div>
                        </li>
                        <li
                            className="filter__shape-item"
                            onClick={() => setCropShape(-1)}>
                            <Crop54Icon />
                            <div>Rect Vertical</div>
                        </li>
                        <li
                            className="filter__shape-item"
                            onClick={() => setCropShape(1)}>
                            <CropPortraitIcon />
                            <div>Rect Horizal</div>
                        </li>
                    </ul>
                </li>
            </ul>
            <div className="filter__image-handling">
                {
                    getCropShape()
                }
            </div>

            <div className="filter__rotate-control" >
                <input
                    type="range"
                    value={zoom}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onChange={(e) => setZoom(e.target.value)} />
                <div>Zoom: {zoom}</div>
            </div>
            <div className="filter__rotate-control">
                <input
                    type="range"
                    min={-180}
                    max={180}
                    onChange={(e) => setRotate(e.target.value)}
                />
                <div>Rotate : {rotate}</div>
            </div>
            <button
                className="filter__rotate-button"
                onClick={showCroppedImage}
            >
                Save</button>
        </>
    );
}

export default Cropimage;

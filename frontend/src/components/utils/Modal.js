import React from 'react';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { isOpenModal } from '../../redux/actions/ModalAction';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Modal = () => {
    const isOpen = useSelector(state => state.openModal)
    const dispatch = useDispatch()
    const imgHandling = useSelector(state => state.imageHandling)

    const styleModal = {
        left: isOpen ? 0 : '-100%'
    }

    return (
        <>
            {
                imgHandling &&
                <div className="modal" style={styleModal} >
                    <img src={imgHandling} alt="" />
                    <div className="modal__icons">
                        <a href={imgHandling} download target="_blank" rel="noreferrer">
                            <CloudDownloadIcon
                                className="model__download-icon"
                            />
                        </a>
                        <CancelIcon
                            className="model__close-icon"
                            onClick={() => dispatch(isOpenModal(false))} />
                    </div>
                </div>
            }
        </>
    );
}

export default Modal;

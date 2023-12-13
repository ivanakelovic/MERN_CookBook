import React, {Children, useState} from "react";
import Button from "react-bootstrap/Button";
import {Modal} from "react-bootstrap";


const ModalComponent = ({show, onHide,modalTitle,children}) => {

    return (
        <div className="row">
            <Modal show={show} onHide={onHide} className='modal-xl d-flex justify-content-center align-items-center col-sm-12 col-md-12 col-lg-12 col-xl-12'
                   >
                <Modal.Header closeButton>
                <Modal.Title className="text-center">{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ModalComponent;
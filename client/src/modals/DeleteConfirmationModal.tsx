import React from "react";
import { Modal } from "react-bootstrap";
import "../css/components.css";

const DeleteConfirmationModal = ({ item, closeModal, onDelete,onShow }) => {
  const handleDelete = () => {
    onDelete(item);
    closeModal();
  };

  return (
    <Modal show={onShow} onHide={closeModal}
    className="d-flex align-items-center justify-content-center">
        <Modal.Body >
      <p>  Are you sure you want to delete this item?</p>
       <div className="d-flex justify-content-between align-items-center">
       <button 
       className="btn btn-md default-button"
       onClick={closeModal}>No, Cancel</button>
       <button
        className="btn btn-md green-button"
        onClick={handleDelete}>Yes, Delete</button>
        
       </div>
        </Modal.Body>



    </Modal>
  );
};

export default DeleteConfirmationModal;

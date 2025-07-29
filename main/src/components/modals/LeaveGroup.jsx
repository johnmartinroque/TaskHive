import React from "react";
import { Button, Modal } from "react-bootstrap";

function LeaveGroup({ show, onClose, onConfirm, name }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{"Are you sure you want to leave?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}
          style={{scale:"0.8", marginRight:'-1rem', color:'#1f1f1f'}}
          id="buttones">
          <h4>Cancel</h4>
        </Button>
        <Button variant="warning" onClick={onConfirm} 
          style={{scale:"0.8"}}
          id="buttones">
          <h4>Leave Group</h4>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LeaveGroup;

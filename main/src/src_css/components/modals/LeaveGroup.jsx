import React from "react";
import { Button, Modal } from "react-bootstrap";

function LeaveGroup({ show, onClose, onConfirm, name }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{"something"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Leave Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LeaveGroup;

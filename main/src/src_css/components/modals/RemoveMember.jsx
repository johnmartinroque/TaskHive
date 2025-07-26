import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function RemoveMember({ show, onClose, onConfirm, name }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove <strong>{name}</strong> from the group?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DeleteTaskModal({
  show,
  onClose,
  onConfirm,
  taskName,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to permanently delete the task{" "}
        <strong>{taskName}</strong>?
        <br />
        This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

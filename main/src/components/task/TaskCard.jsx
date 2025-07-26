import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../src_css/components/task/TaskCard.css";

function TaskCard(props) {
  const { id, name, description, datePosted, progress, deadline, groupName } = props;

  return (
    <Link to={`/tasks/${id}`} className="task-link">
    <Card className="task-carda">
      <Card.Body>
        <h5>
          <Link to={`/tasks/${id}`} className="task-link">
            {name}
          </Link>
        </h5>
        <p className="task-desc">{description}</p>
        <p className="task-date">Posted on: {datePosted}</p>
        {deadline ? <p className="task-dead">Deadline: {deadline}</p> : <> <p className="task-dead">No deadline</p></>}
        <p className="task-progress">{progress}</p>
      </Card.Body>
    </Card>
    </Link>
  );
}

export default TaskCard;

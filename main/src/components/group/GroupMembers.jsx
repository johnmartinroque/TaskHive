import { Button } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import RemoveMember from "../modals/RemoveMember";

function GroupMembers({ members, isAdmin, handleRemoveMember }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const approvedMembers = members?.filter(
    (member) => member.role !== "pending"
  );

  return (
    <div>
      <h1>Members:</h1>

      <ul className="invitations-list requests-grid list-unstyled">
        {approvedMembers.map((member, index) => (
          <li
            key={member.id}
            className="request-list-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h4>{member.name}</h4>
              <div className="invite-text">({member.role})</div>
            </div>
            <div className="invite-btn-group">
              {isAdmin && (
                <button
                  className="invite-decline-btn btn btn-danger btn-sm"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveMember(member)}
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupMembers;

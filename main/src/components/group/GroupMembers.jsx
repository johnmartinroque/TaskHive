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
      <h4>Members:</h4>
      {approvedMembers.map((member, index) => (
        <p key={index}>
          {member.name} ({member.role})
          {isAdmin && member.id !== user?.uid && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveMember(member)}
              className="ms-2"
            >
              Remove
            </Button>
          )}
        </p>
      ))}
    </div>
  );
}

export default GroupMembers;

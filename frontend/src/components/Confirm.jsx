import React from "react";

function Confirm({ showConfirm, setShowConfirm, confirmText, onConfirm }) {
  return showConfirm ? (
    <div className="confirm">
      <div className="confirmBox column">
        <h3>{confirmText}</h3>
        <div className="row">
          <button onClick={onConfirm}>Confirm</button>
          <button
            onClick={() => {
              setShowConfirm(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Confirm;

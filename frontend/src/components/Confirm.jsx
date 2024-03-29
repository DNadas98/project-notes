import React from "react";

function Confirm({ showConfirm, setShowConfirm, confirmText, onConfirm, setOnConfirm }) {
  return (
    showConfirm && (
      <div className="confirm">
        <div className="confirmBox column">
          <h3>{confirmText}</h3>
          <div className="row">
            <button
              onClick={() => {
                onConfirm();
                setShowConfirm(false);
                setOnConfirm(null);
              }}
            >
              Confirm
            </button>
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
    )
  );
}

export default Confirm;

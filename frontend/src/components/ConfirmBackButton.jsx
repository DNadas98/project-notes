import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Confirm from "./Confirm";

function ConfirmBackButton() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [onConfirm, setOnConfirm] = useState(false);
  const confirmText = `Are you sure you want to go back?\nAll unsaved changes will be lost.`;
  return (
    <div>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
        setOnConfirm={setOnConfirm}
      />
      <button
        onClick={() => {
          setOnConfirm(() => () => navigate(-1));
          setShowConfirm(true);
        }}
      >
        Back
      </button>
    </div>
  );
}

export default ConfirmBackButton;

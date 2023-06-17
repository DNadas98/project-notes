import React from "react";
import BackButton from "../../BackButton";
import { useLocation } from "react-router-dom";

function EditUser() {
  const userid = useLocation()?.state?.userid;
  return (
    <div>
      <h2>{userid}</h2>
      <BackButton />
    </div>
  );
}

export default EditUser;

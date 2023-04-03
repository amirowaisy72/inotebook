import React, { useContext } from "react";
import context from "../context/notes/noteContext";

const Alert = () => {
  const fetchAlerts = useContext(context)
  const {alert} = fetchAlerts

  // console.log(alert)
  return (
    <div className={`alert alert-${alert.status} alert-dismissible fade show`} role="alert">
      {alert.message}
    </div>
  );
};

export default Alert;

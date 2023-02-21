import React, { useEffect, useState } from "react";

export const CompletedSign = ({setIsUploading,setIsCompleted}) => {
  const [completeStatus, setCompleteStatus] = useState(false);
  useEffect(() => {
    setCompleteStatus(true);
    setTimeout(() => {
      setCompleteStatus(false);
      setIsUploading(false)
      setIsCompleted(false)
    }, 2000);
  }, [])
  
  return (
    <>
        {completeStatus && (
          <div className="completed-container">
            <div className="mark"></div>
          </div>
        )}
    </>
  );
};

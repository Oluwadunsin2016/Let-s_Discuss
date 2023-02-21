import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"

const CircularProgressBar = ({setIsCompleted,isuploading}) => {
const [percentage, setPercentage] = useState(0);

  useEffect(() => {
     if (isuploading) {
       if (percentage < 100) {
        setTimeout(() => {
          setPercentage(percentage + 1);
        console.log(percentage);
        }, 20);
      } else if (percentage === 100) {
        setIsCompleted(true);
        console.log(percentage);
      }
     }
  }, [percentage,isuploading]);
 

  return (
    <>
      <div className="circular-progressbar">
        <CircularProgressbar
          className="text-center"
          styles={buildStyles({
            strokeLinecap: "round",
            textSize: "10px",
            trailColor: "#d1d1d1",
            textColor: "rgb(62,152,255)",
            backgroundColor: "#3e98c7",
            pathColor: `rgb(62,152,199)`,
          })}
          strokeWidth={"4"}
          value={percentage}
          text={`${percentage}%`}
        />
      </div>
    </>
  );
};

export default CircularProgressBar;

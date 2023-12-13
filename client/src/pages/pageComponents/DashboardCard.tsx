import React from "react";
import "../../css/components.css";

const DashboardCard=(props)=>{
    return(
        <div className="card card-rounded col m-1 default-border"
        >
            <div className="card-body ">
                <div className="card-text text-center text-dark text h5">{props.pretext}</div>
                <div className="card-text text-center h5">{props.number}</div>
                <div className="card-text text-center text-dark text h5">{props.aftertext}</div>
            </div>
        </div>
    );

};

export default DashboardCard
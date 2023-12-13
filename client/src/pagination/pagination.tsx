
import React from "react";
import "../css/components.css";

export function Pagination({paginationData, onPageChange, onLimitChange}) {
    const {page, totalPages, limit} = paginationData;

    const handlePageChange = (index) => {
        onPageChange(index);
    };
    const handleLimitChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        onLimitChange(newLimit);
    };

    const numbersArray = Array.from({length: totalPages}, (_, index) => index + 1);


    return (
        <div>
            <ul className="pagination justify-content-center ">
                <li className={`page-item previous mx-1 ${page === 1 ? 'disabled' : ''}`}>
                    <span className="page-link page-text default-button" onClick={() => handlePageChange(page - 1)}>Previous</span>
                </li>
                {totalPages && numbersArray.map((item) => (
                    <li key={item} className={`page-item ${item === page ? 'active ' : ''}`}>
                        <span className="page-link page-text btn green-button mx-2" onClick={() => handlePageChange(item)}>{item}</span>
                    </li>
                ))}
                <li className={`page-item next ${page === totalPages ? 'disabled' : ''}`}>
                    <span className="page-link page-text default-button mx-1" onClick={() => handlePageChange(page + 1)}>Next </span>
                </li>

                <li className="d-flex justify-content-end ms-20 float-left" >
                    <div className="d-flex justify-content-end ">
                        <p className="fw-bolder text-white justif m-2">Limit:</p>
                        <select className=" default-border justify-content-center form-select form-select-sm" value={limit} onChange={handleLimitChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </li>

            </ul>

        </div>
    );
}

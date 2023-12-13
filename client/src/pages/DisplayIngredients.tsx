import React, { useState,useEffect } from "react"
import { getIngredients,deleteIngredient } from "../services/ingredient.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "../pagination/pagination";
import "../css/components.css";
import { useAuth } from "../auth";
import { Card, Modal } from "react-bootstrap";
import ModalComponent from "../modals/ModalComponent";
import AddIngredient from "./AddIngredient";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";


const DisplayIngredients=()=>{

    //ingredients data
    const [ingredientsList,setIngredientsList]=useState([]);
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState({});
    const [currentLimit, setCurrentLimit] = useState(10);
    //modal
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [ingredientToEdit, setIngredientToEdit] = useState(null);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [refreshData, setRefreshData] = useState(false); 

    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
        setIsModalOpen(true);
    };

    const {currentUser,logout}=useAuth();
    const navigate=useNavigate();

    //ingredients data

    useEffect(()=>{
        fetchIngredientsData({});
    },[refreshData]);

    const fetchIngredientsData = (filterOptions) => {
        getIngredients(filterOptions)
            .then(([pagination, allIngredientsData]) => {
                setIngredientsList(allIngredientsData);
                setPaginationData(pagination)
                 
            })
            .catch((error) => {
                console.error(error);
            });
    };

      //pagination
      const handlePageChange = async(newPage) => {
        setCurrentPage(newPage);
        console.log("handlepagechange, newpage: ",newPage);
        fetchIngredientsData({
            page: newPage,
            limit: currentLimit,
        });
       
    };
        
    const handleLimitChange = (newValue) => {
        setCurrentLimit(newValue);
        console.log("handlelimitchange: new value",newValue);
        fetchIngredientsData({
            limit: newValue,
            page: 1
        });
    };

    const closeModals=()=>{
        setEditModalOpen(false);
        setDeleteModalOpen(false);
      };

    //delete 
    const openDeleteModal=(ingredient)=>{
        setIngredientToDelete(ingredient);
        setDeleteModalOpen(true);
        //console.log("opendeletemode");
        //.log("ingredient in opendeletemodal",ingredient);
      };

      const handleDeleting=async()=>{
        if (ingredientToDelete) {
          const ingredientId = ingredientToDelete.id;
          await deleteIngredient(ingredientId);
          //console.log("ingredientid in handle deleting", ingredientId);
          setRefreshData(!refreshData);
          navigate('/ingredients');
        }
      };

      const navigateToAddIngredient=async()=>{
        navigate('/add-ingredient');
      };

    
    

    return(
        <div   style={{ marginTop: '6rem' }} >
            {currentUser&& currentUser.role=="admin"?(
                <Card className="mb-2">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <h5>Add Ingredient!</h5>
                  <button 
                  className="btn btn-md default-button"
                  onClick={navigateToAddIngredient}
                  >
                    ADD
                  </button>
                </Card.Body>
              </Card>
            ):null}
           
        <table className="table p-3 table-hover table-striped table-responsive table-bordered border-3">
        <thead>
        <tr className="table-header purple-table text-center border">
        <th className="purple-table border" scope="col">Ingredient</th>
        <th className="purple-table" scope="col">Calories (per 100g)</th>
        <th className="purple-table" scope="col">Gluten Free</th>
        <th className="purple-table" scope="col">Vegan</th>
        <th className="purple-table" scope="col">Vegetarian</th>
        <th className="purple-table" scope="col">Halal</th>
        <th className="purple-table" scope="col">Kosher</th>

        {currentUser&&currentUser.role=="admin"?(
            <>
            <th className="purple-table" scope="col">Edit</th>
        <th className="purple-table" scope="col">Delete</th>
            </>

        ):null}
        </tr>
        </thead>
        <tbody>
            {ingredientsList &&ingredientsList.map((ingredient)=>(
                <tr key={ingredient.id}>
                      {deleteModalOpen&&(
                  <DeleteConfirmationModal
                  item={ingredient}
                  closeModal={closeModals}
                  onDelete={()=>{handleDeleting()}}
                  onShow={deleteModalOpen}
                  />
                )}
                    <td className="text-center text-dark border">{ingredient.name}</td>
                    <td className="text-center">{ingredient.calories}</td>
                    <td className="text-center">
                        {ingredient.glutenFree?(
                            <FontAwesomeIcon icon={faCheck} style={{color:"green"}}/>
                        ):(
                            <FontAwesomeIcon icon={faTimes} style={{color:"red"}}/>
                        )}
                    </td>
                    <td className="text-center">
                        {ingredient.vegan?(
                            <FontAwesomeIcon icon={faCheck} style={{color:"green"}}/>
                        ):(
                            <FontAwesomeIcon icon={faTimes} style={{color:"red"}}/>
                        )}
                    </td>
                    <td className="text-center">
                        {ingredient.vegetarian?(
                            <FontAwesomeIcon icon={faCheck} style={{color:"green"}}/>
                        ):(
                            <FontAwesomeIcon icon={faTimes} style={{color:"red"}}/>
                        )}
                    </td>
                    <td className="text-center">
                        {ingredient.halal?(
                            <FontAwesomeIcon icon={faCheck} style={{color:"green"}}/>
                        ):(
                            <FontAwesomeIcon icon={faTimes} style={{color:"red"}}/>
                        )}
                    </td>
                    <td className="text-center">
                        {ingredient.kosher?(
                            <FontAwesomeIcon icon={faCheck} style={{color:"green"}}/>
                        ):(
                            <FontAwesomeIcon icon={faTimes} style={{color:"red"}}/>
                        )}
                    </td>

                    {currentUser&& currentUser.role=="admin"?(
                        <>
                      <td className="text-center">
      <div className="d-flex justify-content-center">
        <button className="btn btn-sm green-button">Edit</button>
      </div>
    </td>
    <td className="text-center">
      <div className="d-flex justify-content-center">
        <button className="btn btn-sm green-button"
        onClick={()=>openDeleteModal(ingredient)}>Delete</button>
      </div>
    </td>
                        </>
                    ):null}
                </tr>
            ))}
        </tbody>
        </table>
        
        <Pagination
                paginationData={paginationData}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    );
};

export default DisplayIngredients;
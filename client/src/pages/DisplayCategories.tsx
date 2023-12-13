import React, { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories, updateCategory } from "../services/category.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "../pagination/pagination";
import "../css/components.css";
import { useAuth } from "../auth";
import { Card, Col, Modal, Row } from "react-bootstrap";

import "../css/components.css";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import * as Yup from 'yup';
import {useFormik} from 'formik';
import { showErrorMessage } from "../message/errorMessage";
import { showSuccessMessage } from "../message/successMessage";
import clsx from 'clsx';


const DisplayCategories=()=>{

    //categories data
    const [categories,setCategories]=useState([]);
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState({});
    const [currentLimit, setCurrentLimit] = useState(10);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [refreshData, setRefreshData] = useState(false); 

    const [isEditMode,setIsEditMode]=useState(false);

    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
        setIsModalOpen(true);
    };

    const {currentUser,logout}=useAuth();
    const navigate=useNavigate();

    //categories data

    useEffect(()=>{
        fetchCategoriesData({});
    },[refreshData]);

    const fetchCategoriesData = (filterOptions) => {
        getCategories(filterOptions)
            .then(([pagination, allCategoriesData]) => {
                setCategories(allCategoriesData);
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
        fetchCategoriesData({
            page: newPage,
            limit: currentLimit,
        });
       
    };
        
    const handleLimitChange = (newValue) => {
        setCurrentLimit(newValue);
        console.log("handlelimitchange: new value",newValue);
        fetchCategoriesData({
            limit: newValue,
            page: 1
        });
    };
    

    const closeModals=()=>{
      setEditModalOpen(false);
      setDeleteModalOpen(false);
    };

  //delete 
  const openDeleteModal=(category)=>{
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
    //console.log("opendeletemode");
    //.log("category in opendeletemodal",category);
  };

  const handleDeleting=async()=>{
    if (categoryToDelete) {
      const categoryId = categoryToDelete.id;
      await deleteCategory(categoryId);
      //console.log("categoryid in handle deleting", categoryId);
      setRefreshData(!refreshData);
      navigate('/categories');
    }
  };
    const navigateToAddCategory=async()=>{
      navigate('/add-meal-category');
    };

    //edit 

    const handleEditClick = (categoryId) => {
      setCategoryIdToEdit(categoryId);
    };

    const manageCategoriesSchema=Yup.object().shape({
      name:Yup.string().required('Name is required!'),
      description:Yup.string().required('Description is required!')
  });

  const initialValues={
      name:'',
      description:''
  };

  const [loading,setLoading]=useState(false);
  const [isFormSubmitted,setFormSubmitted]=useState(false);
  const [error, setError] = useState('');

  const formik=useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema:manageCategoriesSchema,
      onSubmit:async(values,{setSubmitting})=>{
          try{
             console.log("onsubmit");
              await updateCategory(currentUser.id.toString(),{
                  name:values.name,
                  description:values.description,
              });
              setCategoryIdToEdit(null);
              setIsEditMode(false);
              showSuccessMessage("Successfully updated data!");
          }catch(error){
              console.log("error: ",error);
              showErrorMessage("Error occurred while updating data!!!");
          }
      }
  });

  const edidata=async()=>{
    try{
      console.log("onsubmit");
       await updateCategory(currentUser.id.toString(),{
           name:formik.values.name,
           description:formik.values.description,
       });
       setCategoryIdToEdit(null);
       setIsEditMode(false);
       showSuccessMessage("Successfully updated data!");
   }catch(error){
       console.log("error: ",error);
       showErrorMessage("Error occurred while updating data!!!");
   }
  }
  
    return (
        <div style={{ marginTop: '6rem' }}>
          <Row className="d-flex align-items-stretch">
          {currentUser&& currentUser.role=="admin"?(
                <Card className="mb-2">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <h5>Add Category!</h5>
                  <button 
                  className="btn btn-md default-button"
                  onClick={navigateToAddCategory}
                  >
                    ADD
                  </button>
                </Card.Body>
              </Card>
            ):null}
            {categories && categories.map((category) => (
              <Col className="my-2" key={category.id} xs={12} md={12}>
                 {deleteModalOpen&&(
                  <DeleteConfirmationModal
                  item={category}
                  closeModal={closeModals}
                  onDelete={()=>{handleDeleting()}}
                  onShow={deleteModalOpen}
                  />
                )}

{categoryIdToEdit === category.id ?(
          <div>
            <form
           className="form w-100 p-3 default-border fv-plugins-bootstrap5 fv-plugins-framework bg-white"
            onSubmit={formik.handleSubmit}
              >
                <div className='row fv-row mb-7'>
                    <div className='col-xl-12'>
                        <label className='form-label fw-bolder text-dark fs-6'>Name</label>
                        <input
                          id="name"
                          placeholder={category.name}
                          name="name"
                          value={category.name}
                            type='text'
                            autoComplete='off'
                            {...formik.getFieldProps('name')}
                            className={clsx(
                                'form-control form-control-lg',  )}
                        />
                    </div>
                </div>

                {/* begin::Form group Description */}
<div className='row fv-row mb-7'>
<div className='col-xl-12'>
<label className='form-label fw-bolder text-dark fs-6'>Description</label>
<input
    placeholder={category.description}
    type='text'
    autoComplete='off'
    {...formik.getFieldProps('description')}
    className={clsx(
        'form-control form-control-lg'
    )}
/>

</div>
</div>
{/* end::Form group */}

 
       
        <button
                type='submit'
                id='kt_edit_category_submit'
                className='btn btn-lg default-button w-100 mb-5 mt-3'
                onClick={edidata}
                >
                Submit
            </button>

            </form>
            </div>
     )  :(
        <Card
                  className="p-3 default-border mt-10 flex-fill"
                  style={{ marginTop: '1%', marginLeft: '1%', marginRight: '1%' }}
                >
                     <Card.Title className="text-center">{category.name}
                     
                     
                     {currentUser && currentUser.role === "admin" ? (
                      <React.Fragment>
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            className="btn btn-lg default-button"
                            onClick={() => handleEditClick(category.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-lg green-button"
                            onClick={()=>openDeleteModal(category)}
                          >
                            Delete
                          </button>
                        </div>
                      </React.Fragment>
                    ) : null}
                     </Card.Title>
               
                  <Card.Body>
               
<div className="col-md-12 d-flex align-items-center justify-content-center">
                <div className="text-center ">
                  <div>
                    <label className="form-label fs-6 fw-bolder text-dark text-center">Description:</label>
                    <Card.Text style={{ maxHeight: '100%', overflowY: 'auto' }}>{category.description}</Card.Text>
                  </div>
                </div>
              </div>


                  </Card.Body>
                </Card>
     )}
             
              </Col>
            ))}
          </Row>
         
          <Pagination
            paginationData={paginationData}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
          
        </div>
      );
      
};

export default DisplayCategories;
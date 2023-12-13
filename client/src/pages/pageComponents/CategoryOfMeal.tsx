import React,{useState,useEffect} from "react";
import { getCategory } from "../../services/category.service";
import { Card } from "react-bootstrap";

const CategoryOfMeal=({categoryId})=>{

    const [category,setCategory]=useState(null);

    useEffect(()=>{
        if(categoryId){
            getCategory(categoryId)
            .then((categoryData)=>{
                setCategory(categoryData);
            })
            .catch((error)=>{
                console.error("Error fetching category information", error);
            });
        }
    },[categoryId]);

return(
    
       <div className="p-1 meal-category-badge">
         {category?(
            <div>
                {category.name}
            </div>
        ):null}

       </div>
    
);
};

export default CategoryOfMeal;
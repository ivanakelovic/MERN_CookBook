import React, { useEffect, useState } from "react";
import { getIngredient } from "../../services/ingredient.service";
import "../../css/components.css";


const RecipeIngredients = ({ ingredients }) => {
  const [ingredientNames, setIngredientNames] = useState([]);

  useEffect(() => {
    const fetchIngredientNames = async () => {
      const names = await Promise.all(
        ingredients.map(async (ingredient) => {
          const ingredientData = await getIngredient(ingredient.ingredient);
          return `${ingredientData.name} - ${ingredient.measure}`;
        })
      );
      setIngredientNames(names);
    };

    fetchIngredientNames();
  }, [ingredients]);

  return (
    <div>
     <ul className="">
        {ingredientNames.map((name, index) => (
          <li
          className="list-item"
           key={index}
           >
            {name}
           </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;

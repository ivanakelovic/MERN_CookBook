import React from "react";
import Select from "react-select";
import "../../css/components.css";


const IngredientRow = (props) => {
  const { index, ingredients, formik,onIngredientChange, onMeasureChange, onRemove } = props;

  const ingredientOptions = ingredients.map((ingredient) => ({
    value: ingredient.id,
    label: ingredient.name,
  }));


  return (
    <div className="fv-row d-flex align-items-center mx-2 my-2">
      <Select
        className="w-50 h-50"
        options={ingredientOptions}
        onChange={(selectedOption: { value: string }) => {
          onIngredientChange(selectedOption);
          formik.setFieldValue(`ingredients[${index}].ingredient`, selectedOption.value);
        }}
        placeholder="Add ingredient"
      />
      <input
        className="mx-2 form-control form-control-lg"
        type="text"
        placeholder="Measuring info"
        onChange={(e) => {
          onMeasureChange(e.target.value);
          formik.setFieldValue(`ingredients[${index}].measure`, e.target.value);
        }}
      />
      <button
        className="default-button btn btn-md mx-2"
        type="button"
        onClick={() => {
          onRemove();
          formik.setFieldValue('ingredients', formik.values.ingredients.filter((_, i) => i !== index));
        }}
      >
        Remove
      </button>
    </div>
  );
};

export default IngredientRow;

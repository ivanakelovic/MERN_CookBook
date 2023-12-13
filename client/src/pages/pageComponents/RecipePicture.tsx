import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { fetchPicture } from "../DisplayRecipes";
import { ObjectFlags } from "typescript";


const RecipePicture = ({ src, alt,width,height,objectFit}) => {
  const [picture, setPicture] = useState(null);

  useEffect(() => {
      fetchPicture(src).then((pictureDisplay) => {
      setPicture(pictureDisplay);
    });
  }, [src]);
  

  return picture ? (
    <Card.Img
      src={picture}
      className="p-3 mx-auto d-block recipe-photo d-flex justify-content-center align-items-center col-md-12 col-sm-12"
      style={{ width: width, height: height,objectFit:objectFit }}
      alt={alt}
    />
  ) : null;
};

export default RecipePicture;

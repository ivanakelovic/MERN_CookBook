import React, { useEffect, useState } from "react";
import { getUser } from "../../services/user.service";
import { Card } from "react-bootstrap";

const AuthorOfRecipe = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      getUser(userId)
        .then((userData) => {
          setUser(userData); 
        })
        .catch((error) => {
          console.error("Error fetching user information", error);
        });
    }
  }, [userId]);

  return (
    <div>
      {user ? (
        <Card.Text>{user.firstName} {user.lastName}</Card.Text> 
      ) : null}
    </div>
  );
};

export default AuthorOfRecipe;

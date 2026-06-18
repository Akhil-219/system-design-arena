import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({children}) {
    const {user , loading} =useAuth();
    if(loading){
        return <p>Please wait loading</p>
    }
    if(!user){
       return <Navigate to="/login" />;
    }

  return children;
}

export default ProtectedRoutes;

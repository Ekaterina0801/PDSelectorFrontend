import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
const Registration = () => {
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const submitRole = async () => {
    try {
        const userId = await getUserIdFromServer();  
        console.log(userId); 
        
        if (!role) {
            alert("Пожалуйста, выберите роль!");
            return;
        }
        console.log(role);


        const roleDto = { name: role };  


        await axios.post(`${API_BASE_URL}/users/${userId}/assign-role`, roleDto, { withCredentials: true });

        navigate("/teams"); 
    } catch (error) {
        console.error("Ошибка при назначении роли:", error);
        alert("Произошла ошибка. Попробуйте снова.");
    }
};

  
  const getUserIdFromServer = async () => {
    const response = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
    console.log(response);
    return response.data.id;
  };
  


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Выберите вашу роль</h1>
      <div style={{ margin: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: role === "STUDENT" ? "#4CAF50" : "#f0f0f0",
          }}
          onClick={() => handleRoleSelect("STUDENT")}
        >
          Студент
        </button>
        <button
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: role === "JURY" ? "#4CAF50" : "#f0f0f0",
          }}
          onClick={() => handleRoleSelect("JURY")}
        >
          Жюри
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff" }}
          onClick={submitRole}
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
};

export default Registration;

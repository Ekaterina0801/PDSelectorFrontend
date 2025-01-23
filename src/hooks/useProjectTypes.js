import { useState, useEffect } from "react";
import { fetchProjectTypes } from "../api/apiProjectTypes";
export const useProjectTypes = () => {
    const [allTypes, setAllTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [errorTypes, setErrorTypes] = useState(null);
    console.log('enter');
    useEffect(() => {
      const getTypes = async () => {
        try {
          const data = await fetchProjectTypes();  
          setAllTypes(data);
        } catch (err) {
          setErrorTypes(err.message);
        } finally {
          setLoadingTypes(false);
        }
      };
  
      getTypes();
    }, []);
    console.log('all', allTypes);
    return { allTypes, loadingTypes, errorTypes };
  };
import { useState, useEffect } from 'react';
import { fetchTechnologies } from '../api/apiTechnologies';

export const useTechnologies = () => {
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [loadingTechnologies, setLoadingTechnologies] = useState(true);
  const [errorTechnologies, setErrorTechnologies] = useState(null);

  useEffect(() => {
    const getTechnologies = async () => {
      try {
        const data = await fetchTechnologies();  
        setAllTechnologies(data);
      } catch (err) {
        setErrorTechnologies(err.message);
      } finally {
        setLoadingTechnologies(false);
      }
    };

    getTechnologies();
  }, []);

  return { allTechnologies, loadingTechnologies, errorTechnologies };
};


import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const useTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Заглушка с моковыми данными
        const fetchedTracks = [
          { id: 1, name: "Бакалавры 2023-2024" },
          { id: 2, name: "Бакалавры 2024-2025" },
          { id: 3, name: "Магистранты 2023-2024" },
        ];
        setTracks(fetchedTracks);

        const savedTrackId = Cookies.get("trackId");
        console.log('savedTrackId:', savedTrackId);

        const defaultTrackId = 1;

        // Проверка сохраненного TrackId, если нет, ставим значение по умолчанию
        if (savedTrackId && fetchedTracks.some(track => track.id === Number(savedTrackId))) {
          setSelectedTrack(Number(savedTrackId));
        } else {
          setSelectedTrack(defaultTrackId); // Устанавливаем значение по умолчанию
          Cookies.set("trackId", defaultTrackId); // Сохраняем его в cookies
        }
      } catch (err) {
        setError("Ошибка при загрузке лиг");
        console.error("Error loading leagues:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return {
    tracks,
    selectedTrack,
    setSelectedTrack,
    isLoading,
    error,
  };
};

export default useTracks;

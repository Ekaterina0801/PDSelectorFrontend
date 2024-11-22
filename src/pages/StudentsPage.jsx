import React, { useEffect, useState } from 'react';
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/search-bar/SearchBar";
import Card from "../components/card/Card";
import Filter from "../components/forms/Filter";
import MainContent from "../components/main-section/MainSection";
import { fetchStudents } from '../controllers/apiStudentsController';
import Header from '../components/header/Header';
const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents(1);
        console.log(data);
        setStudents(data);
      } catch (error) {
        console.error('Ошибка загрузки данных студентов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
    console.log(students);
  }, []);

  return (
    <>
     <Header />
      <Navbar />
      <SearchBar />
      <div className="container">
        <Filter />
        <MainContent>
        <h1>Участники</h1>
          <div className="cards">
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              students.map((student) => (
                <Card
                  key={student.id}
                  name={student.user.fio}
                  resume={student.about_self}
                  tags={student.technologies}
                />
              ))
            )}
          </div>
        </MainContent>
      </div>
    </>
  );
};

export default StudentsPage;

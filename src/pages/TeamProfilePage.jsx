import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card/Card";
import MainContent from "../components/main-section/MainSection";
const studentsData = [
    {
      id: 1,
      name: 'Иван Иванов',
      resume: 'Опытный разработчик с большим опытом в разработке веб-приложений и API.',
      tags: ['JavaScript', 'React', 'Node.js']
    },
    {
      id: 2,
      name: 'Петр Петров',
      resume: 'Специалист по базам данных с глубоким пониманием SQL и оптимизации запросов.',
      tags: ['SQL', 'PostgreSQL', 'Database Design']
    },
    {
      id: 3,
      name: 'Анна Смирнова',
      resume: 'Дизайнер UI/UX с креативным подходом и опытом работы с продуктами.',
      tags: ['UI/UX', 'Adobe XD', 'Figma']
    },
    {
      id: 4,
      name: 'Мария Сидорова',
      resume: 'Маркетолог с навыками анализа данных и работы с рекламными кампаниями.',
      tags: ['Marketing', 'SEO', 'Google Analytics']
    },
  ];
const TeamProfilePage = () => {
    return (
      <>
        <Navbar />  
        <h1>Профиль команды</h1>
        <div className="container">
       
            <MainContent>
            <h2>Участники команды</h2>
            <div className="cards">
              {studentsData.map((student) => (
                <Card
                  key={student.id}
                  name={student.name}
                  resume={student.resume}
                  tags={student.tags}
                
                />
              ))}
            </div>
            </MainContent>
            <MainContent>
            <h2>Поданные заявки</h2>
            <div className="cards">
              {studentsData.map((student) => (
                <Card
                  key={student.id}
                  name={student.name}
                  resume={student.resume}
                  tags={student.tags}
                  showAccept={true}
                  showDecline={true}

                />
              ))}
            </div>
            </MainContent>

        </div>
      </>
    );
  };
  
  export default TeamProfilePage;

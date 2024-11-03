// MainContent.js
import React from 'react';
import Card from '/src/components/card/Card';
import './style.css';

const productData = [
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

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="cards">
        {productData.map((product) => (
          <Card 
            key={product.id} 
            name={product.name} 
            resume={product.resume} 
            tags={product.tags} 
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;


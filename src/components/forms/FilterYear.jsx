import './style.css';
const FilterYear = () => {
  return (
    <div className="filter-years">
        <span>Выберите трек:</span>
    <select name="user_profile_color_1">
        <option value="1">Бакалавры 2023-2024</option>
        <option value="2">Магистры 2023-2024</option>
    </select>
    </div>
  );
};
export default FilterYear;

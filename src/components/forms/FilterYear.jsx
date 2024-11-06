import './style.css';
const FilterYear = () => {
  return (
    <div className="filter-years">
        <span>Выберите год:</span>
    <select name="user_profile_color_1">
        <option value="1">2020</option>
        <option value="2">2021</option>
        <option value="3">2022</option>
        <option value="4">2023</option>
        <option value="5">2024</option>
        <option value="6">2025</option>
    </select>
    </div>
  );
};
export default FilterYear;

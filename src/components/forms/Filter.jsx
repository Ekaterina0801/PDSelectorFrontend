import './style.css';
const Filter = () => {
  return (
    <div className="filter-section">
      <h2>Фильтры</h2>
      {/* Фильтр по цвету */}
      <div className="filter-group">
        <h3>Цвет</h3>
        <label>
          <input type="checkbox" name="color" value="синий" />
          <span
            className="color-circle color-blue"
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              backgroundColor: "blue",
              borderRadius: "50%",
              marginRight: "5px",
            }}
          ></span>
          синий
        </label>
        <label>
          <input type="checkbox" name="color" value="красный" />
          <span
            className="color-circle color-red"
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              backgroundColor: "red",
              borderRadius: "50%",
              marginRight: "5px",
            }}
          ></span>
          красный
        </label>
        <label>
          <input type="checkbox" name="color" value="зеленый" />
          <span
            className="color-circle color-green"
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              backgroundColor: "green",
              borderRadius: "50%",
              marginRight: "5px",
            }}
          ></span>
          зеленый
        </label>
      </div>

      {/* Фильтр по размеру */}
      <div className="filter-group">
        <h3>Фильтр 1</h3>
        <label>
          <input type="checkbox" name="size" value="маленький" /> 1
        </label>
        <label>
          <input type="checkbox" name="size" value="средний" /> 2
        </label>
        <label>
          <input type="checkbox" name="size" value="большой" /> 3
        </label>
      </div>

      {/* Фильтр по цене */}
      <div className="filter-group">
        <h3>Фильтр 2</h3>
        <div className="price-range">
          <input type="number" placeholder="от" min="0" />
          <input type="number" placeholder="до" min="0" />
        </div>
        <input type="range" className="slider" min="0" max="1000" />
      </div>

      <button className="show-button">Показать</button>
    </div>
  );
};
export default Filter;

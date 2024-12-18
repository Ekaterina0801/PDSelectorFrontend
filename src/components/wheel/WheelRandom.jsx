import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import * as d3 from "d3";
import confetti from 'canvas-confetti';
import Modal from "../modal/Modal";

function WheelRandom(teamsData) {
  const [data, setData] = useState([]); //команды из БД
  const [rotation, setRotation] = useState(0);
  const [oldRotation, setOldRotation] = useState(0);
  const [svgCircle, setSvgCircle] = useState();
  const [onButton, setOnButton] = useState(false);
  const [sectorsAngles, setSectorsAngles] = useState([]);
  const [winSector, setWinSector] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comandWinner, setComandWinner] = useState();
  

  useEffect(() => {
    let newData = [];
    let dataAngles = [];
    let all_quantity = 0;

    for (let item of teamsData.teamsData) {
      let oneCommand = { name: item.name, value: 1 };
      all_quantity += item.quantity_of_students;
      newData.push(oneCommand);
    }

    let angle = 360 / newData.length;

    for (let item of teamsData.teamsData) {
      let infoSector = { name: item.name, angle: angle };
      dataAngles.push(infoSector);
    }

    setData(newData);
    setSectorsAngles(dataAngles);
  }, [teamsData.teamsData]);

  const svgRef = useRef(null);
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = "";
    }
    // Specify the chart’s dimensions.
    const width = 400;
    const height = Math.min(width, 400);

    // Create the color scale.
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );

    // Create the pie layout and arc generator.
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

    const labelRadius = arc.outerRadius()() * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const arcs = pie(data);

    // Create the SVG container.
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Add a sector path for each value.
    svg
      .append("g")
      .attr("stroke", "white")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

    // Create a new arc generator to place a label close to the edge.
    // The label shows the value if there is enough room.
    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
      );

    setSvgCircle(svg);

    var sym = d3.symbol().type(d3.symbolTriangle).size(500);
    d3.select("#gfg")
      .append("path")
      .attr("d", sym)
      .attr("fill", "black")
      .attr("transform", "translate(20, 20) rotate(180)");
  }, [data]);

  useEffect(() => {
    console.log("rotation-povorot: ", rotation);
    if (!!svgCircle) {
      svgCircle
        .transition()
        .duration(3000) // Длительность анимации
        .attrTween("transform", () =>
          d3.interpolateString(`rotate(${oldRotation})`, `rotate(${rotation})`)
        );
        
        setTimeout(() => {
          setOnButton(true);
          confetti("tsparticles");

          

          setIsModalOpen(true);
        }, 3000);
    }
  }, [rotation]);

  const handleSpin = () => {
    // Увеличиваем угол вращения
    setOnButton(false);
    setOldRotation(rotation);
    console.log("rotation????????: ", rotation);
    let newRotation = rotation + 720 + Math.floor(Math.random() * 360) + 1;
    setRotation(newRotation);
    console.log("rotation????????: ", rotation);
    winComand(newRotation);
  };

  const winComand = (newRotation) => {
    let angleOfRotation = newRotation % 360;
    angleOfRotation = 360 - angleOfRotation;
    let sumOfAngles = 0;
    let index_i = 0;
    console.log("sectorsAngles!!!!!!!: ", sectorsAngles);
    console.log("angleOfRotation!!!!!!!: ", angleOfRotation);
    console.log("rotation!!!!!!!: ", newRotation);

    if (angleOfRotation > 0) {
      while (sumOfAngles < angleOfRotation) {
        sumOfAngles += sectorsAngles[index_i].angle;
        index_i++;
      }
      setWinSector(sectorsAngles[index_i - 1].name);
    } else {
      setWinSector(sectorsAngles[index_i].name);
    }
  };

  useEffect(() => {
    {/*console.log("winSectorwinSectorwinSectorwinSector: ", winSector);*/}
    for (let item of teamsData.teamsData) {
      if(item.name==winSector){
        setComandWinner(item);
      }
    }
  }, [winSector]);

  const renderModal = () => (
    <>
    {console.log("comandWinner: ", comandWinner)}
      <h3>Информация о команде</h3>
      <div className="form-group-modal">
        <label>Название: </label>
        <span>{comandWinner.name}</span>
      </div>
      <div className="form-group-modal">
        <label>Информация: </label>
        <span>{comandWinner.project_description}</span>
      </div>
      <div className="form-group-modal">
        <label>Текущее количество участников: </label>
        <span>{comandWinner.quantity_of_students}</span>
      </div>
      <div className="form-group-modal">
      <label>Технологии: </label>
      {comandWinner.technologies.length > 0 ? (
            comandWinner.technologies.map((tag, index) => (
              <span key={index} className="card-tag">
                {tag.name}
              </span>
            ))
          ) : (
            <p className="no-tags">Нет указанных технологий</p>
          )}
      </div>
      <div className="modal-footer">
        <button type="button" onClick={() => setIsModalOpen(false)}>
          Закрыть
        </button>
      </div>
      </>
  );

  return (
    <div className="wheelRandomComand">
      <svg id="gfg" width="40" height="40"></svg>
      <div ref={svgRef}></div>
      <button className="action-button-wheel" onClick={handleSpin}>
        Вращать колесо
      </button>
      <p className="winner">Победитель:</p>
      {onButton && <p className="winner">{winSector}</p>}
      {isModalOpen &&
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {renderModal()}
      </Modal>
      }
      
    </div>
  );
}

export default WheelRandom;

import "./section.css"

function SectionMovie({title}) {
  return (
    <div className="d-flex align-items-center gap-2 text-white flex-row my-4 container">
      {/* <div className="rounded-circle bg-danger bg-gradient" style={{ width: "12px", height: "12px" }}></div> */}
      <span className="title">{title}</span>
    </div>
  );
}

export default SectionMovie;
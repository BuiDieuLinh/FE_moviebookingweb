import "./section.css";

function SectionMovie({ title }) {
  return (
    <div className="d-flex align-items-center gap-2 text-white flex-row my-4 container">
      <span className="title">{title}</span>
    </div>
  );
}

export default SectionMovie;

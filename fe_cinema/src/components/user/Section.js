import Nav from 'react-bootstrap/Nav';
import "./section.css"

function SectionMovie() {
  return (
    <Nav variant="underline" defaultActiveKey="/now-showing" className="movie-nav">
      <Nav.Item>
        <Nav.Link href="/coming-soon">Phim Sắp Chiếu</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/now-showing">Phim Đang Chiếu</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Suất chiếu đặc biệt
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SectionMovie;
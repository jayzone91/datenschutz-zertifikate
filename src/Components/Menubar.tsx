import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Menubar() {
  const { data: sessionData } = useSession();

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} href="/">
          No Name
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" variant="tabs">
            <Nav.Link as={Link} href="/">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} href="/readings">
              Lese Stoff
            </Nav.Link>
            <Nav.Link as={Link} href="/tests">
              Aufgaben
            </Nav.Link>
          </Nav>
          <Nav>
            {sessionData ? (
              <NavDropdown
                id="profile-dropdown"
                title={sessionData.user.name ?? ""}
                menuVariant="dark"
              >
                <NavDropdown.Item
                  as={Link}
                  href={`/user/${sessionData.user.id}/`}
                >
                  Konto
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Andere Dinge
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => void signOut()}>
                  Abmelden
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button onClick={() => void signIn()}>Anmelden</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

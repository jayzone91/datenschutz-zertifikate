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
            {sessionData && (
              <>
                <Nav.Link as={Link} href="/courses">
                  Kurse
                </Nav.Link>
                <Nav.Link as={Link} href="/certificates">
                  Zertifikate
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {sessionData ? (
              <NavDropdown
                id="profile-dropdown"
                title={sessionData.user.name ?? ""}
                menuVariant="dark"
              >
                {sessionData.user.is_admin && (
                  <NavDropdown.Item as={Link} href={`/Admin/`}>
                    Admin
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} href={`/user/`}>
                  Konto
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href={`/courses/`}>
                  Meine Kurse
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href={`/certificates/`}>
                  Meine Zertifikate
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

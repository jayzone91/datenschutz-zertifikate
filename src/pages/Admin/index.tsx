import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button, Col, Container, Row } from "react-bootstrap";
import { MAIN_TITLE } from "~/Config";

export default function AdminOverview() {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return (
      <>
        <Head>
          <title>Admin - User | {MAIN_TITLE}</title>
        </Head>
        <Container>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin | {MAIN_TITLE}</title>
      </Head>
      <Container>
        <h1>Admin</h1>
        <Row className="mt-5 mb-5 g-5">
          <Col>
            <Row>
              <Link href="/Admin/User" className="btn btn-outline-primary">
                Benutzer
              </Link>
            </Row>
          </Col>
          <Col>
            <Row>
              <Link
                href="/Admin/Certificates"
                className="btn btn-outline-danger"
              >
                Zertifikate
              </Link>
            </Row>
          </Col>
        </Row>
        <Row className="g-5 mb-5">
          <Col>
            <Row>
              <Link href="/Admin/Courses" className="btn btn-outline-secondary">
                Kurse
              </Link>
            </Row>
          </Col>
          <Col>
            <Row>
              <Link href="/Admin/Modules" className="btn btn-outline-warning">
                Module
              </Link>
            </Row>
          </Col>
        </Row>
        <Row className="g-5 mb-5">
          <Col>
            <Row>
              <Link href="/Admin/Textx" className="btn btn-outline-info">
                Texte
              </Link>
            </Row>
          </Col>
          <Col>
            <Row>
              <Link href="/Admin/Questions" className="btn btn-outline-success">
                Aufgaben
              </Link>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

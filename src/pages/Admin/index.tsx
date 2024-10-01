import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import Breadcrumb from "~/Components/Breadcrumb";
import { MAIN_TITLE } from "~/Config";
import CheckAdmin from "./_components/CheckAdmin";

export default function AdminOverview() {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  return (
    <>
      <Head>
        <title>Admin | {MAIN_TITLE}</title>
      </Head>

      <Breadcrumb />

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
            <Link href="/Admin/Certificates" className="btn btn-outline-danger">
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
            <Link href="/Admin/Texts" className="btn btn-outline-info">
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
    </>
  );
}

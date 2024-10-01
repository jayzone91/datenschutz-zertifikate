import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { MAIN_TITLE } from "~/Config";

export default function UserPage() {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) {
    return (
      <>
        <Head>
          <title>User bearbeiten | {MAIN_TITLE}</title>
        </Head>
        <>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {sessionData?.user.name} | {MAIN_TITLE}
        </title>
      </Head>
      <h1>Mein Profil</h1>
      <p>Name: {sessionData?.user.name}</p>
      <p>Email: {sessionData?.user.email}</p>
      <p>Rolle: {sessionData?.user.is_admin ? "Admin" : "Benutzer"}</p>
      <Row className="mb-3">
        <Link href="/courses">Meine Kurse</Link>
      </Row>
      <Row className="mb-3">
        <Link href="/certificates">Meine Zertifikate</Link>
      </Row>
      <Row className="mb-3">
        <Col>
          <Link
            className="btn btn-primary"
            href={`/user/edit/${sessionData.user.id}`}
          >
            Profil Bearbeiten
          </Link>
        </Col>
      </Row>
    </>
  );
}

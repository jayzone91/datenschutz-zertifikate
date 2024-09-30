import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { Button, Container } from "react-bootstrap";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function EditUserPage() {
  const { data: sessionData } = useSession();
  const user = api.user.get.useQuery();

  if (!sessionData || !sessionData.user) {
    return (
      <Container>
        <h1 className="test-center">Bitte erst anmelden!</h1>
        <Button onClick={() => void signIn()}>Anmelden</Button>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>
          {sessionData?.user.name} bearbeiten | {MAIN_TITLE}
        </title>
      </Head>
      <div>{sessionData?.user.name}</div>
    </>
  );
}

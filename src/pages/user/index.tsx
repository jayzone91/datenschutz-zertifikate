import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "react-bootstrap";
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
      <div>{sessionData?.user.name}</div>
      <Link
        className="btn btn-primary"
        href={`/user/edit/${sessionData.user.id}`}
      >
        Bearbeiten
      </Link>
    </>
  );
}

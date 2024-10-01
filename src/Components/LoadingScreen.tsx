import Head from "next/head";
import { Container, Spinner } from "react-bootstrap";
import { MAIN_TITLE } from "~/Config";

export default function LoadingScreen({ title }: { title: string }) {
  return (
    <>
      <Head>
        <title>
          {title} | {MAIN_TITLE}
        </title>
      </Head>
      <Container className="text-center">
        <h1 className="mt-5">Loading...</h1>
        <Spinner animation="border" variant="secondary" />
      </Container>
    </>
  );
}

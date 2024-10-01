import { Container } from "react-bootstrap";

export default function ErrorScreen({ error }: { error: string }) {
  return (
    <>
      <Container className="text-center">
        <h1 className="mt-5">Error...</h1>
        <p>{error}</p>
      </Container>
    </>
  );
}

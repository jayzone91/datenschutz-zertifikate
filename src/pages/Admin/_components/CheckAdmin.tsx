import { signIn } from "next-auth/react";
import { Button } from "react-bootstrap";

export default function CheckAdmin() {
  return (
    <>
      <h1 className="test-center">Bitte erst anmelden!</h1>
      <Button onClick={() => void signIn()}>Anmelden</Button>
    </>
  );
}

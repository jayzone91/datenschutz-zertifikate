import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Table,
} from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>{MAIN_TITLE}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mt-5">
          <UsernameForm />
        </div>
      </main>
    </>
  );
}

function UsernameForm() {
  const { data: sessionData } = useSession();
  const userUpdate = api.user.updateName.useMutation();
  const [name, setName] = useState("");

  const saveUsername = async () => {
    await userUpdate.mutateAsync({
      name,
    });
  };

  return (
    <div>
      {sessionData && !sessionData.user.name ? (
        <>
          <h2 className="text-center">Gib deinen Namen ein:</h2>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup className="mb-3">
              <FormLabel htmlFor="name">Vor- & Nachname</FormLabel>
              <FormControl
                type="text"
                name="name"
                id="name"
                placeholder="Max Muster"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <Button onClick={saveUsername}>Speichern</Button>
          </Form>
        </>
      ) : (
        <>
          <h1>{sessionData && <span>Hallo {sessionData.user.name}</span>}</h1>
          <p>
            Beim bearbeiten der Kurse bitte beachten: Die Kurse werden nicht
            zwischengespeichert. Wenn du die Seite verlässt, wird dein
            Fortschritt nicht gespeichert.
          </p>
          <p>
            Die Kurse sind kurz gehalten. Bitte bearbeite diese am Stück um
            Datenverlust zu vermeiden.
          </p>
          <p>
            Beim bestehen eines Kurses wird ein Zertifikat erstellt. Dieses
            kannst du dir als PDF runterladen.
          </p>
          <LatestModules />
        </>
      )}
    </div>
  );
}

function LatestModules() {
  const { data: sessionData } = useSession();
  const courses = api.course.getUncompleted.useQuery();

  if (courses.isLoading) return <LoadingScreen title="" />;
  if (courses.error) return <ErrorScreen error={courses.error.message} />;

  if (sessionData)
    return (
      <div className="mt-2">
        <h2 className="mt-2 mb-3">Aktuelle Kurse</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Anzahl der Module</th>
              <th>Anzahl der Fragen</th>
            </tr>
          </thead>
          <tbody>
            {courses.data?.map((kurs) => (
              <tr key={kurs.id}>
                <td>
                  <Link href={`/Courses/${kurs.id}`}>{kurs.name}</Link>
                </td>
                <td>{kurs.modules.length}</td>
                <td>
                  {kurs.modules
                    .map((x) => x.questions.length)
                    .reduce((a, b) => a + b)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
}

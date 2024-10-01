import "@mdxeditor/editor/style.css";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button, Container, Table } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function ModuleOverview() {
  const { data: sessionData } = useSession();
  const modules = api.module.getAll.useQuery();

  if (modules.isLoading) return <LoadingScreen title="Admin - User" />;
  if (modules.error) return <ErrorScreen error={modules.error.message} />;

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

  const ModuleData = modules.data;

  return (
    <>
      <Head>
        <title>Admin - Modules | {MAIN_TITLE}</title>
      </Head>
      <Container>
        <h1>Module Übersicht</h1>
        <Link href="/Admin/Modules/new" className="btn btn-primary mb-3">
          Neues Module
        </Link>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Modul Typ</th>
              <th>Kurs</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {ModuleData?.map((modul) => (
              <tr key={modul.id}>
                <td>{modul.id}</td>
                <td>{modul.name}</td>
                <td>{modul.type}</td>
                <td>
                  <Link href={`/Admin/Courses/edit/${modul.Course?.id}`}>
                    {modul.Course?.name}
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-outline-primary"
                    href={`/Admin/Modules/edit/${modul.id}`}
                  >
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

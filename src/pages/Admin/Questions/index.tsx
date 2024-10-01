import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../_components/CheckAdmin";

export default function QuestionsOverview() {
  const { data: sessionData } = useSession();
  const texts = api.module.getQuestions.useQuery();

  if (texts.isLoading) return <LoadingScreen title="Admin - Aufgaben" />;
  if (texts.error) return <ErrorScreen error={texts.error.message} />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  return (
    <>
      <Head>
        <title>Admin - Aufgaben | {MAIN_TITLE}</title>
      </Head>

      <h1 className="mt-3 mb-3">Text Übersicht</h1>
      <Link href="/Admin/Questions/new" className="btn btn-primary mb-3">
        Neue Aufgabe
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
          {texts.data?.map((text) => (
            <tr key={text.id}>
              <td>{text.id}</td>
              <td>{text.name}</td>
              <td>{text.type}</td>
              <td>
                <Link href={`/Admin/Courses/edit/${text.Course?.id}`}>
                  {text.Course?.name}
                </Link>
              </td>
              <td>
                <Link
                  className="btn btn-outline-primary"
                  href={`/Admin/Questions/edit/${text.id}`}
                >
                  Bearbeiten
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

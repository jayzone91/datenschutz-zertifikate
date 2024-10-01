import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../_components/CheckAdmin";

export default function CoursesOverview() {
  const { data: sessionData } = useSession();
  const courses = api.course.getAll.useQuery();

  if (courses.isLoading) return <LoadingScreen title="Admin - User" />;
  if (courses.error) return <ErrorScreen error={courses.error.message} />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  const KursData = courses.data;

  return (
    <>
      <Head>
        <title>Admin - Courses | {MAIN_TITLE}</title>
      </Head>
      <h1 className="text-center mt-5">Kurs Übersicht</h1>
      <Link href="/Admin/Courses/new" className="btn btn-primary mb-3">
        Neuer Kurs
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Modul</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {KursData?.map((Kurs) => (
            <tr key={Kurs.id}>
              <td>{Kurs.id}</td>
              <td>{Kurs.name}</td>
              <td>{Kurs.modules.length}</td>
              <td>
                <Link
                  className="btn btn-outline-primary"
                  href={`/Admin/Courses/edit/${Kurs.id}`}
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

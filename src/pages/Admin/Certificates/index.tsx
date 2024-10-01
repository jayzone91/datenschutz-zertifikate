import { useSession } from "next-auth/react";
import Head from "next/head";
import { Table } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../_components/CheckAdmin";

export default function CertificatesOverview() {
  const { data: sessionData } = useSession();
  const certificates = api.certificate.getAll.useQuery();

  if (certificates.isLoading) return <LoadingScreen title="Admin - User" />;
  if (certificates.error)
    return <ErrorScreen error={certificates.error.message} />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  return (
    <>
      <Head>
        <title>Admin - Courses | {MAIN_TITLE}</title>
      </Head>
      <h1 className="text-center mt-5">Zertifikats Übersicht</h1>
      <p>
        TODO: <br />
        - Filtern nach Kurs <br />
        - Filtern nach Benutzer <br />
        - Sortieren nach Datum <br />
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Benuzter</th>
            <th>Kurs</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {certificates.data?.map((Kurs) => (
            <tr key={Kurs.id}>
              <td>{Kurs.id}</td>
              <td>{Kurs.user.name}</td>
              <td>{Kurs.course.name}</td>
              <td>{new Date(Kurs.done_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../_components/CheckAdmin";

export default function AdminUserOverview() {
  const user = api.user.adminGetAll.useQuery();
  const { data: sessionData } = useSession();

  if (user.isLoading) return <LoadingScreen title="Admin - User" />;
  if (user.error) return <ErrorScreen error={user.error.message} />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  const userData = user.data;

  return (
    <>
      <Head>
        <title>Admin - User | {MAIN_TITLE}</title>
      </Head>

      <h1>Admin - User</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Admin</th>
            <th>Email</th>
            <th>Mail Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData?.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.is_admin ? "Ja" : "Nein"}</td>
              <td>{user.email}</td>
              <td>{user.emailVerified ? "Ja" : "Nein"}</td>
              <td>
                <Link
                  href={`/Admin/User/edit/${user.id}`}
                  className="btn btn-outline-primary"
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

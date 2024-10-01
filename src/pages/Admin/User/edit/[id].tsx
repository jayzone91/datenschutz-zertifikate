import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useParams } from "next/navigation";
import { Button, Container } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import { UserEditForm } from "~/Components/Forms";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function AdminUserEdit() {
  const { data: sessionData } = useSession();
  const { id } = useParams();

  const user = api.user.adminGetUser.useQuery({ id: id as string });

  if (user.isLoading) return <LoadingScreen title="Admin - User - Edit" />;
  if (user.error) return <ErrorScreen error={user.error.message} />;

  const userData = user.data;
  if (userData == null) return <ErrorScreen error="User not found" />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return (
      <>
        <Head>
          <title>Admin - User - Edit | {MAIN_TITLE}</title>
        </Head>
        <Container>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - User - Edit | {MAIN_TITLE}</title>
      </Head>
      <Container>
        <h1>Benutzer bearbeiten</h1>
        <UserEditForm user={userData} is_admin={sessionData.user.is_admin} />
      </Container>
    </>
  );
}

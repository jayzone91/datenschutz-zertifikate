import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { Button } from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import { UserEditForm } from "~/Components/Forms";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function EditUserPage() {
  const { data: sessionData } = useSession();
  const user = api.user.getCurrent.useQuery();

  if (user.isLoading) return <LoadingScreen title="User - Edit" />;
  if (user.error) return <ErrorScreen error={user.error.message} />;

  const userData = user.data;

  if (!sessionData || !sessionData.user) {
    return (
      <>
        <Head>
          <title>User bearbeiten | {MAIN_TITLE}</title>
        </Head>
        <>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </>
      </>
    );
  }

  if (userData == null) return <ErrorScreen error="User not found" />;

  return (
    <>
      <Head>
        <title>
          {sessionData?.user.name} bearbeiten | {MAIN_TITLE}
        </title>
      </Head>

      <UserEditForm user={userData} is_admin={sessionData.user.is_admin} />
    </>
  );
}

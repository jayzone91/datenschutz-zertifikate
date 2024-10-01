import {
  KitchenSinkToolbar,
  MDXEditor,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
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

export default function CourseEdit() {
  const { data: sessionData } = useSession();
  const { id } = useParams();
  const courses = api.course.get.useQuery({ id: id as string });
  const courseUpdate = api.course.update.useMutation();
  const courseDelete = api.course.delete.useMutation();
  const router = useRouter();

  const ref = useRef<MDXEditorMethods>(null);

  const [name, setName] = useState<null | string | undefined>(null);
  const [description, setDescription] = useState<null | string | undefined>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!courses.data) return;
    setName(courses.data.name);
    if (courses.data.description) setDescription(courses.data.description);
  }, [courses.data, courses.data?.name, courses.data?.description]);

  if (courses.isLoading) return <LoadingScreen title="Admin - User" />;
  if (courses.error) return <ErrorScreen error={courses.error.message} />;

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return (
      <>
        <Head>
          <title>Admin - Course | {MAIN_TITLE}</title>
        </Head>
        <Container>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </Container>
      </>
    );
  }

  const handleDelete = async () => {
    if (courses.data == null) return;
    setLoading(true);
    const res = await courseDelete.mutateAsync({
      id: courses.data.id,
    });
    if (res) {
      await router.push("/Admin/Courses");
    }
  };

  const handleSubmit = async () => {
    if (name == null) return;
    if (courses.data == null) return;
    setLoading(true);
    const res = await courseUpdate.mutateAsync({
      id: courses.data.id,
      name: name,
      description: description ?? undefined,
    });
    if (res) {
      setName(res.name);
      setDescription(res.description ?? "");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Course | {MAIN_TITLE}</title>
      </Head>
      <Container>
        <Link
          href="/Admin/Courses"
          className="btn btn-outline-primary mt-2 mb-3"
        >
          Zurück
        </Link>
        <Form>
          <FormGroup className="mb-3">
            <FormLabel>Name*</FormLabel>
            <FormControl
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
              value={courses.data?.name ?? ""}
              disabled={loading}
              maxLength={100}
              minLength={1}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Beschreibung</FormLabel>
            <MDXEditor
              ref={ref}
              markdown={courses.data?.description ?? ""}
              onChange={(value) => setDescription(value)}
              plugins={[
                toolbarPlugin({
                  toolbarContents: () => <KitchenSinkToolbar />,
                }),
                listsPlugin(),
                quotePlugin(),
                headingsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin(),
                tablePlugin(),
                thematicBreakPlugin(),
                frontmatterPlugin(),
                markdownShortcutPlugin(),
              ]}
              className="border rounded mb-3"
            />
          </FormGroup>

          <Button onClick={handleSubmit} disabled={loading}>
            Speichern
          </Button>
        </Form>
        <h2 className="mt-3 mb-3">Module</h2>
        <Link className="btn btn-primary mb-5" href="/Admin/Modules/new">
          Neues Modul erstellen
        </Link>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {courses.data?.modules.map((module) => (
              <tr key={module.id}>
                <td>{module.id}</td>
                <td>{module.name}</td>
                <td>
                  <Link
                    className="btn btn-outline-primary"
                    href={`/Admin/Modules/edit/${module.id}`}
                  >
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        <h2>Danger Zone</h2>
        <Button variant="danger" onClick={handleDelete}>
          Löschen
        </Button>
      </Container>
    </>
  );
}

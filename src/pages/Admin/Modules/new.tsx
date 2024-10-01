import {
  KitchenSinkToolbar,
  MDXEditor,
  type MDXEditorMethods,
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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";

export default function ModulesNew() {
  const { data: sessionData } = useSession();
  const courses = api.course.getAll.useQuery();

  const createModule = api.module.create.useMutation();

  const router = useRouter();
  const ref = useRef<MDXEditorMethods>(null);

  const [name, setName] = useState<undefined | string>(undefined);
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [type, setType] = useState<undefined | string>(undefined);
  const [courseId, setCourseId] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return (
      <>
        <Head>
          <title>Admin - Modules | {MAIN_TITLE}</title>
        </Head>
        <Container>
          <h1 className="test-center">Bitte erst anmelden!</h1>
          <Button onClick={() => void signIn()}>Anmelden</Button>
        </Container>
      </>
    );
  }

  if (courses.isLoading) return <LoadingScreen title="Admin - User" />;
  if (courses.error) return <ErrorScreen error={courses.error.message} />;

  const handleSubmit = async () => {
    if (name == null) return;
    if (type == null) return;
    if (courseId == null) return;
    setLoading(true);
    const res = await createModule.mutateAsync({
      name: name,
      description: description,
      type: type,
      id: courseId,
    });
    if (res) {
      await router.push(`/Admin/Modules/edit/${res.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Modules | {MAIN_TITLE}</title>
      </Head>
      <Container>
        <h1 className="text-center mt-5">Neues Modul erstellen</h1>
        <Form>
          <FormGroup className="mb-3">
            <FormLabel>Name*</FormLabel>
            <FormControl
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
              disabled={loading}
              maxLength={100}
              minLength={1}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Typ*</FormLabel>
            <FormSelect onChange={(e) => setType(e.target.value)} required>
              <option selected disabled>
                Auswählen
              </option>
              <option value="text">Text</option>
              <option value="question">Frage</option>
            </FormSelect>
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Kurs*</FormLabel>
            <FormSelect onChange={(e) => setCourseId(e.target.value)} required>
              <option selected disabled>
                Auswählen
              </option>
              {courses.data?.map((kurs) => (
                <option key={kurs.id} value={kurs.id}>
                  {kurs.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Beschreibung</FormLabel>
            <MDXEditor
              ref={ref}
              markdown={description ?? ""}
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
      </Container>
    </>
  );
}

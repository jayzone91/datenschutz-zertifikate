import {
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  KitchenSinkToolbar,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Table,
} from "react-bootstrap";
import ErrorScreen from "~/Components/ErrorScreen";
import LoadingScreen from "~/Components/LoadingScreen";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../../_components/CheckAdmin";

export default function EditModule() {
  const { id } = useParams();
  const { data: sessionData } = useSession();
  const modules = api.module.get.useQuery({ id: id as string });
  const courses = api.course.getAll.useQuery();
  const updateModule = api.module.update.useMutation();
  const deleteModule = api.module.delete.useMutation();
  const ref = useRef<MDXEditorMethods>(null);

  const [name, setName] = useState<undefined | string>(undefined);
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [type, setType] = useState<undefined | string>(undefined);
  const [courseId, setCourseId] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!modules.data) return;
    setName(modules.data.name);
    setDescription(modules.data.description ?? "");
    setType(modules.data.type);
    setCourseId(modules.data.courseId ?? "");
  }, [modules.data]);

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  if (modules.isLoading) return <LoadingScreen title="Admin - User" />;
  if (modules.error) return <ErrorScreen error={modules.error.message} />;
  if (courses.isLoading) return <LoadingScreen title="Admin - User" />;
  if (courses.error) return <ErrorScreen error={courses.error.message} />;

  const handleSubmit = async () => {
    if (name == null) return;
    if (type == null) return;
    if (courseId == null) return;
    setLoading(true);
    const res = await updateModule.mutateAsync({
      id: id as string,
      name: name,
      description: description,
      type: type,
      courseId: courseId,
    });
    if (res) {
      setCourseId(res.courseId ?? "");
      setName(res.name);
      setDescription(res.description ?? "");
      setType(res.type);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (modules.data == null) return;
    const res = await deleteModule.mutateAsync({
      id: id as string,
    });
    if (res) {
      await router.push(`/Admin/Modules`);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Module | {MAIN_TITLE}</title>
      </Head>

      <h1 className="text-center mt-5">Module bearbeiten</h1>
      <Form>
        <FormGroup className="mb-3">
          <FormLabel>Name*</FormLabel>
          <FormControl
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            value={modules.data?.name}
            disabled={loading}
            maxLength={100}
            minLength={1}
          />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>Typ*</FormLabel>
          <FormSelect onChange={(e) => setType(e.target.value)} required>
            <option selected={modules.data?.type == "text"} value="text">
              Text
            </option>
            <option
              selected={modules.data?.type == "question"}
              value="question"
            >
              Frage
            </option>
          </FormSelect>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>Kurs*</FormLabel>
          <FormSelect onChange={(e) => setCourseId(e.target.value)} required>
            <option selected disabled>
              Auswählen
            </option>
            {courses.data?.map((kurs) => (
              <option
                key={kurs.id}
                value={kurs.id}
                selected={kurs.id === courseId}
              >
                {kurs.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>Beschreibung</FormLabel>
          <MDXEditor
            ref={ref}
            markdown={modules.data?.description ?? ""}
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
      <hr />
      <h2>{type == "text" ? "Texte" : "Fragen"}</h2>
      <Link
        className="btn btn-primary mb-5"
        href={type == "text" ? "/Admin/Texts/new" : "/Admin/Questions/new"}
      >
        {type == "text" ? "Neuen Text erstellen" : "Neue Frage erstellen"}
      </Link>
      {type == "text" && modules.data?.text ? (
        <p>{modules.data?.text}</p>
      ) : (
        <p>Noch kein Text vorhanden</p>
      )}
      {type == "question" && (
        <Table>
          <thead>
            <tr>
              <th>Frage</th>
              <th>Bearbeiten</th>
            </tr>
          </thead>
          <tbody>
            {modules.data?.questions &&
              modules.data?.questions.length > 0 &&
              modules.data.questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.title}</td>
                  <td>
                    <Link
                      className="btn btn-outline-primary"
                      href={`/Admin/Qestions/edit/${question.id}`}
                    >
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <hr />
      <h2>Danger Zone</h2>
      <Button variant="danger" onClick={handleDelete}>
        Löschen
      </Button>
    </>
  );
}

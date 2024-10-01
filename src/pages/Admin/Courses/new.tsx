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
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { MAIN_TITLE } from "~/Config";
import { api } from "~/utils/api";
import CheckAdmin from "../_components/CheckAdmin";

export default function CoursesNew() {
  const { data: sessionData } = useSession();
  const CreateCourse = api.course.create.useMutation();
  const router = useRouter();
  const ref = useRef<MDXEditorMethods>(null);

  const [name, setName] = useState<undefined | string>(undefined);
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  if (!sessionData || !sessionData.user || !sessionData.user.is_admin) {
    return <CheckAdmin />;
  }

  const handleSubmit = async () => {
    if (name == null) return;
    setLoading(true);
    const res = await CreateCourse.mutateAsync({
      name: name,
      description: description,
    });
    if (res) {
      await router.push(`/Admin/Courses/edit/${res.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Courses | {MAIN_TITLE}</title>
      </Head>

      <h1 className="text-center mt-5">Neuen Kurs erstellen</h1>
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
    </>
  );
}

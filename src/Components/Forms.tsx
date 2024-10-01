import type { User } from "@prisma/client";
import { useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  FormCheck,
  FormControl,
} from "react-bootstrap";
import { api } from "~/utils/api";

export const UserEditForm = ({
  user,
  is_admin,
}: {
  user: User;
  is_admin: boolean;
}) => {
  const [name, setName] = useState(user.name ?? "");
  const [isAdmin, setIsAdmin] = useState(user.is_admin ?? false);
  const [email, setEmail] = useState(user.email ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const userUpdate = api.user.update.useMutation();

  if (!user) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await userUpdate.mutateAsync({
      id: user.id,
      name,
      is_admin: isAdmin,
      email,
    });

    if (res) {
      setEmail(res.email);
      setName(res.name ?? "");
      setIsAdmin(res.is_admin);
      setIsLoading(false);
    }
  };

  return (
    <Form>
      <FloatingLabel controlId="name" label="Name" className="mb-3">
        <FormControl
          type="text"
          required
          disabled={isLoading}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FloatingLabel>
      <FloatingLabel controlId="email" label="Email" className="mb-3">
        <FormControl
          type="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FloatingLabel>
      {is_admin && (
        <FormCheck
          type="switch"
          disabled={isLoading}
          className="mb-3"
          id="admin"
          label="Admin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
      )}
      <Button onClick={handleSubmit} variant="primary" disabled={isLoading}>
        {isLoading ? "Loading..." : "Speichern"}
      </Button>
    </Form>
  );
};

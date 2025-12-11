import { useState } from "react";
import { TextInput, Button, Group, Title } from "@mantine/core";
import "./Header.css";

export default function Header({ user, setUser }) {
  const [localName, setLocalName] = useState(user.name || "");

  const handleSubmit = () => {
    setUser((prev) => ({ ...prev, name: localName }));
  };

  return (
    <div className="header-container">
      <div className="y2k-spin">
        <Title order={1} className="y2k-title">
          TBD HOLIDAY PARTY 2025
        </Title>
      </div>

      <Group mt="lg" justify="center">
        <TextInput
          placeholder="Enter your name..."
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          styles={{ input: { height: 60, fontSize: 24 } }} 
          className="name-input"
        />
        <Button size="md" onClick={handleSubmit}>
          Submit
        </Button>
      </Group>

      {user.name && (
        <Title order={4} mt="md" style={{ color: "red" }}>
          Welcome, {user.name}!
        </Title>
      )}
    </div>
  );
}

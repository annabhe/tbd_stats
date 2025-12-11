import { useState } from "react";
import { MantineProvider, Container, Card, Title, Text, Button, TextInput, Group, Image,
} from "@mantine/core";
import { useDroppable, DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const riders = [
  "Alex",
  "Andrew",
  "Anna",
  "Apple",
  "Ben Law",
  "Ben Lin",
  "Constance",
  "David M",
  "Hardy",
  "Jarrett",
  "Josh",
  "Katie",
  "Sarah",
  "Sten",
  "Vignesh",
  "Wenbo"
];

export default function App() {
  // -----------------------------
  // USER + UNIFIED GAME STATE
  // -----------------------------
  const [user, setUser] = useState({ name: "" });

  const [games, setGames] = useState({
    game1: {
      matches: {
      "entry.465261784": undefined,
      "entry.2118217753": undefined,
      "entry.1022906453": undefined,
      "entry.2002542155": undefined,
      "entry.1353524928": undefined,
      "entry.1026362817": undefined,
      "entry.1938923205": undefined,
      "entry.233943155": undefined,
      "entry.103502268": undefined,
      "entry.307750344": undefined,
      "entry.1073742931": undefined,
      "entry.814067202": undefined,
      "entry.707373730": undefined,
      "entry.1112364681": undefined,
      "entry.1527542696": undefined,
      "entry.2144502645": undefined,
      "entry.1257218392":undefined
    },
      locked: false,
    },
    game2: {
      matches: {},
      locked: false,
    },
    game3: {
      answers: {},
      locked: false,
    },
    game4: {
      guesses: {},
      locked: false,
    },
  });

  // Google Form submission helper
  // const submitToGoogleForm = (url, data) => {
  //   const query = new URLSearchParams(data).toString();
  //   fetch(url + query);
  // };
  const submitToGoogleForm = async (url, data) => {
  const formData = new URLSearchParams(data);
  // POST request
  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors", // lol
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });
  console.log("Submitted to Google Form");
};

  // -----------------------------
  // DROPPABLE BIKE AND SORTABLE NAME COMPONENTS
  // -----------------------------
  function DroppableBike({ id, children }) {
    const { setNodeRef } = useDroppable({ id });

    return (
      <div ref={setNodeRef}>
        {children}
      </div>
    );
  }
  
  function SortableName({ id, label }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card
        ref={setNodeRef}
        style={{...style, cursor: "grab", touchAction: "none",}}
        p="xs"
        mt="xs"
        height={80}
        withBorder
        {...attributes}
        {...listeners}
      >
        <Text>{label}</Text>
      </Card>
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // start drag only after moving 5px
      },
    })
  );

  // -----------------------------
  // MAIN RENDER
  // -----------------------------
  return (
    <MantineProvider>
      <Container size="xs" p="md">
        {/* HEADER */}
        <Card p="md" radius="lg" style={{ background: "#222", color: "white" }}>
          <Title order={2}>Welcome to the 2025 !</Title>
          <Text size="sm">Enjoy the games below!</Text>
        </Card>

        {/* NAME INPUT */}
        <Card mt="lg" p="md" radius="lg" withBorder>
          <Title order={4}>Enter Your Name</Title>
          <TextInput
            mt="sm"
            placeholder="Your name"
            value={user.name}
            onChange={(e) => setUser({ name: e.target.value })}
          />
        </Card>

        {/* GAME 1 — MATCH BIKES TO OWNERS */}
        <Card mt="xl" p="md" radius="lg" withBorder
          opacity={games.game1.locked ? 0.4 : 1}
        >
          <Title order={3}>Game 1: Match the Bike to the Owner</Title>
          <Text size="sm" mb="sm"> Drag a name onto each bike. </Text>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              if (games.game1.locked) return;

              const { active, over } = event;
              if (!over) return;

              const nameId = active.id;
              const bikeId = over.id.startsWith("bike-") ? over.id : null;
              if (!bikeId) return;
              setGames((prev) => ({
                ...prev,
                game1: {
                  ...prev.game1,
                  matches: {
                    ...prev.game1.matches,
                    [bikeId]: nameId,
                  },
                },
              }));
            }}
          >  {/* onDragEnd end */}

            <Group grow mt="md" align="flex-start" direction="row" spacing="md">
              {/* LEFT — BIKES WITH DROP ZONES */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <Title order={5}>Bikes</Title>
                  {[...Array(16).keys()].map((i) => {
                    const id = `bike-${i + 1}`;
                    return (
                      <DroppableBike key={id} id={id}>
                        <Card key={id} id={id} p="xs" mt="xs" withBorder>
                          <Image
                            src={`/assets/bikes/bike-${String(i + 1).padStart(2, '0')}.jpg`}
                            height={100}
                            fit="contain"
                          />
                          <Text size="xs" mt="xs">
                            Owner: {games.game1.matches[id] || "None"}
                          </Text>
                        </Card>
                      </DroppableBike>
                    );
                  })}
                </div>

                {/* RIGHT — DRAGGABLE NAMES */}
                <div style={{ flex: 0.4 }}>
                  <Title order={5}>Names</Title>
                  <SortableContext
                    items={riders}
                    strategy={verticalListSortingStrategy}
                  >
                    {riders.map((rider) => (
                      <SortableName key={rider} id={rider} label={rider} />
                    ))}
                  </SortableContext>
                </div>
               
              </div>
            </Group>
          </DndContext>

          <Button
            disabled={!user.name || games.game1.locked}
            mt="md"
            onClick={() => {
              submitToGoogleForm(
                "https://docs.google.com/forms/d/e/1FAIpQLSe1-00GxyO8mNZRAM2UPoWDet4DN6zlO71d2om9-Fh3rm-wug/formResponse",
                { name: user.name, ...games.game1.matches }
              );
              setGames((prev) => ({
                ...prev,
                game1: { ...prev.game1, locked: true },
              }));
            }}
          >
            Submit
          </Button>
        </Card>

        {/* FOOTER */}
        <Card mt="xl" p="md" radius="lg" withBorder>
          <Text size="sm">Thanks for playing! See you on the next ride! 🚴‍♀️</Text>
        </Card>
      </Container>
    </MantineProvider>
  );
}

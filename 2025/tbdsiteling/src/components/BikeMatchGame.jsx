import { useState } from 'react';
import { Card, Title, Text, Button, Stack, Group, Image } from '@mantine/core';
import { useDroppable, DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const riders = ["Alex","Andrew","Anna","Apple","Ben Law","Ben Lin","Constance","David M","Hardy","Jarrett","Josh","Katie","Sarah","Sten","Vignesh","Wenbo"];
const entryIds = {
  "bike-01": "entry.2118217753",
  "bike-02": "entry.1022906453",
  "bike-03": "entry.2002542155",
  "bike-04": "entry.1353524928",
  "bike-05": "entry.1026362817",
  "bike-06": "entry.1938923205",
  "bike-07": "entry.233943155",
  "bike-08": "entry.103502268",
  "bike-09": "entry.307750344",
  "bike-10": "entry.1073742931",
  "bike-11": "entry.814067202",
  "bike-12": "entry.707373730",
  "bike-13": "entry.1112364681",
  "bike-14": "entry.1527542696",
  "bike-15": "entry.2144502645",
  "bike-16": "entry.1257218392",
};


function SortableName({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab', touchAction: 'none' };
  return (
    <Card ref={setNodeRef} p="xs" mt="xs"  withBorder {...attributes} {...listeners}
      style={{ ...style, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderWidth: '2px',      // thicker
        borderColor: '#444',     // darker color
        borderStyle: 'solid',
        margin:16
      }} 
    >
      <Text size="lg" weight={800} align="center">{label}</Text>
    </Card>
  );
}

function toGoogleQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join("");
}

const submitToGoogleForm = async (url, data) => {
  console.log("form data: ", data)
  const query = toGoogleQueryString(data);
  console.log(query);
  url = `${url}?&submit=Submit?usp=pp_url${query}`
  console.log(url);
  await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
  console.log('Submitted to Google Form');
};

export default function BikeMatchGame({ user }) {
  const [locked, setLocked] = useState(false);
  const [ridersList, setRidersList] = useState(riders);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRidersList((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      const newArray = [...prev];
      newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, active.id);
      return newArray;
    });
  }

  return (
    <Card mt="xl" p="md" radius="lg" withBorder opacity={locked ? 0.4 : 1}>
      <Title order={1}>Match the Bike to the Owner</Title>
      <Text size="sm" mb="sm">
        Drag the names on the right to reorder according to the bikes on the left.
        When you're ready, press the submit button. 
        You can only submit once! Order carefully...
      </Text>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Group grow mt="md" align="flex-start" direction="row" spacing="md">
          <div style={{ display: 'flex', padding: "0 16px", marginTop: 16, gap: 16, alignItems: 'flex-start' }}>
            <Stack style={{ flex: 1 }}>
              <Title order={5}>Bikes</Title>
              {[...Array(16).keys()].map((i) => (
                <Card key={`bike-${i}`} p="s" mt="xs" withBorder
                  style={{minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin:16}}>
                  <Image
                    src={`/assets/bikes/bike-${String(i+1).padStart(2,'0')}.jpg`}
                    height={100}
                    fit="contain"
                  />
                  <Text size="xs" mt="xs"> {ridersList[i]}'s bike?</Text>
                </Card>
              ))}
            </Stack>
            <Stack style={{ flex: 0.6 , gap:"sm"}}>
              <Title order={5}>Names</Title>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ridersList} strategy={verticalListSortingStrategy}>
                  {ridersList.map((rider) => (
                    <SortableName key={rider} id={rider} label={rider} />
                  ))}
                </SortableContext>
              </DndContext>
            </Stack>
          </div>
        </Group>
      </DndContext>

      <Button disabled={!user.name || locked} mt="md" onClick={() => {
          const formData = {};
          ridersList.forEach((rider, i) => {
            const bikeKey = `bike-${String(i + 1).padStart(2,'0')}`;
            formData[entryIds[bikeKey]] = rider;
          });
          formData["entry.465261784"] = user.name; // user name
          submitToGoogleForm('https://docs.google.com/forms/d/e/1FAIpQLSe1-00GxyO8mNZRAM2UPoWDet4DN6zlO71d2om9-Fh3rm-wug/formResponse', formData);
        setLocked(true);
      }}>Submit</Button>
    </Card>
  );
}



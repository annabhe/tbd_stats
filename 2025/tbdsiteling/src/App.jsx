import { MantineProvider, Container, Stack } from '@mantine/core';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BikeMatchGame from './components/BikeMatchGame';
// import PosterMatchGame from './components/PosterMatchGame';
// import Superlatives from './components/Superlatives';
// import Game4 from './components/Game4';

export default function App() {
  const [user, setUser] = useState({ name: '' });

  return (
    <MantineProvider
      theme={{
        components: {
          Card: {
            defaultProps: {
              radius: "lg",     // bigger rounded corners
              shadow: "sm",
              withBorder: true,
              padding: "sm",
            },
            styles: (theme) => ({
              root: {
                borderRadius: theme.radius.lg,   // ensures radius applies even if inline styles exist
                borderColor: "#444",
                borderWidth: 2,
                borderStyle: "solid",
                overflow: "hidden",
              },
            }),
          },
        },
      }}
    >
      <Stack>
        <Header user={user} setUser={setUser} />
        <BikeMatchGame user={user} />
        {/* <PosterMatchGame user={user} />
        <Superlatives user={user} />
        <Game4 user={user} /> */}
        <Footer />
      </Stack>
    </MantineProvider>
  );
}
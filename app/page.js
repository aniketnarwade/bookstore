"use client"; // this is a client component 👈🏽
import EditableTable from "@/component/EditableTable";
import UserTable from "@/component/UserTable";
import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [homeUser, setHomeUser] = useState(null);

  return (
    <main className="">
      <Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={6}>
        <GridItem  colSpan={[1, 1, 2]}>
          <UserTable setHomeUser={setHomeUser} />
        </GridItem>
        <GridItem  colSpan={[1, 1, 2]}>
          {homeUser && <EditableTable homeUser={homeUser} />}
        </GridItem>
      </Grid>
    </main>
  );
}

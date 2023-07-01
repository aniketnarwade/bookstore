"use client"; // this is a client component 👈🏽
import EditableTable from "@/component/EditableTable";
import UserTable from "@/component/UserTable";
import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "@/component/Navbar";

export default function Home() {
  const [homeUser, setHomeUser] = useState(null);

  return (
    <>
    <div className="grid grid-cols-1 gap-2">
      <div>
        <Navbar/>
      </div>
  <div className="">
  <UserTable setHomeUser={setHomeUser} />
  </div>
 
  <div className="">
  {homeUser && <EditableTable homeUser={homeUser} />}
  </div>
</div>
    </>
    
  );
}

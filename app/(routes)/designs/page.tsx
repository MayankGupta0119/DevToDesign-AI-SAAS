"use client";
import { useAuthContext } from "@/app/provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DesignCard from "./_components/DesignCard";

function Designs() {
  const { user } = useAuthContext();
  const [wireframeList, setWireframeList] = useState([]);

  useEffect(() => {
    user && GetAllUserDesigns();
  }, [user]);
  const GetAllUserDesigns = async () => {
    const results = await axios.get(
      "/api/wireframe-to-code?email=" + user?.email
    );
    console.log("All Designs fetched = ", results.data);
    setWireframeList(results.data);
  };
  return (
    <div>
      <h2 className="font-bold text-2xl">Wireframes and Codes</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-7">
        {wireframeList?.map((item, index) => (
          <DesignCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Designs;

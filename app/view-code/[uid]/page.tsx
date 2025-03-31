"use client";
import Constants from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RECORD {
  id: number;
  description: string;
  code: any;
  imageUrl: string;
  model: string;
  createdBy: string;
}

function ViweCode() {
  const { uid } = useParams();
  console.log("UID Value:", uid);
  const [loading, setLoading] = useState(false);
  const [codeResp, setCodeResp] = useState("");
  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);
  const GetRecordInfo = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/wireframe-to-code?uid=" + uid);
      console.log("inside view-code page.tsx -->", result.data);
      const response_data = result.data;
      console.log("Checking if code is null:", response_data?.code);
      if (
        response_data?.code == null ||
        Object.keys(response_data.code).length === 0
      ) {
        console.log("Calling GenerateCode function ..............");
        GenerateCode(response_data);
      }
      if (response_data?.error) {
        console.log("No record found");
      } else {
        console.log("code lgta hai null nhi hai");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };
  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    console.log("Inside GenerateCode function");
    const response = await fetch("/api/ai-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: record?.description + ":" + Constants?.PROMPT,
        model: record?.model,
        imageUrl: record?.imageUrl,
      }),
    });
    console.log("Ai - Response = ", response);
    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      setLoading(false);
      return;
    }
    if (!response.body) {
      console.error("No response body received.");
      setLoading(false);
      return;
    }
    console.log("Reading API response...");
    const reader = response.body.getReader();
    const decocder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      console.log("Chunk received:", done, value);
      if (done) break;
      const text = decocder
        .decode(value)
        .replace("```jsx", "")
        .replace("```", "");
      console.log("Text Data = ", text);
      setCodeResp((prev) => prev + text); //for string we can't use spread operator
    }
    setLoading(false);
  };
  return (
    <div>
      ViweCode
      {/* user details */}


      {/* code editor */}
    </div>
  );
}

export default ViweCode;

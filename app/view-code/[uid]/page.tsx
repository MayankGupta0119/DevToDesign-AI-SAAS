"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constants from "@/data/Constants";
import axios from "axios";
import { Loader2, LoaderCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SelectionDetails from "./_components/SelectionDetails";
import CodeEditor from "./_components/CodeEditor";

export interface RECORD {
  id: number;
  description: string;
  code: any;
  imageUrl: string;
  model: string;
  createdBy: string;
  uid: string;
}

function ViweCode() {
  const { uid } = useParams();
  console.log("UID Value:", uid);
  const [loading, setLoading] = useState(false);
  const [codeResp, setCodeResp] = useState("");
  const [record, setRecord] = useState<RECORD>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("UID inside useEffect:", uid);
    if (uid) GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    try {
      setLoading(true);
      setIsReady(false);
      setCodeResp("");
      const result = await axios.get("/api/wireframe-to-code?uid=" + uid);
      console.log("inside view-code page.tsx -->", result.data);
      const response_data = result.data;
      console.log("Checking if code is null:", response_data?.code);
      setRecord(response_data);
      if (response_data?.code && Object.keys(response_data.code).length > 0) {
        console.log("Code already exists, using stored code.");
        setCodeResp(response_data?.code.resp);
        setLoading(false);
        setIsReady(true);
        return;
      }
      if (
        response_data?.code == null ||
        Object.keys(response_data.code).length === 0
      ) {
        if (!loading && !isReady) {
          console.log("Calling GenerateCode function ..............");
          GenerateCode(response_data); // Ensure GenerateCode runs
        }
        return; // Prevent setting `loading = false` too early
      } else {
        setCodeResp(response_data?.code.resp);
        setLoading(false);
        setIsReady(true);
      }

      setLoading(false); // Only set false if GenerateCode is NOT needed
    } catch (error) {
      console.error("Error fetching record:", error);
      setLoading(false);
    }
  };

  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    console.log("Inside GenerateCode function");

    try {
      const response = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: record?.description + ":" + Constants?.PROMPT,
          model: record?.model,
          imageUrl: record?.imageUrl,
        }),
      });

      if (!response.ok) throw new Error(`API failed: ${response.status}`);

      if (!response.body) throw new Error("No response body received.");

      console.log("Reading API response...");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        console.log("Chunk received:", done, value);
        if (done) break;
        const text = decoder
          .decode(value)
          .replace("```jsx", "")
          .replace("```", "");
        console.log("Text Data = ", text);
        setCodeResp((prev) => prev + text);
      }
      // updateCodeToDB();
    } catch (error) {
      console.error("Error in GenerateCode:", error);
    } finally {
      setLoading(false); // Always set `loading = false` on completion
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (codeResp != "" && record?.uid && isReady && record?.code == null) {
      updateCodeToDB();
    }
  }, [codeResp]);

  console.log("Record --->", record);

  const updateCodeToDB = async () => {
    try {
      const result = await axios.put("/api/wireframe-to-code", {
        uid: record?.uid,
        codeResp: { resp: codeResp },
      });
      console.log("Code update, Result -->", result);
    } catch (error) {
      console.error("Error in saving code to Database", error);
    }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          {/* Selection Details */}
          <SelectionDetails
            record={record}
            regenerateCode={GetRecordInfo}
            isReady={isReady}
          />
        </div>
        <div className="col-span-4">
          {/* 4 cols given to code editor side */}
          {/* Code Editor */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-slate-100 rounded-xl">
              <Loader2 className="animate-spin w-10 h-10 text-gray-500 mb-4" />
              <h2 className="font-bold  text-3xl text-center text-gray-700">
                Analyzing Wireframe...
              </h2>
            </div>
          ) : (
            <CodeEditor codeResp={codeResp} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ViweCode;

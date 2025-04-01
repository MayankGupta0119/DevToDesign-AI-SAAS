import React from "react";
import { RECORD } from "../page";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function SelectionDetails({
  record,
  regenerateCode,
  isReady,
}: {
  record: any;
  regenerateCode: any;
  isReady: any;
}) {
  console.log("Record Details Inside SelectionDetails page: ", record);
  return (
    record && ( //if record is there then only show this
      <div className="p-5 bg-gray-100 h-screen rounded-lg">
        <h2 className="font-bold my-2">Wireframe: </h2>
        <Image
          src={record?.imageUrl}
          alt="Wireframe Image"
          width={300}
          height={400}
          className="rounded-lg object-contain h-[200px] w-full border border-dashed p-2  bg-white"
        />
        <h2 className="mt-4 mb-2 font-bold">AI Model</h2>
        <Input
          defaultValue={record?.model}
          disabled={true}
          className="bg-white"
        />

        <h2 className="mt-4 mb-2 font-bold">Description</h2>
        <Textarea
          defaultValue={record?.description}
          disabled={true}
          className="bg-white"
        />

        <Button
          className="mt-7 w-full"
          onClick={regenerateCode}
          disabled={!isReady}
        >
          <RefreshCcw /> Regenerate Code
        </Button>
      </div>
    )
  );
}

export default SelectionDetails;

"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Divide, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import React, { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import axios from "axios";
import { useAuthContext } from "@/app/provider";

function ImageUpload() {
  const AiModelList = [
    {
      name: "Gemini Google",
      icon: "/google.png",
    },
    {
      name: "llama by Meta",
      icon: "/meta.png",
    },
    {
      name: "Deepseek",
      icon: "/deepseek.png",
    },
  ];
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [file, setfile] = useState<any>();
  const [model, setModel] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // to get user details
  const { user } = useAuthContext();
  const OnImageSelectPrev = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setPrevUrl(imageUrl);
      setfile(files[0]);
    }
  };
  const OnCovertToCodeButtonClick = async () => {
    if (!file || !model || !description) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      //save the image to firebase
      const fileName = Date.now() + ".png";
      const imageReference = ref(storage, "wireframe2code/" + fileName);
      await uploadBytes(imageReference, file);
      //once uploaded, we need to get the download url of the image
      const imgUrl = await getDownloadURL(imageReference);
      console.log("Download URL -->", imgUrl);

      // Here you can add your API call to process the image with the selected AI model
      //generating a unique uid with uuid4 library
      const uid = uuidv4();
      //saving info to the Database
      const result = await axios.post("/api/wireframe-to-code", {
        uid: uid,
        description: description,
        imageUrl: imgUrl,
        model: model,
        email: user?.email,
      });
      console.log("Result -->", result.data);

      // const response = await fetch('/api/process-image', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     imageUrl: imgUrl,
      //     model: model,
      //     description: description
      //   })
      // });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-10">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* left side wala div for image upload */}
        {!prevUrl ? (
          // if the image is not uploaded will show the button to upload the image, will check that wiht the useState variable prevUrl
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center">
            <CloudUpload className="h-10 w-10" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click button to select wireframe image
            </p>
            <div className="p-5 border border-dashed w-full flex justify-center mt-7">
              {/* making custom file selector */}
              <label htmlFor="imageSelect">
                {/* with the id "imageSelect it will bind to the below input tag which is hidden" */}
                <h2 className="p-2 bg-primary text-white rounded-md px-5">
                  Select Image
                </h2>
              </label>
            </div>
            <input
              type="file"
              id="imageSelect"
              className="hidden"
              multiple={false}
              onChange={OnImageSelectPrev}
            />
          </div>
        ) : (
          // if the preview image url is set then will show the uploaded image
          <div className="p-5 border border-dashed">
            <Image
              src={prevUrl}
              alt="preview image"
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="flex justify-end w-full cursor-pointer"
              onClick={() => setPrevUrl(null)}
            />
          </div>
        )}
        {/* right side wala div for user prompt */}
        <div className="p-7 border shadow-md rounded-lg">
          <h2 className="font-bold text-lg mt-7">Select AI Model</h2>
          <Select onValueChange={(value) => setModel(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelList.map((model, index) => (
                <SelectItem value={model.name} key={index}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={25}
                      height={25}
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="font-bold text-lg">
            Enter Description about your webpage
          </h2>
          <Textarea
            className="mt-3 h-[200px]"
            placeholder="Write about your webpage"
            onChange={(event) => setDescription(event?.target.value)}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button onClick={OnCovertToCodeButtonClick} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </div>
          ) : (
            <>
              <WandSparkles /> Convert to Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;

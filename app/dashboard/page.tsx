"use client";

import Link from "next/link";
import { fileTypeFromBlob } from "file-type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Draggable from "react-draggable";
import { FileInput, FileUploader } from "@/components/Upload";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shared/ui/accordion";
import { ChevronDownIcon } from "lucide-react";
import Category from "@/components/Category";
export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export const iframeHeight = "600px";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

export default function Dashboard() {
  const dropZoneConfig = {
    accept: {
      "text/html": [".html"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;
  const [files, setFiles] = useState<File[] | null>([]);
  useEffect(() => {
    async function asyncWork() {
      if (files && files[0]) {
        if (files[0].type == "text/html") {
          const favorites = await parseFile(files[0]);
          const response = await fetch("/api", {
            method: "POST",
            body: JSON.stringify(favorites.slice(0, 10)),
          })
            .then((res) => res.json())
            .catch((res) => res);
          console.log(response);
        } else {
        }
      }
    }
    asyncWork();
  }, [files]);
  return (
    <main className="bg-secondary-900 h-screen w-full flex items-center">
      <Draggable defaultClassName="cursor-move">
        <Accordion
          type="single"
          className="mx-auto"
          collapsible
          defaultValue="upload"
        >
          <AccordionItem value="upload" className="border-b-0">
            <Card className="max-w-lg bg-secondary-200 border-0 drop-shadow-lg">
              <CardHeader>
                <AccordionTrigger
                  // onClick={() => setOpened((e) => !e)}
                  className="AccordionTrigger flex"
                >
                  <ChevronDownIcon className="AccordionChevron" aria-hidden />
                  <CardTitle className="text-xl text-left w-full ml-2">
                    Try it
                  </CardTitle>
                </AccordionTrigger>
                <CardDescription className="text-slate-700">
                  Export your bookmarks and drop it here
                </CardDescription>
              </CardHeader>
              <AccordionContent className="CollapsibleContent">
                <CardContent>
                  <div className="grid gap-4">
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                    >
                      <FileInput>
                        <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
                          <p className="text-gray-400">Drop file here</p>
                        </div>
                      </FileInput>
                    </FileUploader>
                    <Button
                      type="submit"
                      className="w-full bg-secondary-700 text-white"
                    >
                      Organize it
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Save your result?{" "}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </Draggable>
      <Draggable defaultClassName="cursor-move">
        <div className="p-4">
          <Category
            category="Anime"
            favorites={[
              "test",
              "test",
              "test",
              "test",
              "test",
              "test",
              "test",
              "test",
              "test",
            ]}
          />
        </div>
      </Draggable>
    </main>
  );
}
async function parseFile(file: File): Promise<Array<string>> {
  const arr: Array<string> = [];
  const pattern = /<a\s+href="([^"]*)"/gi;
  console.log(await file.text());
  const urls = await file
    .text()
    .then((text) => text.matchAll(pattern).toArray());
  const res = urls.map((e) => e[1]);
  return res;
}

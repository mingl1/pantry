"use client";

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
import QueryClientProvider from "@/components/query-provider";
import UserProfile from "@/components/supaauth/user-profile";
import MyBentoGrid from "@/components/BentoGrid";
export type CategoryType = {
  [label: string]: CategoryItem;
};
export type CategoryItem = {
  url: string;
  icon?: string | null;
  name?: string | null;
}[];
export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export const iframeHeight = "600px";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<CategoryType>();
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
          let favorites = await parseFile(files[0]);
          favorites = favorites.map((e) => {
            return { name: e.name, url: e.url };
          });
          let response: CategoryType = {};
          for (let i = 0; i < 10; i += 5) {
            if (i > 10) {
              break;
            }
            const chunk = favorites.splice(i, i + 5);
            console.log(chunk);
            let chunkResponse = await fetch("/auth/bookmarks", {
              method: "POST",
              body: JSON.stringify(chunk),
            })
              .then((res) => res.json())
              .catch((res) => res);
            if (chunkResponse.error) {
              return;
            }
            response = { ...response, ...chunkResponse };
          }

          setBookmarks(makeDict(response));
          console.log(response);
        } else {
        }
      }
    }
    asyncWork();
  }, [files]);
  useEffect(() => {
    async function getBookMarks() {
      const response = await fetch("/auth/bookmarks?next=bookmarks", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => makeDict(res));
      setBookmarks(response);
    }
    getBookMarks();
  }, []);
  if (bookmarks) console.log(Object.keys(bookmarks));
  return (
    <QueryClientProvider>
      <main className="bg-secondary-900 h-[100vh] w-[100vw] flex items-center justify-center m-0 p-0 ">
        <Draggable defaultClassName="cursor-move">
          <Accordion type="single" collapsible defaultValue="upload">
            <AccordionItem value="upload" className="border-b-0">
              <Card className="max-w-lg bg-secondary-200 border-0 drop-shadow-lg">
                <CardHeader>
                  <AccordionTrigger className="AccordionTrigger flex">
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
                    <UserProfile />
                    {/* <div className="mt-4 text-center text-sm">
                      Save your result?{" "}
                      <Link href="/signup" className="underline">
                        Sign up
                      </Link>
                    </div> */}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </Draggable>
        <MyBentoGrid
          bookmarks={bookmarks}
          items={[]}
          classNames={{
            container: "w-full h-full",
            elementContainer: "bg-transparent w-full",
          }}
        />
      </main>
    </QueryClientProvider>
  );
}
async function parseFile(file: File): Promise<CategoryItem> {
  // captures href and icon(optional) value and text between anchor tags
  const pattern =
    /<a\s+[^>]*href="([^"]*)"(?:[^>]*icon="([^"]*)")?[^>]*>(.*?)<\/a>/gi;
  console.log(await file.text());
  const urls = await file
    .text()
    .then((text) => text.matchAll(pattern).toArray());
  const res = urls.map((e) => ({
    url: e[1],
    icon: e[2] || null,
    name: e[3],
  }));
  res.forEach((e) =>
    e.icon !== null ? localStorage.setItem(e.url, e.icon) : null
  );
  return res;
}

function makeDict(res: CategoryType) {
  const dict: CategoryType = {};
  console.log(res);
  for (const label of Object.keys(res)) {
    for (const item of res[label]) {
      const icon = localStorage.getItem(item.url);
      if (dict.hasOwnProperty(label)) {
        dict[label].push({ ...item, icon });
      } else {
        dict[label] = [{ ...item, icon }];
      }
    }
  }
  console.log(dict);
  return dict;
}

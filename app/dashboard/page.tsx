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
import Command from "@/components/Command";

import { ChevronDownIcon, Terminal } from "lucide-react";
import QueryClientProvider from "@/components/query-provider";
import UserProfile from "@/components/supaauth/user-profile";
import MyBentoGrid from "@/components/BentoGrid";

import { Progress } from "@/components/ui/progress";
export type CategoryType = {
  [label: string]: CategoryItem;
};
export type CategoryItem = {
  url: string;
  icon?: string | null;
  name?: string | null;
}[];
// const description =
//   "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

// const iframeHeight = "600px";

// const containerClassName =
//   "w-full h-screen flex items-center justify-center px-4";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdWarning } from "react-icons/md";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<CategoryType>({});
  const [state, setState] = useState<CategoryItem[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const dropZoneConfig = {
    accept: {
      "text/html": [".html"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;
  const [files, setFiles] = useState<File[] | null>([]);
  const [canSubmit, setCanSubmit] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reload, setReload] = useState(true);
  const [asyncStuff, setAsyncStuff] = useState(false);
  useEffect(() => {
    async function asyncWork() {
      if (files && files[0]) {
        if (files[0].type == "text/html") {
          let favorites = await parseFile(files[0]);
          favorites = favorites.map((e) => {
            return { name: e.name, url: e.url };
          });
          let response: CategoryType = {};
          setCanSubmit(false);
          setIsFetching(true);
          let limit = 20;
          for (let i = 0; i < limit; i += 5) {
            setProgress(((i + 5) / limit) * 100);
            const chunk = favorites.splice(0, 5);
            console.log(chunk);
            let chunkResponse = await fetch("/auth/bookmarks", {
              method: "POST",
              body: JSON.stringify(chunk),
            })
              .then((res) => (res ? res.json() : null))
              .catch((res) => null);
            if (chunkResponse === null || chunkResponse.error) {
              setIsFetching(false);
              return;
            }
            response = { ...response, ...chunkResponse };
          }

          setBookmarks(makeDict(response));
          setIsFetching(false);
          setCanSubmit(true);
        } else {
        }
      }
    }
    if (canSubmit) asyncWork();
  }, [files]);
  useEffect(() => {
    async function getBookMarks() {
      const response = await fetch("/auth/bookmarks", {
        method: "GET",
        next: { tags: ["bookmarks"] },
      })
        .then((res) => {
          return res ? res.json() : null;
        })
        .then((res) => makeDict(res))
        .catch((err) => null);
      if (response) setBookmarks(response);
    }
    getBookMarks();
  }, [reload]);
  return (
    <QueryClientProvider>
      <main className="bg-secondary-100/20 dark:bg-secondary-900/10 h-[100vh] w-[100vw] flex items-center justify-center m-0 p-0 overflow-hidden ">
        <Draggable defaultClassName="cursor-move ">
          <Accordion type="single" collapsible defaultValue="upload">
            <AccordionItem value="upload" className="border-b-0">
              <Card className="max-w-lg bg-secondary-200 dark:bg-background border-0 drop-shadow-lg">
                <CardHeader className="hover:no-underline">
                  <AccordionTrigger className="AccordionTrigger flex hover:no-underline">
                    <ChevronDownIcon
                      className="AccordionChevron text-primary-900"
                      aria-hidden
                    />
                    <CardTitle className="text-xl text-left w-full ml-2 dark:text-primary-600 hover:no-underline">
                      Try it
                    </CardTitle>
                  </AccordionTrigger>
                  <CardDescription className="dark:text-primary-900">
                    Export your bookmarks and drop it here
                  </CardDescription>
                </CardHeader>
                <AccordionContent className="CollapsibleContent">
                  <CardContent>
                    {isFetching ? (
                      <>
                        <Progress value={progress} className="w-full" />
                        <Alert>
                          <Terminal className="h-4 w-4" />
                          <AlertTitle>Heads up!</AlertTitle>
                          <AlertDescription>
                            Do not close the tab! Your progress will be lost!
                          </AlertDescription>
                        </Alert>
                      </>
                    ) : (
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

                        {bookmarks && Object.keys(bookmarks).length > 0 && (
                          <>
                            <Button
                              className="w-full bg-secondary-700 text-rose-800 dark:bg-primary-100/5 dark:text-rose-400"
                              onClick={async () => {
                                setAsyncStuff(true);
                                let chunkResponse = await fetch(
                                  "/auth/bookmarks",
                                  {
                                    method: "POST",
                                    body: JSON.stringify({ purge: true }),
                                  }
                                )
                                  .then((res) => setReload((e) => !e))
                                  .catch((res) => res);
                                setAsyncStuff(false);
                              }}
                              disabled={asyncStuff}
                            >
                              Something went wrong...Purge it!
                            </Button>
                            <Alert>
                              <MdWarning className="h-4 w-4 text-rose-300" />
                              {/* <AlertTitle>Heads up!</AlertTitle> */}
                              <AlertDescription className="dark:text-rose-200 text-rose-700 ">
                                Your bookmarks will be deleted if purged.
                              </AlertDescription>
                            </Alert>
                            <Button
                              className="w-full bg-secondary-700 text-green-600 dark:bg-primary-100/5 dark:text-green-100/5"
                              onClick={async () => {
                                setAsyncStuff(true);
                                await saveDict(state, labels)
                                  .then(() => setReload((e) => !e))
                                  .catch((e) => console.log(e));
                                setAsyncStuff(false);
                              }}
                              disabled={isFetching}
                            >
                              Save your marked page
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    <UserProfile />
                    {bookmarks && Object.keys(bookmarks).length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Press{" "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          <span className="text-xs">⌘(ctrl)</span>/
                        </kbd>{" "}
                        to create a category
                      </p>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </Draggable>
        {bookmarks && Object.keys(bookmarks).length > 0 && (
          <MyBentoGrid
            bookmarks={bookmarks}
            state={state}
            setState={setState}
            labels={labels}
            setLabels={setLabels}
            items={[]}
            classNames={{
              container: "w-full h-full",
              elementContainer: "bg-transparent w-full",
            }}
          />
        )}
        <Command
          state={state}
          setState={setState}
          labels={labels}
          setLabels={setLabels}
        />
      </main>
    </QueryClientProvider>
  );
}
async function parseFile(file: File): Promise<CategoryItem> {
  // captures href and icon(optional) value and text between anchor tags
  const pattern =
    /<a\s+[^>]*href="([^"]*)"(?:[^>]*icon="([^"]*)")?[^>]*>(.*?)<\/a>/gi;
  const urls = await file
    .text()
    .then((text) => Array.from(text.matchAll(pattern)));
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
  if (res)
    for (const label of Object.keys(res)) {
      for (const item of res[label]) {
        let icon = localStorage.getItem(item.url);
        if (icon === null) {
          icon = `https://www.google.com/s2/favicons?sz=32&domain_url=${item.url}`;
        }
        if (dict.hasOwnProperty(label)) {
          dict[label].push({ ...item, icon });
        } else {
          dict[label] = [{ ...item, icon }];
        }
      }
    }
  return dict;
}

async function saveDict(dict: CategoryItem[], labels: string[]) {
  const savedDict: CategoryType = {};
  for (let i = 0; i < labels.length; i++) {
    savedDict[labels[i]] = dict[i];
  }
  let res = await fetch("/auth/bookmarks/save", {
    method: "POST",
    body: JSON.stringify(savedDict),
  })
    .then((res) => (res ? res.json() : null))
    .catch((res) => null);
  console.log(res);
}

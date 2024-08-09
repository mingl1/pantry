"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { CategoryItem } from "@/app/dashboard/page";

export default function Command({
  state,
  setState,
  labels,
  setLabels,
}: {
  state: CategoryItem[];
  setState: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [curr, setCurr] = React.useState("");
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && e.ctrlKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      filter={(value, search) => {
        if (search.length == 0) return 1;
        if (search.length == 1 && search.charAt(0) == "/") return 1;
        if (search.charAt(0) == "/") search = search.substring(1);
        const search_split = search.split("/");
        if (search_split.length > 1) {
          let depth = search_split.length;
          const value_split = value.split("/");
          if (depth >= value_split.length) {
            return 0;
          }
          for (let i = 1; i < depth; i++) {
            if (
              value_split[i].toLowerCase() !== search_split[i - 1].toLowerCase()
            ) {
              return 0;
            }
          }
          return value_split[depth]
            .toLowerCase()
            .includes(search_split.pop()?.toLowerCase()!)
            ? 1
            : 0;
        }
        const s = search_split.pop()?.toLowerCase();
        if (s === undefined) {
          return 1;
        }
        return value.toLowerCase().includes(s) ? 1 : 0;
      }}
    >
      <CommandInput
        placeholder="Type a command or search..."
        onValueChange={(e) => setCurr(e)}
        value={curr}
        className="ml-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            for (const label of labels) {
              if (label === "/" + curr) {
                setOpen(false);
              }
            }
            setCurr("");
            setLabels((prev) => [...prev, "/" + curr]);
            setState((prev) => [
              ...prev,
              [{ url: "www.findmytt.com", name: "placeholder" }],
            ]);
            setOpen(false);
          }
        }}
      />
      <CommandList>
        <CommandEmpty>Create new category: {curr}</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {labels &&
            labels.map((label, index) => (
              <CommandItem key={label + index}>
                <User className="mr-2 h-4 w-4" />
                <span className="text-black">
                  {label
                    .split("/")
                    .slice(0, curr.split("/").length + 2)
                    .join("/")}
                </span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

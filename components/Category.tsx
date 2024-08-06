import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
interface CategoryProps {
  category: string;
  favorites: string[];
}
const Category: FC<CategoryProps> = ({ category, favorites }) => {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border bg-secondary-600">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">{category}</h4>
        {favorites.map((favorite, ind) => (
          <div key={favorite + ind}>
            <div className="text-sm">{favorite}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
export default Category;

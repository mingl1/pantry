import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CategoryItem } from "@/app/dashboard/page";
interface CategoryProps {
  category: string;
  favorites: CategoryItem[];
  ind: number;
}
const Category: FC<CategoryProps> = ({ category, favorites, ind }) => {
  return (
    <ScrollArea className="h-full w-full rounded-md border bg-secondary-600">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">{category}</h4>
        {favorites &&
          favorites[ind].map((favorite, ind) => (
            <div key={favorite.url + ind}>
              {favorite.icon && (
                <Image
                  src={favorite.icon}
                  alt={`Icon for ${favorite.url}`}
                  width={16}
                  height={16}
                />
              )}
              <a className="text-sm" href={favorite.url}>
                {favorite.name}
              </a>
              <Separator className="my-2" />
            </div>
          ))}
      </div>
    </ScrollArea>
  );
};
export default Category;

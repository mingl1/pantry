"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { BentoGridProps, BentoItem, BentoItems } from "react-bento";
import { CategoryType, CategoryItem } from "@/app/dashboard/page";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
const totalSlots = 4 * 3;
const move = (
  source: Iterable<unknown> | ArrayLike<unknown>,
  destination: Iterable<unknown> | ArrayLike<unknown>,
  droppableSource: { index: number; droppableId: string | number },
  droppableDestination: { index: number; droppableId: string | number }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const reorder = (
  list: Iterable<unknown> | ArrayLike<unknown>,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: CSSProperties | undefined
): CSSProperties => ({
  userSelect: "none" as "none", // Explicitly type the value
  padding: 16,
  margin: `0 0 8px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
});
// const MyBentoGrid = ({
//   categories,
//   initial,
// }: {
//   categories: CategoryType | undefined;
//   initial: React.JSX.Element;
// }) => {
//   return (
//     <BentoGrid
//       items={items}
//       gridCols={5}
//       rowHeight={250}
//       classNames={{
//         container: "w-screen h-screen p-0",
//         elementContainer: "bg-transparent",
//       }}
//     />
//   );
// };
function computeBento(
  num_urls: number,
  total_urls: number
): { width: number; height: number } {
  const percentage = num_urls / total_urls;
  // if (percentage * totalSlots <= 1) {
  // }
  // return { width: 0, height: 0 };
  return { width: 1, height: 1 };
}

export const BentoGrid = ({
  bookmarks,
  gridCols = 4,
  rowHeight = 250,
  classNames,
}: BentoGridProps & {
  bookmarks: CategoryType | undefined;
  // initial: React.JSX.Element;
}): React.ReactNode => {
  const items: BentoItems = [
    // { id: 30, width: 2, height: 2, element: initial, title: "Submit" },
  ];
  const [state, setState] = useState<CategoryItem[]>([]);
  useEffect(() => {
    if (bookmarks) {
      const categories = { ...bookmarks };
      let totalURLS = 0;
      const tempState: CategoryItem[] = [];
      Object.keys(categories).forEach((label) => {
        totalURLS += categories[label].length;
      });
      Object.keys(categories).forEach((label, index) => {
        const num_urls = categories[label].length;
        const { width, height } = computeBento(num_urls, totalURLS);
        tempState.push(categories[label]);
        // items.push({
        //   id: index,
        //   title: label,
        //   element: (
        //     <Category
        //       category={label.split("/").pop()!}
        //       // favorites={categories[label]}
        //       favorites={state}
        //       ind={index}
        //     />
        //   ),
        //   width,
        //   height,
        // });
      });
      setState(tempState);
    }
  }, [bookmarks]);

  function onDragEnd(result: { source: any; destination: any }) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={cn(
          `grid gap-6 p-4 
        ${classNames?.container ?? ""}`
        )}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridAutoRows: `${rowHeight}px`,
        }}
      >
        {state.map((el: CategoryItem, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
                className={cn(
                  ` bento-card bg-white p-4 rounded-2xl overflow-hidden w-full ${
                    classNames?.elementContainer ?? ""
                  }`
                )}
              >
                {el.map((item, index) => (
                  <Draggable
                    key={item.url}
                    draggableId={item.url}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="flex align-center justify-center">
                            {item.icon && (
                              <Image
                                src={item.icon}
                                alt={`Icon image for ${item.name}`}
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                            )}
                            <a href={item.url}>{item.name}</a>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newState = [...state];
                              newState[ind].splice(index, 1);
                              setState(
                                newState.filter((group) => group.length)
                              );
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
export default BentoGrid;

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
import { DragEvent } from "react";
const totalSlots = 4 * 3;
const move = (
  source: CategoryItem,
  destination: CategoryItem,
  droppableSource: { index: number; droppableId: string | number },
  droppableDestination: { index: number; droppableId: string | number }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [id: string | number]: CategoryItem } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const reorder = (list: CategoryItem, startIndex: number, endIndex: number) => {
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
  state,
  setState,
  labels,
  setLabels,
}: BentoGridProps & {
  bookmarks: CategoryType | undefined;
  state: CategoryItem[];
  setState: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  // initial: React.JSX.Element;
}): React.ReactNode => {
  useEffect(() => {
    console.log("bookmark changing");
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
      });
      setState(tempState);
      setLabels(Object.keys(categories));
    }
  }, [bookmarks]);

  function onDragEnd(result: {
    source: { droppableId: number; index: number };
    destination: { droppableId: number; index: number };
  }) {
    const { source, destination } = result;
    console.log(result);

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items: CategoryItem = reorder(
        state[sInd],
        source.index,
        destination.index
      );
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(
        newState.filter((group, index) => {
          if (group.length) {
            return true;
          } else {
            setLabels((labels) => [
              ...labels.slice(0, index),
              ...labels.slice(index + 1),
            ]);
            return false;
          }
        })
      );
    }
  }
  console.log(labels);
  console.log(state);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={cn(
          `grid gap-6 p-4 
        ${classNames?.container ?? ""}`
        )}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridAutoRows: `20%`,
        }}
      >
        {state.map((el: CategoryItem, ind) => (
          <Droppable droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
                className={cn(
                  ` bento-card bg-white p-4 rounded-2xl overflow-y-auto text-wrap overflow-x-hidden ${
                    classNames?.elementContainer ?? ""
                  }`
                )}
              >
                <h1 className="break-words">
                  {labels[ind].replace("/", "\n").trim()}
                </h1>
                {el.map((item, index) => (
                  <Draggable
                    key={item.url}
                    draggableId={item.url}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      if (provided.dragHandleProps) {
                        provided.dragHandleProps.onDragStart = (
                          eve: DragEvent
                        ) => {
                          eve.stopPropagation();
                        };
                      }
                      return (
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
                            className="flex-col"
                          >
                            <div className="flex align-center justify-center text-wrap w-full">
                              {item.icon && (
                                <Image
                                  src={item.icon}
                                  alt={`Icon image for ${item.name}`}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4"
                                />
                              )}
                              <a
                                href={item.url}
                                target="_blank"
                                className="text-wrap break-words"
                              >
                                {item.name}
                              </a>
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
                      );
                    }}
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

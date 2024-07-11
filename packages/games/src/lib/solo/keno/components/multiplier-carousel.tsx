import { useFormContext } from "react-hook-form";

import { IconChevronLeft } from "../../../svgs";
import { Card, CardContent } from "../../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../ui/carousel";
import { cn } from "../../../utils/style";
import { kenoMultipliers } from "../constants";
import { KenoForm } from "../types";

const MultiplierCarousel: React.FC<{ currentNumbers: number[][] }> = ({
  currentNumbers,
}) => {
  const form = useFormContext() as KenoForm;

  const selections = form.watch("selections");

  const selectionsLength = form.watch("selections").length;

  const count = selections.filter((num: any) =>
    currentNumbers.includes(num)
  ).length;

  if (selectionsLength === 0)
    return (
      <div className="wr-flex w-full wr-items-center wr-justify-center wr-rounded-md wr-bg-zinc-900 wr-px-2 wr-py-5 wr-text-[14px] wr-text-zinc-500">
        <div>
          Choose from
          <span className="wr-mx-1 wr-font-medium wr-text-zinc-300">
            1 to 10 numbers{" "}
          </span>{" "}
          to see the odds
        </div>
      </div>
    );

  return (
    <div className="wr-w-[calc(100%-128px)] md:wr-absolute  md:wr-bottom-2">
      <Carousel
        opts={{
          align: "start",
        }}
        className="wr-w-full"
      >
        <CarouselContent className="wr-mx-2">
          {kenoMultipliers[selectionsLength]?.map((m, idx) => {
            if (
              (selectionsLength === 10 && idx === 0) ||
              selectionsLength === 0 ||
              (selectionsLength !== 10 && idx === 10)
            )
              return;

            if (idx <= selectionsLength)
              return (
                <CarouselItem
                  key={idx}
                  className="wr-pl-[8px] md:wr-basis-1/4 lg:wr-basis-1/6"
                >
                  <div>
                    <Card
                      className={cn(
                        "wr-transform wr-select-none wr-border-none wr-bg-zinc-900 wr-transition-all wr-ease-in-out ",
                        {
                          "wr-bg-green-500 wr-text-lime-900": count === idx,
                        }
                      )}
                    >
                      <CardContent className="wr-flex wr-h-full wr-flex-col wr-items-center wr-justify-center wr-gap-1 wr-p-3.5 wr-px-0 wr-text-[14px]">
                        <div
                          className={cn(
                            "wr-text-nowrap wr-shrink-0 wr-break-normal wr-font-medium wr-text-zinc-500",
                            {
                              "wr-text-white": count === idx,
                            }
                          )}
                        >
                          {idx} gems
                        </div>
                        <div
                          className={cn(
                            "wr-transform wr-font-bold wr-text-zinc-400 wr-transition-all wr-ease-in-out",
                            {
                              "wr-text-white": count === idx,
                            }
                          )}
                        >
                          {m < 66 ? m.toFixed(2) : m}x
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            else return;
          })}
        </CarouselContent>
        <CarouselPrevious className="wr-h-[56px] wr-rounded-md wr-bg-zinc-800 wr-p-0">
          <IconChevronLeft className="wr-h-4 wr-w-4" />
        </CarouselPrevious>
        <CarouselNext className="wr-h-[56px] wr-rounded-md wr-bg-zinc-800 wr-p-0">
          <IconChevronLeft className="wr-h-4 wr-w-4 wr-rotate-180" />
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default MultiplierCarousel;

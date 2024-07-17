import * as Progress from "@radix-ui/react-progress";

export const SceneLoader = ({
  percentage,
  loaderImage,
}: {
  percentage: number;
  loaderImage: string;
}) => {
  return (
    <>
      {percentage !== 100 && (
        <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[50] wr-flex wr-h-full wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4">
          <img
            src={loaderImage}
            alt="loader"
            className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-h-full wr-w-full wr-rounded-md"
          />
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            {percentage} %
          </span>
          <Progress.Root
            className="wr-radius-[1000px] wr-relative wr-z-50 wr-h-[25px] wr-w-[320px] wr-overflow-hidden wr-rounded-md wr-bg-black"
            style={{
              transform: "translateZ(0)",
            }}
            value={percentage}
          >
            <Progress.Indicator
              className="wr-h-full wr-w-full wr-bg-gradient-to-t wr-from-unity-horse-race-blue-400 wr-to-unity-horse-race-blue-600"
              style={{
                transform: `translateX(-${100 - percentage}%)`,
                transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </Progress.Root>
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            Horse Race
          </span>
        </div>
      )}
    </>
  );
};

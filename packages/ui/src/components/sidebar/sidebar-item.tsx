import Link from "next/link";

import { cn } from "../../utils";
import { useSidebarStore } from "./sidebar.store";

export const SidebarItem = ({
  children,
  className,
  href,
  target,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: string;
}) => {
  const { isOpen } = useSidebarStore();

  return (
    <Link passHref href={href} target={target}>
      <li
        className={cn(
          "group wr-flex wr-h-10 wr-w-full wr-items-center wr-gap-2 wr-rounded-md wr-px-3 wr-text-[14px] wr-font-semibold wr-text-zinc-500 wr-transition wr-duration-300 wr-ease-out hover:wr-text-white hover:wr-ease-in",
          className && className,
          {
            "wr-flex wr-items-center wr-justify-center wr-px-0": !isOpen,
          }
        )}
      >
        {children}
      </li>
    </Link>
  );
};

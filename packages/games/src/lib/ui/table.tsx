import * as React from "react";

import { cn } from "../utils/style";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="wr-relative wr-w-full wr-overflow-auto">
    <table
      ref={ref}
      className={cn(
        "wr-w-full wr-table-fixed wr-caption-bottom wr-whitespace-nowrap wr-text-sm",
        className
      )}
      {...props}
    />
  </div>
));

Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "wr-h-1 wr-w-10 wr-font-normal wr-text-zinc-500 [&_tr]:wr-border-b",
      className
    )}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:wr-border-0 ", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "wr-bg-muted/50 wr-border-t wr-font-medium [&>tr]:last:wr-border-b-0",
      className
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "wr-hover:bg-muted/50 data-[state=selected]:wr-bg-muted wr-border-b wr-border-b-zinc-800 wr-transition-colors",
      className
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "wr-text-muted-foreground wr-h-12 wr-text-left wr-align-middle wr-text-sm wr-font-medium [&:has([role=checkbox])]:wr-pr-0",
      className
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "wr-py-3 wr-align-middle wr-text-sm wr-font-semibold [&:has([role=checkbox])]:wr-pr-0",
      className
    )}
    {...props}
  />
));

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("wr-text-muted-foreground wr-mt-4 wr-text-sm", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

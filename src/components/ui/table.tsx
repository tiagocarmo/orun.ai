import { cn } from "@/lib/utils";
import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, forwardRef } from "react";

type TableProps = HTMLAttributes<HTMLTableElement>;
type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table ref={ref} className={cn("w-full text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn("border-b border-hairline", className)} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-hairline-soft", className)} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr ref={ref} className={cn("hover:bg-surface-soft transition-colors", className)} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={cn("px-4 py-3 text-body", className)} {...props}>
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";

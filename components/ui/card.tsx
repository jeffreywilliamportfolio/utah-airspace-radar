import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/70 bg-panel/90 shadow-panel backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

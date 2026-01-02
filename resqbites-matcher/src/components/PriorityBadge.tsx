import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const priorityBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
  {
    variants: {
      priority: {
        High: "bg-priority-high/15 text-priority-high border border-priority-high/30",
        Medium: "bg-priority-medium/15 text-priority-medium border border-priority-medium/30",
        Low: "bg-priority-low/15 text-priority-low border border-priority-low/30",
      },
    },
    defaultVariants: {
      priority: "Medium",
    },
  }
);

interface PriorityBadgeProps extends VariantProps<typeof priorityBadgeVariants> {
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span className={cn(priorityBadgeVariants({ priority }), className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        priority === "High" && "bg-priority-high animate-pulse-gentle",
        priority === "Medium" && "bg-priority-medium",
        priority === "Low" && "bg-priority-low"
      )} />
      {priority}
    </span>
  );
}

import { cn } from "@/lib/utils";

interface MatchScoreProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MatchScore({ percentage, size = "md", showLabel = true }: MatchScoreProps) {
  const getGradientClass = () => {
    if (percentage >= 90) return "gradient-match-excellent";
    if (percentage >= 75) return "gradient-match-good";
    return "gradient-match-fair";
  };

  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-20 h-20 text-xl",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-primary-foreground shadow-medium",
          getGradientClass(),
          sizeClasses[size]
        )}
      >
        {percentage}%
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground font-medium">Match</span>
      )}
    </div>
  );
}

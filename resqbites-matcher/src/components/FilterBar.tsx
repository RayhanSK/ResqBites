import { foodCategories } from "@/data/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Clock, Percent } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "match" | "expiry";
  onSortChange: (sort: "match" | "expiry") => void;
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card rounded-xl border border-border/50 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48 bg-background">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {foodCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <div className="flex gap-1">
          <Button
            variant={sortBy === "match" ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange("match")}
            className="gap-1.5"
          >
            <Percent className="w-3.5 h-3.5" />
            Match %
          </Button>
          <Button
            variant={sortBy === "expiry" ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange("expiry")}
            className="gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Expiry
          </Button>
        </div>
      </div>
    </div>
  );
}

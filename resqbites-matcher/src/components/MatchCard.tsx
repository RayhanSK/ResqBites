import { DonationMatch } from "@/data/backendMatches";
import { PriorityBadge } from "./PriorityBadge";
import { MatchScore } from "./MatchScore";
import { MapPin, Clock, Package, Utensils } from "lucide-react";
import { motion } from "framer-motion";

interface MatchCardProps {
  match: DonationMatch;
  index: number;
}

export function MatchCard({ match, index }: MatchCardProps) {
  const getExpiryColor = () => {
    if (match.hours_to_expiry <= 6) return "text-urgent";
    if (match.hours_to_expiry <= 24) return "text-warning";
    return "text-muted-foreground";
  };

  const formatExpiry = () => {
    if (match.hours_to_expiry < 24) {
      return `${match.hours_to_expiry}h`;
    }
    return `${Math.floor(match.hours_to_expiry / 24)}d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card-elevated card-hover p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <PriorityBadge priority={match.priority as "High" | "Medium" | "Low"} />
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
              {match.food_category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Donor</p>
              <p className="font-semibold text-foreground">{match.donor_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Recipient</p>
              <p className="font-semibold text-foreground">{match.recipient_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{match.distance_km} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{match.quantity_kg} kg</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${getExpiryColor()}`}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatExpiry()}</span>
            </div>
          </div>
        </div>

        <MatchScore percentage={match.match_percentage} />
      </div>
    </motion.div>
  );
}

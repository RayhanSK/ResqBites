import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { FilterBar } from "@/components/FilterBar";
import { backendMatches as mockMatches, DonationMatch } from "@/data/backendMatches";
import { motion } from "framer-motion";
import { TrendingUp, Package, Clock, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState<"match" | "expiry">("match");

  const filteredAndSortedMatches = useMemo(() => {
    let result = [...mockMatches];

    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter((m) => m.food_category === selectedCategory);
    }

    // Sort
    if (sortBy === "match") {
      result.sort((a, b) => b.match_percentage - a.match_percentage);
    } else {
      result.sort((a, b) => a.hours_to_expiry - b.hours_to_expiry);
    }

    return result;
  }, [selectedCategory, sortBy]);

  const stats = useMemo(() => {
    const avgMatch = Math.round(
      mockMatches.reduce((sum, m) => sum + m.match_percentage, 0) / mockMatches.length
    );
    const totalQuantity = mockMatches.reduce((sum, m) => sum + m.quantity_kg, 0);
    const urgentCount = mockMatches.filter((m) => m.hours_to_expiry <= 6).length;
    const highPriority = mockMatches.filter((m) => m.priority === "High").length;

    return { avgMatch, totalQuantity, urgentCount, highPriority };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Match Dashboard</h1>
          <p className="text-muted-foreground">
            AI-computed donor-recipient matches ranked by compatibility score.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgMatch}%</p>
                <p className="text-xs text-muted-foreground">Avg Match</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalQuantity} kg</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-urgent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-urgent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent (&lt;6h)</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mb-4"
        >
          Showing {filteredAndSortedMatches.length} matches
        </motion.p>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAndSortedMatches.map((match, index) => (
            <MatchCard key={`${match.donor_id}-${match.recipient_id}`} match={match} index={index} />
          ))}
        </div>

        {filteredAndSortedMatches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No matches found for the selected filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

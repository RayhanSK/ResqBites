import { Header } from "@/components/Header";
import { MapVisualization } from "@/components/MapVisualization";
import { backendMatches as mockMatches, DonationMatch } from "@/data/backendMatches";
import { motion } from "framer-motion";
import { Square, Circle } from "lucide-react";

const MapPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Map Visualization</h1>
          <p className="text-muted-foreground">
            Interactive map showing donors, recipients, and their match connections.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-6 mb-6 p-4 bg-card rounded-xl border border-border/50 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-sm" />
            <span className="text-sm text-muted-foreground">Donors (Restaurants, Hotels)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded-full" />
            <span className="text-sm text-muted-foreground">Recipients (NGOs, Shelters)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary/60 border-dashed border-t-2 border-primary/40" />
            <span className="text-sm text-muted-foreground">Match Connection</span>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[600px]"
        >
          <MapVisualization matches={mockMatches} />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-secondary/50 rounded-xl"
        >
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Click on markers to view details. 
            Hover over connection lines to see match percentages. The map displays{" "}
            {mockMatches.length} active donor-recipient matches.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default MapPage;

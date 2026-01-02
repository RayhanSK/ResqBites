import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DonationMatch } from "@/data/mockMatches";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Key } from "lucide-react";

interface MapVisualizationProps {
  matches: DonationMatch[];
}

export function MapVisualization({ matches }: MapVisualizationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [error, setError] = useState("");

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      // Calculate center from matches
      const avgLat = matches.reduce((sum, m) => sum + (m.donor_lat + m.recipient_lat) / 2, 0) / matches.length;
      const avgLon = matches.reduce((sum, m) => sum + (m.donor_lon + m.recipient_lon) / 2, 0) / matches.length;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [avgLon, avgLat],
        zoom: 11,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        // Add lines connecting donors to recipients
        const lineFeatures = matches.map((match) => ({
          type: "Feature" as const,
          properties: { matchPercentage: match.match_percentage },
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [match.donor_lon, match.donor_lat],
              [match.recipient_lon, match.recipient_lat],
            ],
          },
        }));

        map.current!.addSource("match-lines", {
          type: "geojson",
          data: { type: "FeatureCollection", features: lineFeatures },
        });

        map.current!.addLayer({
          id: "match-lines",
          type: "line",
          source: "match-lines",
          paint: {
            "line-color": "#3d8b6e",
            "line-width": 2,
            "line-opacity": 0.6,
            "line-dasharray": [2, 2],
          },
        });

        // Add donor markers (squares)
        matches.forEach((match) => {
          const donorEl = document.createElement("div");
          donorEl.className = "w-5 h-5 bg-primary rounded-sm border-2 border-primary-foreground shadow-medium cursor-pointer";
          donorEl.style.backgroundColor = "#3d8b6e";

          const donorPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <p class="font-semibold text-sm">${match.donor_id}</p>
              <p class="text-xs text-muted-foreground">Donor</p>
              <p class="text-xs mt-1">${match.food_category}</p>
              <p class="text-xs">${match.quantity_kg} kg available</p>
            </div>
          `);

          new mapboxgl.Marker({ element: donorEl })
            .setLngLat([match.donor_lon, match.donor_lat])
            .setPopup(donorPopup)
            .addTo(map.current!);

          // Add recipient markers (circles)
          const recipientEl = document.createElement("div");
          recipientEl.className = "w-5 h-5 rounded-full border-2 border-white shadow-medium cursor-pointer";
          recipientEl.style.backgroundColor = "#e69500";

          const recipientPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <p class="font-semibold text-sm">${match.recipient_id}</p>
              <p class="text-xs text-muted-foreground">Recipient</p>
              <p class="text-xs mt-1 font-medium" style="color: #3d8b6e">${match.match_percentage}% Match</p>
            </div>
          `);

          new mapboxgl.Marker({ element: recipientEl })
            .setLngLat([match.recipient_lon, match.recipient_lat])
            .setPopup(recipientPopup)
            .addTo(map.current!);
        });
      });

      setIsTokenSet(true);
      setError("");
    } catch (err) {
      setError("Invalid Mapbox token. Please check and try again.");
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <div className="h-full min-h-[500px] rounded-xl bg-card border border-border/50 shadow-soft flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Mapbox API Token Required</h3>
            <p className="text-muted-foreground text-sm">
              Enter your Mapbox public token to view the interactive map.
              Get one free at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijo..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button onClick={initializeMap} disabled={!mapboxToken} className="w-full">
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[500px] rounded-xl overflow-hidden shadow-medium">
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />
    </div>
  );
}

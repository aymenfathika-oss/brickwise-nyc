"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BuildingRecord } from "@/lib/types";
import Link from "next/link";

function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #F7F3E8;transform:rotate(-45deg);box-shadow:0 1px 2px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 14],
  });
}

const BOROUGH_COLOR: Record<string, string> = {
  MN: "#B23A2E",
  BK: "#2F6F8F",
  QN: "#3F7D4E",
  BX: "#B8901F",
  SI: "#6B4E71",
};

export default function MapView({ records }: { records: BuildingRecord[] }) {
  const withCoords = records.filter((r) => r.latitude && r.longitude);
  const center: [number, number] =
    withCoords.length > 0
      ? [parseFloat(withCoords[0].latitude!), parseFloat(withCoords[0].longitude!)]
      : [40.7128, -74.006];

  return (
    <MapContainer
      center={center}
      zoom={withCoords.length ? 13 : 11}
      scrollWheelZoom={false}
      className="w-full h-full rounded-sm"
      style={{ background: "#EDE7D8" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {withCoords.map((r) => (
        <Marker
          key={r.bbl}
          position={[parseFloat(r.latitude!), parseFloat(r.longitude!)]}
          icon={pinIcon(BOROUGH_COLOR[r.borough] ?? "#1C2530")}
        >
          <Popup>
            <div className="font-body text-sm">
              <p className="font-medium">{r.address}</p>
              <p className="text-xs text-inkSoft">Built {r.yearbuilt || "unknown"}</p>
              <Link href={`/property/${r.bbl}`} className="text-xs text-blueprint underline">
                View record
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

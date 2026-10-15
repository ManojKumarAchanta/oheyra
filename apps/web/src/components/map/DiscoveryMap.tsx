'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Event } from '@oheyra/contracts';
import { Locate, RotateCcw } from 'lucide-react';

interface DiscoveryMapProps {
  events: Event[];
  selectedEventId?: string | null;
  onSelectEvent: (event: Event) => void;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

// CARTO Dark Matter or OpenFreeMap Vector/Raster Basemap Style
const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const FALLBACK_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap Contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function DiscoveryMap({
  events,
  selectedEventId,
  onSelectEvent,
  center = [78.435, 17.42], // Hyderabad Jubilee/Banjara core
  zoom = 12.5,
}: DiscoveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: center,
        zoom: zoom,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: '© OpenStreetMap, © CARTO',
        }),
        'bottom-right'
      );

      // Force resize once loaded so tiles render immediately
      map.on('load', () => {
        map.resize();
      });

      // Fallback to raster OSM if vector style fails to load
      map.on('error', (e) => {
        console.warn('MapLibre style notice, checking tiles:', e);
        if (e?.error?.message?.includes('style') || e?.error?.message?.includes('Failed to fetch')) {
          try {
            map.setStyle(FALLBACK_RASTER_STYLE);
          } catch {
            // style switch fallback
          }
        }
      });

      const handleResize = () => map.resize();
      window.addEventListener('resize', handleResize);
      setTimeout(() => map.resize(), 100);

      mapRef.current = map;
    } catch (err) {
      console.warn('MapLibre initialization warning:', err);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    events.forEach((event) => {
      const isSelected = event.id === selectedEventId;
      const el = document.createElement('div');
      el.className = 'oheyra-map-pin cursor-pointer transition-transform duration-200';
      el.style.width = isSelected ? '36px' : '28px';
      el.style.height = isSelected ? '36px' : '28px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = event.category?.colorHex || '#8B5CF6';
      el.style.border = isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.7)';
      el.style.boxShadow = isSelected
        ? '0 0 20px 4px rgba(139, 92, 246, 0.8)'
        : '0 4px 10px rgba(0,0,0,0.5)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#ffffff';
      el.style.fontSize = isSelected ? '14px' : '11px';
      el.style.fontWeight = 'bold';
      el.innerText = event.priceType === 'free' ? '★' : '₹';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(event);
        map.flyTo({
          center: [event.location.lng, event.location.lat],
          zoom: Math.max(map.getZoom(), 14),
          duration: 600,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.location.lng, event.location.lat])
        .addTo(map);

      markersRef.current[event.id] = marker;
    });
  }, [events, selectedEventId, onSelectEvent]);

  // Fly to selected event when changed from feed
  useEffect(() => {
    if (!selectedEventId || !mapRef.current) return;
    const target = events.find((e) => e.id === selectedEventId);
    if (target) {
      mapRef.current.flyTo({
        center: [target.location.lng, target.location.lat],
        zoom: 14,
        duration: 500,
      });
    }
  }, [selectedEventId, events]);

  const handleRecenter = () => {
    mapRef.current?.flyTo({
      center: center,
      zoom: zoom,
      duration: 600,
    });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current?.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 14,
            duration: 600,
          });
        },
        () => {
          alert('Location access denied. Centering on Jubilee Hills, Hyderabad.');
          handleRecenter();
        }
      );
    }
  };

  return (
    <div className="relative h-full w-full min-h-[350px] bg-neutral-950 overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          aria-label="Locate near me"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/90 text-white backdrop-blur-md border border-border shadow-lg hover:bg-surface-elevated transition-colors"
        >
          <Locate className="h-4 w-4 text-electric-cyan" />
        </button>
        <button
          onClick={handleRecenter}
          aria-label="Recenter map"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/90 text-white backdrop-blur-md border border-border shadow-lg hover:bg-surface-elevated transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-neutral-300" />
        </button>
      </div>
    </div>
  );
}

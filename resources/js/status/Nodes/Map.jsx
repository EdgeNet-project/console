import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import {Center, Group, SegmentedControl, Stack} from "@mantine/core";

// const geoUrl =
//     "public/maps/countries-110m.json";
const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const zoom = {
    europe: {
        center: [15, 52],
        scale: 500,
    },
    north_america: {
        center: [-100, 45],
        scale: 500,
    },
    south_america: {
        center: [-60, -18],
        scale: 350,
    },
    asia: {
        center: [95, 35],
        scale: 250,
    },
    africa: {
        center: [20, 5],
        scale: 350,
    },
    oceania: {
        center: [135, -25],
        scale: 300,
    },
    world: {
        center: [0, 20],
        scale: 150,
    }
};

export default function Map({nodes}) {
    const [hovered, setHovered] = useState(null);
    const [region, setRegion] = useState('world');

    const markers = nodes.map(node => ({
        name: node.name,
        coordinates: [node.location?.longitude, node.location?.latitude],
    }))

    return (
        <Stack>
                <Center>
                    <SegmentedControl
                        size="xs" withItemsBorders={false}
                        data={[
                            { value: 'world', label: 'World' },
                            { value: 'europe', label: 'Europe' },
                            { value: 'north_america', label: 'North America' },
                            { value: 'south_america', label: 'South America' },
                            { value: 'asia', label: 'Asia' },
                        ]}
                        value={region}
                        onChange={(value) => setRegion(value)}
                    />
                </Center>

                <div style={{ width: "100%"}}>
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={zoom[region]}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#EEE"
                                        stroke="#AAA"
                                    />
                                ))
                            }
                        </Geographies>

                        {markers.map((marker) => (
                            <Marker
                                key={marker.name}
                                coordinates={marker.coordinates}
                                onMouseEnter={() => setHovered(marker)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <circle
                                    r={5}
                                    fill="#F53"
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>
        </Stack>
    );
}
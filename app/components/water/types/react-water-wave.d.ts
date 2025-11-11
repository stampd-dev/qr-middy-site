declare module "react-water-wave" {
  import * as React from "react";

  export interface WaterWaveProps {
    imageUrl?: string;
    children?: (methods: unknown) => React.ReactNode;
    style?: React.CSSProperties;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
  }

  const WaterWave: React.ComponentType<WaterWaveProps>;

  export default WaterWave;
}

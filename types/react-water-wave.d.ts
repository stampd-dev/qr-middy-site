declare module "react-water-wave" {
  import { CSSProperties, ReactNode } from "react";

  export interface WaterWaveMethods {
    drop?: (opts: {
      x: number;
      y: number;
      radius: number;
      strength: number;
    }) => void;
  }

  export interface WaterWaveProps {
    imageUrl: string;
    style?: CSSProperties;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
    interactive?: boolean;
    children: (methods: WaterWaveMethods) => ReactNode;
  }

  const WaterWave: React.ComponentType<WaterWaveProps>;
  export default WaterWave;
}


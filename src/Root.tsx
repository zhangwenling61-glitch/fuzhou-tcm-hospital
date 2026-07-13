import { Composition } from "remotion";
import { FuzhouHospitalBanner } from "./FuzhouHospitalBanner";

export const RemotionRoot = () => {
  return (
    <Composition
      id="FuzhouHospitalBanner"
      component={FuzhouHospitalBanner}
      durationInFrames={105}
      fps={30}
      width={1080}
      height={844}
    />
  );
};

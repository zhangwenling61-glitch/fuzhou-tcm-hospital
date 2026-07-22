import { Composition } from "remotion";
import { FuzhouHospitalBanner } from "./FuzhouHospitalBanner";

export const RemotionRoot = () => {
  return (
    <Composition
      id="FuzhouHospitalBanner"
      component={FuzhouHospitalBanner}
      durationInFrames={60}
      fps={30}
      width={2160}
      height={865}
    />
  );
};

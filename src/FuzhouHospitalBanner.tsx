import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

const W = 2160;
const H = 865;

type ServiceItemProps = {
  left: number;
  label: string;
  children: React.ReactNode;
  scalePulse: number;
};

const AssetIcon = ({ file }: { file: string }) => (
  <Img
    src={staticFile(`assets/${file}`)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
);

const ServiceItem = ({
  left,
  label,
  children,
  scalePulse,
}: ServiceItemProps) => {
  const scale = 1 + scalePulse * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 0,
        width: 342,
        height: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 18,
        border: "3.6px solid #fff",
        borderRadius: 77.4,
        background: "rgba(255,255,255,0.8)",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        zIndex: scalePulse > 0.01 ? 10 : 1,
      }}
    >
      <div style={{ position: "relative", width: 221.184, height: 221.184 }}>
        {children}
      </div>
      <div
        style={{
          minWidth: "100%",
          marginTop: 10,
          textAlign: "center",
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: 59.4,
          lineHeight: "86.4px",
          fontWeight: 500,
          color: "#00603d",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const FuzhouHospitalBanner = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // 4.5秒 (135帧) 循环
  // 阶段一：卡片依次波浪脉冲放大 (0.4s -> 1.6s)
  const animatePulse = (startSec: number, durationSec: number) => {
    const startFrame = startSec * fps;
    const durFrames = durationSec * fps;
    if (frame >= startFrame && frame <= startFrame + durFrames) {
      const p = (frame - startFrame) / durFrames;
      // 升余弦 Hann 窗：绝对光滑起止
      return (1 - Math.cos(p * Math.PI * 2)) * 0.5;
    }
    return 0;
  };

  const pulse0 = animatePulse(0.4, 0.35);
  const pulse1 = animatePulse(0.6, 0.35);
  const pulse2 = animatePulse(0.8, 0.35);
  const pulse3 = animatePulse(1.0, 0.35);
  const pulse4 = animatePulse(1.2, 0.35);

  const qrScale = 1 + pulse4 * 0.06;

  // 阶段二：气泡全程连续正弦极顺滑浮动，3.5 秒 (105 帧) 周期
  const bubbleTranslateY = Math.sin((frame / 105) * Math.PI * 2) * -14;

  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          overflow: "hidden",
          borderRadius: 0,
          background:
            "linear-gradient(180deg, #eff8e8 0%, #e9f6e2 14.539%, #dcf2d2 100%)",
        }}
      >
        {/* 顶部服务卡片列表区域 */}
        <div
          style={{
            position: "absolute",
            left: 66,
            top: 111.53,
            width: 1584,
            height: 360,
          }}
        >
          <ServiceItem left={0} label="预约挂号" scalePulse={pulse0}>
            <AssetIcon file="icon-calendar-bg.svg" />
            <Img
              src={staticFile("assets/icon-calendar-mark.svg")}
              style={{
                position: "absolute",
                left: "26%",
                top: "26.4%",
                width: "48%",
                height: "47.2%",
                objectFit: "contain",
              }}
            />
          </ServiceItem>

          <ServiceItem left={414} label="在线问诊" scalePulse={pulse1}>
            <AssetIcon file="icon-consult.svg" />
          </ServiceItem>

          <ServiceItem left={828} label="中药续方" scalePulse={pulse2}>
            <AssetIcon file="icon-prescription.svg" />
          </ServiceItem>

          <ServiceItem left={1242} label="便捷配药" scalePulse={pulse3}>
            <AssetIcon file="icon-preparation.png" />
          </ServiceItem>
        </div>

        {/* 吉祥物 Mascot 卡片 */}
        <div
          style={{
            position: "absolute",
            left: 1590,
            top: 112,
            width: 595,
            height: 753,
            transform: `scale(${qrScale})`,
            transformOrigin: "center center",
            zIndex: pulse4 > 0.01 ? 10 : 1,
          }}
        >
          <Img
            src={staticFile("assets/mascot.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 下方提示气泡 (全程连续正弦浮动) */}
        <div
          style={{
            position: "absolute",
            left: 66,
            top: 499,
            width: 1524,
            height: 234,
            transform: `translateY(${bubbleTranslateY}px)`,
          }}
        >
          <Img
            src={staticFile("assets/prompt-bar-new.svg")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "59.5%",
              transform: "translate(-50%, -50%)",
              fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
              fontSize: 58,
              lineHeight: "86.4px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#8ba182" }}>更多服务，点击进入</span>
            <span style={{ color: "#00603d" }}>“福州市中医院互联网医院”小程序</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

const W = 1080;
const H = 844;

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
        width: 213.75,
        height: 225,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 11.25,
        border: "2.25px solid #fff",
        borderRadius: 48.375,
        background: "rgba(255,255,255,0.8)",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        zIndex: scalePulse > 0.01 ? 10 : 1,
      }}
    >
      <div style={{ position: "relative", width: 138.24, height: 138.24 }}>
        {children}
      </div>
      <div
        style={{
          minWidth: "100%",
          marginTop: 6.25,
          textAlign: "center",
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: 37.125,
          lineHeight: "54px",
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

  // 3.5秒 (105帧) 核心循环，卡片和吉祥物依次脉冲放大
  const animatePulse = (startSec: number, durationSec: number) => {
    const startFrame = startSec * fps;
    const durFrames = durationSec * fps;
    if (frame >= startFrame && frame <= startFrame + durFrames) {
      const p = (frame - startFrame) / durFrames;
      return (1 - Math.cos(p * Math.PI * 2)) * 0.5;
    }
    return 0;
  };

  const pulse0 = animatePulse(0.4, 0.35); // 预约挂号
  const pulse1 = animatePulse(0.6, 0.35); // 在线问诊
  const pulse2 = animatePulse(0.8, 0.35); // 复诊续方
  const pulse3 = animatePulse(1.0, 0.35); // 便捷配药
  const pulse4 = animatePulse(1.2, 0.35); // 吉祥物 Mascot

  const mascotScale = 1 + pulse4 * 0.05;

  // 浮动动效 (3.5秒 105帧 连续循环)
  const mascotY = Math.sin((frame / 105) * Math.PI * 2) * -8;
  const cloud1X = Math.sin((frame / 105) * Math.PI * 2) * 12;
  const cloud1Y = Math.cos((frame / 105) * Math.PI * 2) * 6;
  const cloud2X = -Math.sin((frame / 105) * Math.PI * 2) * 9;
  const cloud2Y = -Math.cos((frame / 105) * Math.PI * 2) * 9;
  const cloud3X = Math.cos((frame / 105) * Math.PI * 2) * 8;
  const cloud3Y = Math.sin((frame / 105) * Math.PI * 2) * 10;

  // 手势与提示条点击联动动效 (1.5秒 45帧 循环一次)
  const clickFrame = frame % 45;

  // 1. 手势“缩回-冲刺”动画
  let handScale = 1;
  let handTranslateX = 0;
  let handTranslateY = 0;
  let handRotate = 0;

  if (clickFrame < 18) {
    // 0% ~ 40% (0 ~ 18帧)：缓慢收回蓄力
    const p = clickFrame / 18;
    handScale = 1 + p * 0.05;
    handTranslateX = p * 8;
    handTranslateY = p * -8;
    handRotate = p * 3;
  } else if (clickFrame < 22.5) {
    // 40% ~ 50% (18 ~ 22.5帧)：快速击下
    const p = (clickFrame - 18) / 4.5;
    handScale = 1.05 - p * 0.20;
    handTranslateX = 8 - p * 12;
    handTranslateY = -8 + p * 12;
    handRotate = 3 - p * 5;
  } else if (clickFrame < 27) {
    // 50% ~ 60% (22.5 ~ 27帧)：快速回弹
    const p = (clickFrame - 22.5) / 4.5;
    handScale = 0.85 + p * 0.15;
    handTranslateX = -4 + p * 4;
    handTranslateY = 4 - p * 4;
    handRotate = -2 + p * 2;
  }

  // 2. 气泡条点击放大缩放脉冲
  let bubbleScale = 1;
  if (clickFrame >= 21.6 && clickFrame < 22.5) {
    const p = (clickFrame - 21.6) / 0.9;
    bubbleScale = 1 - p * 0.02; // 微扁
  } else if (clickFrame >= 22.5 && clickFrame < 26.1) {
    const p = (clickFrame - 22.5) / 3.6;
    bubbleScale = 0.98 + p * 0.055; // 放大 3.5%
  } else if (clickFrame >= 26.1 && clickFrame < 31.5) {
    const p = (clickFrame - 26.1) / 5.4;
    bubbleScale = 1.035 - p * 0.035; // 恢复
  }

  // 3. 金圈波纹扩散
  let ripple1Scale = 0.2;
  let ripple1Opacity = 0;
  if (clickFrame >= 21.6 && clickFrame < 30.15) {
    const p = (clickFrame - 21.6) / (30.15 - 21.6);
    ripple1Scale = 0.2 + p * 2.3;
    ripple1Opacity = p < 0.1 ? p * 10 * 0.8 : 0.8 * (1 - (p - 0.1) / 0.9);
  }

  let ripple2Scale = 0.2;
  let ripple2Opacity = 0;
  if (clickFrame >= 23.85 && clickFrame < 33.75) {
    const p = (clickFrame - 23.85) / (33.75 - 23.85);
    ripple2Scale = 0.2 + p * 3.6;
    ripple2Opacity = p < 0.1 ? p * 10 * 0.6 : 0.6 * (1 - (p - 0.1) / 0.9);
  }

  // 4. 文字金色流光扫掠
  let shinePosition = -50;
  if (clickFrame >= 22.5 && clickFrame < 38.25) {
    const p = (clickFrame - 22.5) / (38.25 - 22.5);
    shinePosition = -50 + p * 200; // 扫向左侧
  }

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
          background:
            "linear-gradient(180deg, #eff8e8 0%, #e9f6e2 14.54%, #dcf2d2 100%)",
        }}
      >
        {/* 底部绿植背景装饰 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: -38.82,
            width: 1096.438,
            height: 460.822,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("assets/bg.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 顶部标题装饰组 */}
        <div
          style={{
            position: "absolute",
            left: 104.29,
            top: 130.88,
            width: 101.94,
            height: 1.172,
            background:
              "linear-gradient(90deg, rgba(250,251,244,0) 0%, #00603d 100%)",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 508.53,
            top: 130.88,
            width: 101.94,
            height: 1.172,
            background:
              "linear-gradient(90deg, #00603d 0%, rgba(250,251,244,0) 100%)",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 223.8,
            top: 101,
            fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
            fontSize: 44.526,
            color: "#00603d",
            fontWeight: 500,
            whiteSpace: "nowrap",
            zIndex: 11,
          }}
        >
          福州市中医院
        </div>
        <div
          style={{
            position: "absolute",
            left: 104.4,
            top: 174.06,
            width: 496.629,
            height: 108.853,
            zIndex: 10,
          }}
        >
          <Img
            src={staticFile("assets/title_hospital.svg")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* 吉祥物 IP 与漂浮云朵组 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            zIndex: 12,
            pointerEvents: "none",
          }}
        >
          {/* 吉祥物 */}
          <div
            style={{
              position: "absolute",
              left: 706.59,
              top: 31.48,
              width: 308.466,
              height: 390.575,
              transform: `translateY(${mascotY}px) scale(${mascotScale})`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile("assets/ip.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          {/* 云朵 2 */}
          <div
            style={{
              position: "absolute",
              left: 685.73,
              top: 166.41,
              width: 128.47,
              height: 162.713,
              transform: `translate(${cloud2X}px, ${cloud2Y}px)`,
            }}
          >
            <Img
              src={staticFile("assets/cloud.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          {/* 云朵 3 */}
          <div
            style={{
              position: "absolute",
              left: 958.03,
              top: 19.5,
              width: 87.921,
              height: 111.355,
              transform: `translate(${cloud3X}px, ${cloud3Y}px)`,
            }}
          >
            <Img
              src={staticFile("assets/cloud.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          {/* 云朵 1 */}
          <div
            style={{
              position: "absolute",
              left: 914.3,
              top: 280.03,
              width: 175.315,
              height: 221.918,
              transform: `translate(${cloud1X}px, ${cloud1Y}px)`,
            }}
          >
            <Img
              src={staticFile("assets/cloud.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* 核心服务入口卡片组 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 391,
            width: 990,
            height: 225,
            zIndex: 15,
          }}
        >
          <ServiceItem left={0} label="预约挂号" scalePulse={pulse0}>
            <AssetIcon file="icon1_bg.svg" />
            <Img
              src={staticFile("assets/icon1_fg.svg")}
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

          <ServiceItem left={258.75} label="在线问诊" scalePulse={pulse1}>
            <AssetIcon file="icon2.svg" />
          </ServiceItem>

          <ServiceItem left={517.5} label="复诊续方" scalePulse={pulse2}>
            <AssetIcon file="icon3.svg" />
          </ServiceItem>

          <ServiceItem left={776.25} label="便捷配药" scalePulse={pulse3}>
            <Img
              src={staticFile("assets/icon4_bg.svg")}
              style={{
                position: "absolute",
                left: "6.7%",
                top: "3.09%",
                width: "86.6%",
                height: "93.82%",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "25.6%",
                top: "25.2%",
                width: "61.85%",
                height: "51.8%",
                WebkitMaskImage: `url(${staticFile("assets/icon4_mask.svg")})`,
                maskImage: `url(${staticFile("assets/icon4_mask.svg")})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "-26.18px -30.6px",
                maskPosition: "-26.18px -30.6px",
                WebkitMaskSize: "119.72px 129.69px",
                maskSize: "119.72px 129.69px",
              }}
            >
              <Img
                src={staticFile("assets/icon4_fg.svg")}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </ServiceItem>
        </div>

        {/* 下方提示气泡 (静止，带有点击放大脉冲) */}
        <div
          style={{
            position: "absolute",
            left: 80.55,
            top: 639,
            width: 918.575,
            height: 141.041,
            transform: `scale(${bubbleScale})`,
            transformOrigin: "center center",
            zIndex: 20,
          }}
        >
          <Img
            src={staticFile("assets/bottom_bar.svg")}
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
              top: "59.2%", // 精确垂直居中于矩形
              transform: "translate(-50%, -50%)",
              fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
              fontSize: 35.8,
              lineHeight: "45px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#8ba182" }}>点击进入</span>
            <span
              style={{
                background:
                  "linear-gradient(110deg, #00603d 0%, #00603d 40%, #e2ffd1 50%, #00603d 60%, #00603d 100%)",
                backgroundSize: "200% 100%",
                backgroundPosition: `${shinePosition}% 0`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              “福州市中医院互联网医院”小程序
            </span>
          </div>

          {/* 嵌套在底条内部的引导手势与波纹，以实现同步缩放 */}
          <div
            style={{
              position: "absolute",
              left: 848.45, // 929 - 80.55
              top: 71, // 710 - 639
              width: 128,
              height: 128,
              zIndex: 100,
              pointerEvents: "none",
            }}
          >
            {/* Ripple 1 */}
            <div
              style={{
                position: "absolute",
                left: 34,
                top: 20,
                width: 28,
                height: 28,
                transform: `translate(-50%, -50%) scale(${ripple1Scale})`,
                transformOrigin: "center center",
                opacity: ripple1Opacity,
              }}
            >
              <Img
                src={staticFile("assets/ripple_circle1.svg")}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Ripple 2 */}
            <div
              style={{
                position: "absolute",
                left: 34,
                top: 20,
                width: 46,
                height: 46,
                transform: `translate(-50%, -50%) scale(${ripple2Scale})`,
                transformOrigin: "center center",
                opacity: ripple2Opacity,
              }}
            >
              <Img
                src={staticFile("assets/ripple_circle2.svg")}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Hand Image wrapper for overflow hidden clipping */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                transform: `scale(${handScale}) translate(${handTranslateX}px, ${handTranslateY}px) rotate(${handRotate}deg)`,
                transformOrigin: "34px 20px",
              }}
            >
              <Img
                src={staticFile("assets/hand_gesture.png")}
                style={{
                  position: "absolute",
                  left: "9.01%",
                  top: "-11.01%",
                  width: "100%",
                  height: "100%",
                  maxWidth: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion"

const W = 1080
const H = 612

type CardProps = { left: number; label: string; pulse: number; children: React.ReactNode }

const Card = ({ left, label, pulse, children }: CardProps) => (
  <div style={{ position: "absolute", left, top: 54, width: 166, height: 174, border: "1.8px solid #fff", borderRadius: 38, background: "rgba(255,255,255,.8)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 9, boxSizing: "border-box", transform: `scale(${1 + pulse * 0.08})`, transformOrigin: "center center", zIndex: pulse > 0.01 ? 8 : 1 }}>
    <div style={{ position: "relative", width: 107, height: 107 }}>{children}</div>
    <div style={{ marginTop: 8, color: "#00603d", fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 29, lineHeight: "43px", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</div>
  </div>
)

const Icon = ({ file }: { file: string }) => <Img src={staticFile(`assets/${file}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />

export const FuzhouHospitalBanner = () => {
  const frame = useCurrentFrame()
  const loopPhase = Math.min(frame, 104) / 104
  const cloudPhase = loopPhase
  const ipPhase = loopPhase
  const pulse = (start: number) => {
    const progress = (frame - start) / 12
    return progress >= 0 && progress <= 1 ? Math.sin(progress * Math.PI) : 0
  }
  const floatY = Math.sin(ipPhase * Math.PI * 2) * -7
  const bubbleY = Math.sin(cloudPhase * Math.PI * 2 + Math.PI / 3) * -4
  const cloudLeftX = Math.sin(cloudPhase * Math.PI * 2) * 7
  const cloudLeftY = Math.cos(cloudPhase * Math.PI * 2) * 4
  const cloudBottomX = Math.sin(cloudPhase * Math.PI * 2 + Math.PI) * 10
  const cloudBottomY = Math.cos(cloudPhase * Math.PI * 2 + Math.PI) * 7

  return <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg,#eff8e8 0%,#e9f6e2 14.539%,#dcf2d2 100%)" }}>
    <AbsoluteFill style={{ top: 15, width: W, height: H, overflow: "hidden", transform: "scale(2)", transformOrigin: "top left" }}>
    <Card left={30} label="预约挂号" pulse={pulse(0)}>
      <Icon file="icon1_bg.svg" />
      <Img src={staticFile("assets/icon1_fg.svg")} style={{ position: "absolute", left: "26%", top: "26.4%", width: "48%", height: "47.2%" }} />
    </Card>
    <Card left={226} label="在线问诊" pulse={pulse(12)}><Icon file="icon2.svg" /></Card>
    <Card left={422} label="复诊续方" pulse={pulse(24)}><Icon file="icon3.svg" /></Card>
    <Card left={618} label="便捷配药" pulse={pulse(36)}>
      <Img src={staticFile("assets/icon4_bg.svg")} style={{ position: "absolute", inset: "3.09% 6.7%", width: "86.6%", height: "93.82%" }} />
      <Img src={staticFile("assets/icon4_fg.svg")} style={{ position: "absolute", left: "25.6%", top: "25.2%", width: "61.85%", height: "51.8%" }} />
    </Card>
    <Img src={staticFile("assets/cloud.png")} style={{ position: "absolute", left: 733 + cloudLeftX, top: 115 + cloudLeftY, width: 132, height: 167, objectFit: "contain", zIndex: 0 }} />
    <Img src={staticFile("assets/cloud.png")} style={{ position: "absolute", left: 965 - cloudLeftX, top: 21 - cloudLeftY, width: 91, height: 115, objectFit: "contain", zIndex: 0 }} />
    <Img src={staticFile("assets/cloud.png")} style={{ position: "absolute", left: 930 + cloudBottomX, top: 278.5 + cloudBottomY, width: 158, height: 200, objectFit: "contain", zIndex: 10 }} />
    <Img src={staticFile("assets/ip.png")} style={{ position: "absolute", left: 755, top: 42.5 + floatY, width: 308, height: 391, objectFit: "contain", zIndex: 5 }} />
    <div style={{ position: "absolute", left: 30, top: 246 + bubbleY, width: 728, height: 111.5, zIndex: 4 }}>
      <Img src={staticFile("assets/bottom_bar.svg")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      <div style={{ position: "absolute", left: 31, top: 0, width: 697, height: 111.5, display: "flex", alignItems: "center", transform: "translateY(9px)", color: "#8ba182", fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 28, lineHeight: "43px", whiteSpace: "nowrap" }}>更多服务，点击进入<span style={{ color: "#00603d" }}>“福州市中医院互联网医院”小程序</span></div>
    </div>
    </AbsoluteFill>
  </AbsoluteFill>
}

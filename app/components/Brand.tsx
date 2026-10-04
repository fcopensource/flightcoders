import Image from "next/image";

export function Brand() {
  return <><Image className="fc-brand-icon" src="/brand/flightcoders-icon.png" width={48} height={48} sizes="48px" alt=""/><span className="fc-brand-name">Flight<span>Coders</span></span></>;
}

import React from "react";
import { C, H, OUT, W, clamp, ev } from "../lib";
import { Board, Cloud, Gerobak, Ground, Sky, Sticker as RawSticker, Sunburst, T } from "../Props";
import { Juned } from "../Juned";
import type { Episode } from "../episode";
import { Customer } from "./Day2";
import { Bowl, V3, cue } from "./Day3";

type P = { t: number; ep: Episode };
const Sticker: React.FC<React.ComponentProps<typeof RawSticker>> = (props) => <RawSticker {...props} w={props.w ?? Math.min(1000, props.text.length * (props.size ?? 64) * 0.69 + (props.size ?? 64) * 1.2)} />;
export const STAGE_BOTTOM = 1190;
export const SUBTITLE_TOP = 1210;
export const SUBTITLE_BOTTOM = 1390;

const Outside: React.FC<{ children: React.ReactNode }> = ({ children }) => <>
  <Sky a={C.sky} b={C.skyL} id="d3v2-out" />
  <Cloud x={140} y={180} s={0.6} /><Cloud x={920} y={240} s={0.6} />
  <Ground y={1060} color={C.green} dark={C.greenD} />{children}
</>;
const Kitchen: React.FC<{ children: React.ReactNode }> = ({ children }) => <>
  <Sky a="#ffdfa5" b="#fff3d6" id="d3v2-kitchen" />
  {[100, 320, 540, 760, 980].map(x => <path key={x} d={`M${x} 590 V1150`} stroke="#eac38c" strokeWidth={3} />)}
  <rect x={0} y={1040} width={W} height={H - 1040} fill={C.wood} />
  <rect x={30} y={1040} width={1020} height={48} rx={10} fill="#efb776" stroke={C.ink} strokeWidth={OUT} />
  {children}
</>;

// Credits stay in a dedicated, opaque card above the actors. They never float over a person.
export const AccountCard: React.FC<{ handle: string; label: string; quote: string[]; likes?: number; x?: number; y?: number; w?: number; compact?: boolean }> =
  ({ handle, label, quote, likes, x = 540, y = 300, w = 920, compact = false }) => {
    const h = compact ? 220 : 270;
    return <g data-account-card={handle}>
      <rect x={x-w/2+5} y={y+7} width={w} height={h} rx={24} fill={C.ink} />
      <rect x={x-w/2} y={y} width={w} height={h} rx={24} fill={C.white} stroke={C.ink} strokeWidth={7} />
      <T x={x} y={y+44} size={compact ? 25 : 30} color={C.blueD}>{label}</T>
      <T x={x} y={y+(compact ? 101 : 112)} size={compact ? 40 : 56} color={C.ink}>{handle}</T>
      {quote.map((q,i) => <T key={i} x={x} y={y+(compact ? 151 : 173)+i*(compact ? 36 : 45)} size={compact ? 30 : 38} weight={500}>{q}</T>)}
      {likes !== undefined && <T x={x} y={y+h-18} size={compact ? 27 : 30} color={C.red}>{`${likes} LIKE`}</T>}
    </g>;
  };

export const Victory: React.FC<P> = ({ t, ep }) => <Outside>
  <Sticker x={235} y={105} text={`DAY ${ep.day}`} size={57} t={t} t0={0} rot={-3} />
  <Sticker x={540} y={230} text="MIE AYAM MENANG!" size={65} t={t} t0={0.15} />
  <AccountCard x={285} y={350} w={440} compact handle={ep.handles.nazz} label="PEMENANG · TIKTOK" quote={["MIE AYAM"]} likes={42} />
  <AccountCard x={790} y={350} w={440} compact handle="@arcvival_2" label="RUNNER-UP · IG" quote={["nasi goreng gw minnn"]} likes={28} />
  <Gerobak x={540} y={1060} s={0.53} sign={ep.warung} />
  <Customer x={170} y={1130} s={0.55} t={t} wave body={C.purple} />
  <Customer x={910} y={1130} s={0.55} t={t} wave body={C.blue} />
  <Sticker x={175} y={650} text="AKHIRNYA!" size={33} fill={C.teal} t={t} />
  <Sticker x={880} y={650} text={t >= cue(5) ? "IYE, SABAR!" : "NASGOR KAPAN?"} size={31} t={t} />
  <Juned x={535} y={1140} s={0.62} t={t} pose={t>=cue(5)?"wave":"proud"} mood={t>=cue(5)?"wow":"happy"} />
  {t>=cue(5) && <Sticker x={540} y={625} text="CICILAN BELOM LUNAS!" size={31} fill={C.white} t={t} />}
</Outside>;

export const Leftovers: React.FC<P> = ({t,ep}) => <Outside>
  <Sticker x={540} y={150} text="SARAN PELANGGAN" size={63} t={t} />
  <AccountCard handle={ep.handles.nazz} label="KOMENTAR PEMENANG · TIKTOK" quote={["“mie ayam aja ...", "ayam sisa ... ayam geprek”"]} y={280} />
  <Gerobak x={720} y={1080} s={0.57} sign={ep.warung} />
  <Juned x={295} y={1140} s={0.65} t={t} pose="scratch" mood={t<cue(7)?"wow":"smile"} />
  <Bowl x={830} y={1030} s={0.42} empty t={t} />
  {t>=cue(7) && <Sticker x={670} y={640} text="KEMAREN UDEH LUDES!" size={34} fill={C.red} color={C.white} t={t} />}
</Outside>;

const Garlic: React.FC<{x:number;y:number}> = ({x,y}) => <g transform={`translate(${x} ${y})`}>
  <path d="M0 -38 Q48 -5 27 27 Q0 45 -27 27 Q-42 0 0 -38Z" fill="#fff9df" stroke={C.ink} strokeWidth={5} />
  <path d="M0 -30 Q-5 5 10 29" fill="none" stroke="#d9b58d" strokeWidth={3} />
</g>;
export const Market: React.FC<P> = ({t}) => {
  const bonus=t>=cue(10);
  return <>
    <Sky a="#ffd27a" b="#fff1c2" id="d3v2-market" /><Ground y={1070} color="#ccb18b" />
    <Sticker x={540} y={130} text={bonus?"BONUS: SATU SIUNG":"BELANJA LAGI!"} size={60} t={t} />
    {[0,1].map(i=><g key={i} transform={`translate(${65+i*500} 340) scale(.78)`} stroke={C.ink} strokeWidth={OUT}>
      <rect width={440} height={540} fill={i?"#c9f1cd":"#ffd4c9"} />
      <path d="M-15 20 L455 20 L420 -80 L20 -80Z" fill={i?C.teal:C.blue} />
      <T x={220} y={-120} size={46}>{i?"MIE & SAYUR":"AYAM SEGAR"}</T>
      <rect y={465} width={440} height={65} fill={C.wood} />
      {i===0?[0,1,2].map(j=><ellipse key={j} cx={80+j*135} cy={435} rx={53} ry={35} fill="#f3bf96" />):<>
        <Bowl x={120} y={385} s={.4} t={t} /><path d="M270 465 Q220 315 280 315 Q310 300 340 335 Q380 280 390 345 L370 465Z" fill={C.green} />
      </>}
    </g>)}
    <Customer x={190} y={1130} s={.57} t={t} body={C.purple} wave={bonus} />
    <Juned x={790} y={1140} s={.6} t={t} pose="hold" mood={bonus?"focus":"sad"} />
    {bonus?<>
      <path d="M250 940 Q400 830 590 960" fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
      <path d="M250 940 Q400 830 590 960" fill="none" stroke="#efc19e" strokeWidth={20} strokeLinecap="round" />
      <Garlic x={510+ev(t,cue(10),.7)*70} y={750+ev(t,cue(10),.7)*155} />
      <Sticker x={470} y={710} text="SATU SIUNG DOANG?!" size={34} fill={C.white} t={t} />
    </>:<g transform={`translate(${470-ev(t,cue(8),1)*60} ${900-ev(t,cue(8),1)*110}) rotate(-15)`}>
      <rect x={-85} y={-35} width={170} height={70} rx={8} fill="#b0e0bd" stroke={C.ink} strokeWidth={5} /><T x={0} y={14} size={32}>Rp...</T>
    </g>}
  </>;
};

const Cat: React.FC<{t:number}> = ({t}) => <g transform={`translate(180 ${1110+Math.sin(t*5)*3})`} stroke={C.ink} strokeWidth={5}>
  <path d="M70 0 Q125 -65 90 -80" fill="none" stroke={C.yellow} strokeWidth={16} />
  <ellipse rx={65} ry={40} fill={C.yellow} /><path d="M-65 -10 L-75 -70 L-40 -50 L-10 -70 L-5 -10 Q-30 25 -65 -10Z" fill={C.yellow} />
  <circle cx={-53} cy={-30} r={4} /><circle cx={-23} cy={-30} r={4} /><path d="M-43 -15 l6 6 l6 -6" fill={C.pink} />
</g>;
export const StirFry: React.FC<P> = ({t}) => {
  const spill=t>=cue(12),cat=t>=cue(13);
  return <Kitchen>
    <Sticker x={540} y={130} text={spill?"KECAPNYA KEBANYAKAN!":"TUMIS AYAM DULU!"} size={55} t={t} />
    <AccountCard handle="@_.szsbillaa" label="PELANGGAN SETIA · IG" quote={["“Semangat banggg”"]} y={270} compact />
    <Juned x={815} y={1110} s={.64} t={t} pose="hammer" mood={spill?"wow":"focus"} />
    <g stroke={C.ink} strokeWidth={OUT}>
      <rect x={100} y={930} width={465} height={110} rx={14} fill="#5b6b7a" />
      {[0,1,2,3].map(i=><path key={i} d={`M${170+i*90} 930 q${Math.sin(t*14+i)*9} -35 0 -60`} stroke={i%2?C.orange:C.yellow} strokeWidth={15} fill="none" />)}
      <path d="M75 790 Q320 1080 585 790Z" fill="#34313c" /><ellipse cx={330} cy={790} rx={255} ry={52} fill={spill?"#4c2719":"#c48b3d"} />
      <path d="M585 790 l125 -60" strokeWidth={25} strokeLinecap="round" />
      {Array.from({length:9},(_,i)=><rect key={i} x={140+i*41} y={772+Math.sin(t*7+i)*12} width={40} height={28} rx={8} fill="#a86a35" strokeWidth={4} />)}
      <path d={`M${330+Math.sin(t*6)*110} 780 L${530+Math.sin(t*6)*40} 620`} stroke={C.woodD} strokeWidth={20} strokeLinecap="round" />
    </g>
    {spill&&t<cue(13)&&<g transform="translate(360 635) rotate(45)"><rect x={-35} y={-95} width={80} height={135} rx={15} fill="#4c2719" stroke={C.ink} strokeWidth={6} /><rect x={-20} y={-120} width={50} height={30} fill={C.red} /></g>}
    {cat&&<><Cat t={t}/><Sticker x={520} y={570} text={t>=cue(14)?"BAYAR PAKE MEONG?":"MEONG!"} size={34} fill={C.white} t={t}/></>}
  </Kitchen>;
};

export const NoodleTrouble: React.FC<P> = ({t}) => {
  const done=t>=cue(19),pull=ev(t,cue(16),Math.max(1,cue(19)-cue(16)-.2)),top=840-pull*170;
  return <Kitchen>
    <Sticker x={540} y={125} text={done?"JADI JUGA!":t>=cue(17)?"MIE APA KABEL CHARGER?!":"REBUS, ANGKAT..."} size={done?74:51} t={t}/>
    <AccountCard handle="@nshyilla" label="KUBU BAKSO MASIH NUNGGU · IG" quote={["“MAU BAKSO KEJU MINNN”"]} likes={8} y={260}/>
    <Juned x={790} y={1120} s={.6} t={t} pose={done?"proud":"hammer"} mood={done?"happy":"wow"}/>
    {done?<Bowl x={390} y={920} s={.88} t={t}/>:<g stroke={C.ink} strokeWidth={7}>
      <rect x={105} y={985} width={430} height={95} rx={14} fill="#5b6b7a" />
      <path d="M120 865 L150 1000 Q330 1040 510 1000 L535 865Z" fill="#a6bac6"/><ellipse cx={328} cy={865} rx={207} ry={45} fill="#d9eff8"/>
      <path d={`M245 ${top} Q330 ${top+80} 415 ${top} L540 ${top-50}`} fill="#c8d2db"/>
      {Array.from({length:7},(_,i)=><path key={i} d={`M${280+i*14} ${top+18} C240 ${top+100},430 810,${280+i*14} 875`} stroke="#ffe184" strokeWidth={9} fill="none"/>)}
      <path d={`M245 ${top} Q330 ${top+80} 415 ${top}`} fill="none"/>
      <Bowl x={770} y={1025} s={.42} empty t={t}/>
    </g>}
    {!done&&t>=cue(16)&&<Sticker x={300} y={590} text="NYANGKUT!" size={36} fill={C.red} color={C.white} t={t}/>}
    {done&&<Sticker x={440} y={620} text="MIE AYAM • MENU KE-2" size={35} fill={C.white} t={t}/>}
  </Kitchen>;
};

export const SecondHelping: React.FC<P> = ({t,ep}) => {
  const returned=t>=cue(21),relief=t>=cue(23),crowd=t>=cue(25),between=ev(t,cue(21),.65);
  return <Outside>
    <Sticker x={540} y={135} text={relief?"TERNYATA MAU NAMBAH!":returned?"LAH, DIBALIKIN?!":"PESENAN PERTAMA!"} size={55} t={t}/>
    <AccountCard handle={ep.handles.nazz} label="PEMENANG MIE AYAM · TIKTOK" quote={["nazz√ · 42 like"]} y={270} compact/>
    <Gerobak x={530} y={1020} s={.55} sign={ep.warung}/>
    <Juned x={200} y={1140} s={.6} t={t} pose={relief?"hold":"scratch"} mood={relief?"happy":returned?"sad":"smile"}/>
    <Customer x={crowd?590:815} y={1130} s={crowd?.5:.64} t={t} body={C.purple} wave={relief}/>
    <Bowl x={crowd?530:returned?760-between*180:720} y={990} s={.43} t={t} empty={returned&&!relief} extra={t>=cue(24)}/>
    {returned&&!relief&&<><T x={520} y={680} size={100} color={C.red}>?!</T><Sticker x={520} y={590} text="GW KUAT..." size={35} fill={C.white} t={t} t0={cue(22)}/></>}
    {relief&&<Sticker x={620} y={590} text={crowd?"GW JUGA, MANG!":"TAMBAH SATU, MANG!"} size={38} fill={C.white} t={t}/>}
    {crowd&&[0,1].map(i=><g key={i}>
      <Customer x={775+i*170} y={1130} s={.42} t={t+i} body={i?C.teal:C.blue} wave/>
      <Bowl x={750+i*170} y={1035} s={.3} t={t} empty/>
    </g>)}
  </Outside>;
};

export const Closing: React.FC<P> = ({t,ep}) => {
  const cta=t>=cue(29);
  return <>
    <Sunburst cx={540} cy={600} a="#ffd36b" b="#ffb639" t={t}/>
    <Sticker x={540} y={105} text={cta?"ADU LIKE: MENU KE-3":"DUA MENU RESMI!"} size={57} t={t}/>
    <Board x={75} y={210} w={930} h={405}>
      <T x={540} y={305} size={57} color={C.white}>MENU WARUNG KOMEN</T>
      {ep.menu.map((m,i)=><T key={m} x={155} y={425+i*100} size={61} color={C.yellow} anchor="start">{`${i+1}. ${m}`}</T>)}
    </Board>
    <Sticker x={540} y={700} text={cta?"KOMEN = PESEN MENU":`PELANGGAN: ${t>=cue(27)?Math.min(8,5+Math.floor(clamp((t-cue(27))/1.5)*4)):5}`} size={46} fill={C.white} t={t}/>
    {(cta?t>=cue(30):t>=cue(28))&&<Sticker x={540} y={800} text={cta?"LIKE TERBANYAK = GW MASAK!":"GEROBAK MAKIN SEMPIT!"} size={38} fill={cta?C.red:C.white} color={cta?C.white:C.ink} t={t}/>}
    <Gerobak x={300} y={1140} s={.43} sign={ep.warung}/>
    <Juned x={820} y={1140} s={.4} t={t} pose="wave" mood="happy"/>
  </>;
};

// The scene is clipped above y1190; every subtitle lies entirely below y1210.
export const Captions3: React.FC<{t:number}> = ({t}) => {
  const line=V3.V.lines.find(l=>t>=l.t0&&t<l.t1+.12);
  if(!line)return null;
  const rows:string[]=[""];
  for(const word of line.text.replace(/\bgue\b/gi,"gw").split(/\s+/)){
    if((rows[rows.length-1]+" "+word).trim().length>30)rows.push(word);
    else rows[rows.length-1]=(rows[rows.length-1]+" "+word).trim();
  }
  const h=rows.length*58+28,y=1300;
  return <g data-subtitle="true">
    <rect x={65} y={y-h/2+5} width={880} height={h} rx={24} fill={C.ink}/>
    <rect x={60} y={y-h/2} width={880} height={h} rx={24} fill={C.white} stroke={C.ink} strokeWidth={7}/>
    {rows.map((r,i)=><T key={i} x={500} y={y-(rows.length-1)*29+17+i*58} size={47}>{r}</T>)}
  </g>;
};

export const Footer3: React.FC<{ep:Episode}> = ({ep}) => <>
  <rect x={0} y={STAGE_BOTTOM} width={W} height={H-STAGE_BOTTOM} fill={C.cream}/>
  <path d={`M0 ${STAGE_BOTTOM} H${W}`} stroke={C.ink} strokeWidth={5}/>
  <T x={540} y={1480} size={36} color={C.blueD}>{`${ep.warung} · DAY ${ep.day}`}</T>
  <T x={540} y={1540} size={30}>{`CABANG ${ep.cabang} · MENU TERUS BERTAMBAH`}</T>
</>;

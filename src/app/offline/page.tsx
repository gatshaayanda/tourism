import Link from "next/link";

export default function OfflinePage() {
  return <main className="bookPage"><nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark">BW</span><span>Botswana Safari Experiences</span></Link></div></nav><div className="formWrap"><div className="formCard confirm"><div className="confirmIcon">📶</div><span className="kicker">Offline mode</span><h1>Still usable.</h1><p>Previously loaded safari pages and public assets may remain available on this device.</p><p>You can review previously loaded information while offline. A trip request is not considered received until the connection returns and the save is confirmed.</p><div className="actions centered"><Link className="button buttonPrimary" href="/enquiry">Plan a trip</Link><Link className="button buttonLight" href="/">Open safari experiences</Link></div></div></div></main>;
}

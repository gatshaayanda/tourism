import {Suspense} from "react";
import AfrichikoPortal from "@/components/AfrichikoPortal";
export default function HomePage(){return <Suspense fallback={<main className="af-site"><p>Loading Botswana Safari Experiences…</p></main>}><AfrichikoPortal page="home"/></Suspense>}

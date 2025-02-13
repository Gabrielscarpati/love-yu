"use client";

import dynamic from "next/dynamic";

const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

export default YouTube;
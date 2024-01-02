"use client";

import Link from "next/link";
import * as React from "react";

import SymbolLogoLight from "@/assets/symbol-logo-with-text-light.png";
import Image from "next/image";

export function MainNav() {
  return (
    <div className="flex grow items-center justify-center container">
      <Link href="/" className="items-center space-x-2 md:flex">
        <Image loading="eager" alt="symbol-logo-wide" src={SymbolLogoLight} height={40} />
      </Link>
    </div>
  );
}

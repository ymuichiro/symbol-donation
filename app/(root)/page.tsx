"use client";

import { Link } from "@/components/ui/link";
import { H1, H2 } from "@/components/ui/typography";
import { address, converter, node } from "@/lib/symbol";
import useSWR from "swr";

const fetcher = (e: string) => fetch(e).then((res) => res.json());

export default function IndexPage() {
  const { data, error, isLoading } = useSWR(`${node}/accounts/${address}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div />;

  const balance = converter(data.account.mosaics);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center gap-5 w-full max-w-5xl">
        <section className="flex flex-col items-center justify-center space-y-6 min-h-[100svh]">
          <H1>義援金受付状況</H1>
          <Link href={`https://symbol.fyi/accounts/${address}`} target="_blank">
            {address}
          </Link>
          <H2>
            {balance}
            <span className="text-4xl">xym</span>
          </H2>
        </section>
      </div>
    </div>
  );
}

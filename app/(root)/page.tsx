"use client";

import MessageCard from "@/components/moleculs/MessageCard";
import { Link } from "@/components/ui/link";
import { H1, H2, Paragraph } from "@/components/ui/typography";
import { address, converter, node } from "@/lib/symbol";
import useSWR from "swr";
import { Address } from "symbol-sdk/dist/src/model/account/Address";

const fetcher = (e: string) => fetch(e).then((res) => res.json());

export default function IndexPage() {
  const { data, error, isLoading } = useSWR(`${node}/accounts/${address}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div />;

  const balance = converter(data.account.mosaics);

  return (
    <div className="flex justify-center px-5 mb-48">
      <div className="flex flex-col justify-center gap-5 w-full max-w-5xl">
        <section className="flex flex-col items-center space-y-6 mt-[200px] mb-[100px]">
          <H1>支援募金受付状況</H1>
          <Link
            href={`https://symbol.fyi/accounts/${address}`}
            target="_blank"
            className="max-w-max whitespace-normal text-center"
          >
            {Address.createFromRawAddress(address).pretty()}
          </Link>
          <H2>
            {balance.toLocaleString("ja-JP")}
            <span className="text-xl md:text-4xl ml-1">xym</span>
          </H2>
        </section>
        <section>
          <Paragraph className="text-muted-foreground text-center pb-5">
            受付履歴
            <br />- TransferTransactionのみ表示 -
          </Paragraph>
          <MessageCard />
        </section>
      </div>
    </div>
  );
}

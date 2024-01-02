"use client";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { address, epochAdjustment, node } from "@/lib/symbol";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import {
  RepositoryFactoryHttp,
  TransactionGroup,
  Order,
  TransactionSearchCriteria,
  Address,
  Deadline,
  TransferTransaction,
} from "symbol-sdk";
import { useInView } from "react-intersection-observer";

const transactionRepository = new RepositoryFactoryHttp(node).createTransactionRepository();
const recipientAddress = Address.createFromRawAddress(address);

const getKey = (pageIndex: number, previousPageData: any): TransactionSearchCriteria | null => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return {
    group: TransactionGroup.Confirmed,
    address: recipientAddress,
    pageSize: 20,
    pageNumber: pageIndex,
    order: Order.Desc,
  };
};

const fetcher = async (searchCriteria: TransactionSearchCriteria): Promise<TransferTransaction[]> => {
  return new Promise<TransferTransaction[]>((ok) => {
    transactionRepository.search(searchCriteria).subscribe((e) => ok(e.data as TransferTransaction[]));
  });
};

export default function MessageCard(): JSX.Element {
  const { data, error, isLoading, setSize, size } = useSWRInfinite(getKey, fetcher);
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  useEffect(() => {
    setSize((e) => e + 1);
  }, [inView, setSize]);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div />;

  const format_date = (d: Deadline) => {
    const date = new Date(d.adjustedValue + epochAdjustment * 1000);
    return date.toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "long", timeZone: "Asia/Tokyo" });
  };

  return (
    <div className="flex flex-col gap-5">
      {data
        ?.flatMap((e) => e)
        .filter((e) => e.type === 16724)
        .map((tx, index) => {
          console.log(tx.message.type, tx.message.payload);
          return (
            tx.message.payload && (
              <Card key={index}>
                <CardContent className="pt-5">
                  <CardDescription className="break-words">{tx.message.payload}</CardDescription>
                </CardContent>
                <CardContent>
                  <Link
                    href={`https://symbol.fyi/transactions/${tx.transactionInfo?.hash || "unknown"}`}
                    target="_blank"
                  >
                    Explorer
                  </Link>
                  <div>{format_date(tx.deadline)}</div>
                </CardContent>
              </Card>
            )
          );
        })}
      <div className="my-10 text-muted-foreground text-center">{data?.flatMap((e) => e)?.length || 0} 件読込完了</div>
      <div ref={ref} />
    </div>
  );
}

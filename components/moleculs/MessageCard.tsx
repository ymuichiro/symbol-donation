"use client";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { address, epochAdjustment, node } from "@/lib/symbol";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { Address } from "symbol-sdk/dist/src/model/account/Address";
import { RepositoryFactoryHttp } from "symbol-sdk/dist/src/infrastructure/RepositoryFactoryHttp";
import { TransactionSearchCriteria } from "symbol-sdk/dist/src/infrastructure/searchCriteria/TransactionSearchCriteria";
import { TransactionGroup } from "symbol-sdk/dist/src/infrastructure/TransactionGroup";
import { Order } from "symbol-sdk/dist/src/infrastructure/searchCriteria/Order";
import { TransferTransaction } from "symbol-sdk/dist/src/model/transaction/TransferTransaction";
import { Deadline } from "symbol-sdk/dist/src/model/transaction/Deadline";
import Loading from "@/components/ui/loading";
import { Paragraph } from "@/components/ui/typography";

const transactionRepository = new RepositoryFactoryHttp(node).createTransactionRepository();
const recipientAddress = Address.createFromRawAddress(address);

const getKey = (pageIndex: number, previousPageData: any): TransactionSearchCriteria | null => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return {
    group: TransactionGroup.Confirmed,
    address: recipientAddress,
    pageSize: 30,
    pageNumber: pageIndex + 1,
    order: Order.Desc,
  };
};

const fetcher = async (searchCriteria: TransactionSearchCriteria): Promise<TransferTransaction[]> => {
  return new Promise<TransferTransaction[]>((ok) => {
    transactionRepository.search(searchCriteria).subscribe((e) => ok(e.data as TransferTransaction[]));
  });
};

export default function MessageCard(): JSX.Element {
  const { data, error, isLoading, setSize, isValidating } = useSWRInfinite(getKey, fetcher);
  const { ref, inView } = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView && !isValidating) {
      setSize((e) => e + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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

      <div ref={ref} />
      <div className="my-10 text-muted-foreground text-center">{data?.flatMap((e) => e)?.length || 0} 件読込完了</div>
    </div>
  );
}

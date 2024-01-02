"use client";

import { Link } from "@/components/ui/link";
import { H1, H2 } from "@/components/ui/typography";
import { address, converter, node, epochAdjustment } from "@/lib/symbol";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { RepositoryFactoryHttp, Address, TransactionGroup, Transaction, Order, Deadline } from 'symbol-sdk';

const fetcher = (e: string) => fetch(e).then((res) => res.json());

export default function IndexPage() {
  const { data, error, isLoading } = useSWR(`${node}/accounts/${address}`, fetcher);
  const [ txs, setTxs ] = useState([]);
  const repo = new RepositoryFactoryHttp(node);
  const txRepo = repo.createTransactionRepository();
  const [ page, setPage ] = useState(1);
  const [ lastPage, setLastPage ] = useState(false);
  const [ isLoadingTxs, setIsLoadingTxs ] = useState(false);

  const fetchNewTxs = (pageNumber: number) => {
    const target = Address.createFromRawAddress(address);
    const searchCriteria = {
      group: TransactionGroup.Confirmed,
      address: target,
      pageSize: 20,
      pageNumber: pageNumber,
      order: Order.Desc,
    };
    setIsLoadingTxs(true);
    txRepo.search(searchCriteria).subscribe((e) => {
      // @ts-ignore
      setTxs(prevTxs => [...prevTxs, ...e.data]);
      setLastPage(e.isLastPage)
      setPage(prevPage => prevPage + 1);
      setIsLoadingTxs(false);
    });
  }

  useEffect(() => {
    fetchNewTxs(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (lastPage) return;
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight) return;
      if (isLoadingTxs) return;
      fetchNewTxs(page);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastPage, page]);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div />;

  const balance = converter(data.account.mosaics);
  const format_date = (d: Deadline) => {
    const date = new Date(
      d.adjustedValue + (epochAdjustment * 1000)
    );
    return date.toLocaleString();
  }
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center gap-5 w-full max-w-5xl">
        <section className="flex flex-col items-center justify-center space-y-6 min-h-[70svh]">
          <H1>義援金受付状況</H1>
          <Link href={`https://symbol.fyi/accounts/${address}`} target="_blank">
            {address}
          </Link>
          <H2>
            {balance}
            <span className="text-4xl">xym</span>
          </H2>
        </section>
        <section>
        {txs.map((tx, index) => (
          //@ts-ignore
          tx.message?.payload &&
          <div key={index} className="card bg-white rounded-lg shadow-md m-auto my-1 w-full md:w-1/2 lg:w-1/3 p-4 overflow-auto">
            <div>
              {/* @ts-ignore */}
              {tx.message.payload}
            </div>
            <div>
              {/* @ts-ignore */}
              <Link href={`https://symbol.fyi/transactions/${tx.transactionInfo.hash}`} target="_blank">Explorer</Link>
            </div>
            <div>
              {/* @ts-ignore */}
              {format_date(tx.deadline)}
            </div>
          </div>
        ))}
        </section>
      </div>
    </div>
  );
}

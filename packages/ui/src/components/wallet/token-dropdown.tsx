"use client";

import {
  Token,
  useBalanceStore,
  useCurrentAccount,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import Image from "next/image";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../select";

const SelectCurrencyItem = ({
  balance,
  token,
}: {
  balance: number;
  token: Token;
}) => {
  return (
    <SelectItem
      value={token.address}
      className="wr-flex wr-w-full wr-py-2 wr-font-semibold"
    >
      <Image
        alt="token_icon"
        src={token.icon}
        className="wr-mr-2 wr-rounded-full"
        width={20}
        height={20}
      />
      {balance}
      <span className="wr-ml-2 wr-text-zinc-500">{token.symbol}</span>
    </SelectItem>
  );
};

export const SelectGameCurrency: React.FC<{ triggerClassName?: string }> = ({
  triggerClassName,
}) => {
  const account = useCurrentAccount();
  const { tokens, setSelectedToken, selectedToken } = useTokenStore((s) => ({
    tokens: s.tokens,
    setSelectedToken: s.setSelectedToken,
    selectedToken: s.selectedToken,
  }));
  const { refetch } = useTokenBalances({
    account: account?.address || "0x0",
  });

  const balances = useBalanceStore((state) => state.balances);

  return (
    <Select
      onValueChange={(val) => {
        const token = tokens.find((token) => token.address === val);
        if (!token) return;
        setSelectedToken(token);
      }}
      value={selectedToken?.address}
    >
      {selectedToken && balances && (
        <SelectTrigger className="wr-min-w-fit wr-items-center wr-justify-center wr-gap-2">
          <Image
            src={selectedToken?.icon}
            alt="token_image"
            width={20}
            height={20}
            className="max-md:mr-1 "
          />
          <span className="mt-[2px]">
            {balances[selectedToken.address] ?? 0}
          </span>
        </SelectTrigger>
      )}

      <SelectContent
        className="wr-relative wr-z-[60] wr-w-[280px] wr-bg-zinc-950 wr-p-2"
        align="center"
      >
        <SelectGroup className="wr-w-full">
          {tokens.map((token) => (
            <SelectCurrencyItem
              balance={balances[token.address] ?? 0}
              token={token}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

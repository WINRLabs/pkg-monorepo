import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useFormContext } from "react-hook-form";

import { CDN_URL } from "../../../constants";
import { FormControl, FormField, FormItem } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { COIN_SIDE } from "../constants";
import { CoinFlip3dForm } from "../types";

export const CoinFlipController = () => {
  const form = useFormContext() as CoinFlip3dForm;

  return (
    <div className="wr-flex  wr-items-center lg:wr-absolute lg:wr-bottom-8 lg:wr-left-1/2 lg:-wr-translate-x-1/2">
      <FormField
        control={form.control}
        name="coinSide"
        render={({ field }) => (
          <FormItem className="wr-mb-0 wr-h-12n max-lg:wr-w-full">
            <FormControl>
              <RadioGroupPrimitive.Root
                onValueChange={field.onChange}
                className="wr-grid wr-h-full wr-w-full wr-grid-cols-2 wr-items-center wr-justify-center wr-gap-0 wr-rounded-md wr-bg-unity-white-15 wr-font-semibold lg:wr-w-[412px]"
                defaultValue={field.value}
              >
                <FormItem className="wr-mb-0 wr-h-full wr-text-center">
                  <FormControl>
                    <>
                      <RadioGroupPrimitive.Item
                        value={COIN_SIDE.ETH}
                        className="wr-relative wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-text-unity-white-50"
                      >
                        <img
                          src={`${CDN_URL}/coin-flip-2d/eth.png`}
                          width={20}
                          height={20}
                          alt="eth_icon"
                        />
                        ETH
                        <RadioGroupPrimitive.Indicator className="wr-absolute wr-left-0 wr-top-0 wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-rounded-md wr-bg-gradient-to-t wr-from-unity-coinflip-purple-700 wr-to-unity-coinflip-purple-400 wr-text-zinc-100">
                          <img
                            src={`${CDN_URL}/coin-flip-2d/eth.png`}
                            width={20}
                            height={20}
                            alt="eth_icon"
                          />
                          ETH
                        </RadioGroupPrimitive.Indicator>
                      </RadioGroupPrimitive.Item>
                      <span
                        className={cn(
                          "wr-relative wr-flex wr-items-center wr-justify-center wr-gap-1 wr-text-zinc-100 max-md:wr-top-2",
                          {
                            "wr-text-green-500": field.value === COIN_SIDE.ETH,
                          }
                        )}
                      >
                        {field.value === COIN_SIDE.ETH ? "+$0.95" : "$1"}
                      </span>
                    </>
                  </FormControl>
                </FormItem>
                <FormItem className="wr-mb-0 wr-h-full">
                  <>
                    <FormControl>
                      <RadioGroupPrimitive.Item
                        value={COIN_SIDE.BTC}
                        className="wr-relative wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-text-unity-white-50"
                      >
                        <img
                          src={`${CDN_URL}/coin-flip-2d/btc.png`}
                          width={20}
                          height={20}
                          alt="btc_icon"
                        />
                        BTC
                        <RadioGroupPrimitive.Indicator className="wr-absolute wr-left-0 wr-top-0 wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-rounded-md wr-bg-gradient-to-t wr-from-unity-coinflip-purple-700 wr-to-unity-coinflip-purple-400 wr-text-zinc-100">
                          <img
                            src={`${CDN_URL}/coin-flip-2d/btc.png`}
                            width={20}
                            height={20}
                            alt="btc_icon"
                          />
                          BTC
                        </RadioGroupPrimitive.Indicator>
                      </RadioGroupPrimitive.Item>
                    </FormControl>
                    <span
                      className={cn(
                        "wr-relative wr-flex wr-items-center wr-justify-center wr-gap-1 wr-text-zinc-100 max-md:wr-top-2",
                        {
                          "wr-text-green-500": field.value === COIN_SIDE.BTC,
                        }
                      )}
                    >
                      {field.value === COIN_SIDE.BTC ? "+$0.95" : "$1"}
                    </span>
                  </>
                </FormItem>
              </RadioGroupPrimitive.Root>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

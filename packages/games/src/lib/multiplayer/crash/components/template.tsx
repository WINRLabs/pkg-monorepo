'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'debounce';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { UnityGameContainer } from '../../../common/containers';
import { Form } from '../../../ui/form';
import { CrashFormFields } from '../types';
import { CrashBetController } from './bet-controller';
import { CrashScene } from './crash-scene';
import LastBets from './last-bets';
import CrashParticipant from './participants';

type TemplateOptions = {
  scene?: {
    loader?: string;
    logo?: string;
  };
};

type TemplateProps = {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (props: CrashFormFields) => void;
  onFormChange?: (fields: CrashFormFields) => void;
  onComplete?: (multiplier: number) => void;
  onLogin?: () => void;
  gameUrl?: string;
};

const CrashTemplate = (props: TemplateProps) => {
  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 2, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    multiplier: z.number().min(1.01).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'all',
    defaultValues: {
      wager: props?.minWager || 1,
      multiplier: 1.01,
    },
  });

  const onComplete = React.useCallback(
    (multiplier: number) => {
      props.onComplete && props.onComplete(multiplier);
    },
    [props.onComplete]
  );

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
          <UnityGameContainer
            className="wr-relative wr-h-[1368px] wr-overflow-hidden wr-rounded-xl wr-bg-[#19193D] md:wr-h-[640px] md:wr-rounded-3xl"
            id="animationScene"
          >
            <CrashBetController
              minWager={props?.minWager || 2}
              maxWager={props?.maxWager || 2000}
              options={props.options}
              onLogin={props.onLogin}
            />
            <LastBets />
            <CrashScene onComplete={onComplete} gameUrl={props.gameUrl} options={props.options} />
            <div className="wr-absolute wr-top-0 wr-z-10 wr-h-full wr-w-full md:wr-bg-unity-overlay" />
            <CrashParticipant />
          </UnityGameContainer>
        </form>
      </Form>
    </>
  );
};

export default CrashTemplate;

import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'debounce';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { Form } from '../../../ui/form';
import { WheelColor } from '../constants';
import { WheelTheme, WheelThemeProvider } from '../providers/theme';
import { WheelFormFields } from '../types';
import BetController from './bet-controller';
import LastBets from './last-bet';
import WheelParticipants from './wheel-participants';
import { WheelScene } from './wheel-scene';

type TemplateProps = {
  theme?: Partial<WheelTheme>;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: WheelFormFields) => void;
  onFormChange?: (fields: WheelFormFields) => void;
  onComplete?: () => void;
  onLogin?: () => void;
};

const WheelTemplate = (props: TemplateProps) => {
  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    color: z.nativeEnum(WheelColor),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'onSubmit',
    defaultValues: {
      wager: props?.minWager || 1,
      color: WheelColor.IDLE,
    },
  });

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onComplete = React.useCallback(() => {
    props.onComplete && props.onComplete();
  }, [props.onComplete]);

  return (
    <WheelThemeProvider theme={props.theme}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
          <GameContainer>
            <BetController
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 1}
              onLogin={props.onLogin}
            />
            <SceneContainer className="wr-h-[640px] max-md:wr-h-[360px] lg:wr-p-[14px]">
              <LastBets />
              <WheelScene onComplete={onComplete} />
              <WheelParticipants />
            </SceneContainer>
          </GameContainer>
        </form>
      </Form>
    </WheelThemeProvider>
  );
};

export default WheelTemplate;

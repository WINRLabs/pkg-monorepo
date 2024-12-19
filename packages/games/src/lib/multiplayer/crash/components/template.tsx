import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { Form } from '../../../ui/form';
import { cn } from '../../../utils/style';
import CrashBetController from './bet-controller';
import Scene from './scene';

interface CrashTemplateProps {
  onSubmitGameForm: (props: any) => void;
  minWager?: number;
  maxWager?: number;

  onLogin?: () => void;
  isPinNotFound?: boolean;
}

export const CrashTemplate = (props: CrashTemplateProps) => {
  const minWager = props?.minWager || 0.01;
  const maxWager = props?.maxWager || 2000;

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager, {
        message: `Minimum wager is ${minWager}`,
      })
      .max(maxWager, {
        message: `Maximum wager is ${maxWager}`,
      }),
    multiplier: z.number().min(1.01).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'all',
    defaultValues: {
      wager: 1,
      multiplier: 1.01,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => props.onSubmitGameForm(v))}>
        <GameContainer>
          <CrashBetController
            minWager={minWager}
            maxWager={maxWager}
            isPinNotFound={props.isPinNotFound}
            onLogin={props.onLogin}
          />
          <SceneContainer
            className={cn(
              'wr-h-[640px] max-lg:wr-h-[500px] max-md:wr-h-[320px] !wr-p-0 wr-overflow-hidden'
            )}
          >
            <Scene />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

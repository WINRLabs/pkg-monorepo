import SvgChat from '../../svgs/Chat';
import { Button } from '../button';

export const Chat = () => {
  return (
    <Button
      variant="outline"
      className="wr-hidden wr-h-9 wr-w-9 wr-items-center wr-justify-center wr-p-0 wr-text-center lg:wr-flex"
    >
      <SvgChat className="wr-h-5 wr-w-5" />
    </Button>
  );
};

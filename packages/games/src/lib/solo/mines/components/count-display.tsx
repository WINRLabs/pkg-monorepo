import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../constants';
import { useMinesTheme } from '../provider/theme';

const MinesCountDisplay: React.FC = () => {
  const form = useFormContext();
  const theme = useMinesTheme();

  const minesCount = form.watch('minesCount');

  return (
    <div className="wr-grid wr-grid-cols-2 wr-gap-2">
      <div className="wr-relative wr-flex wr-h-[100px] wr-flex-col wr-items-start wr-justify-between wr-rounded-lg wr-border wr-border-zinc-800 wr-p-3">
        <p className="wr-text-lg wr-font-semibold wr-text-white">MINES</p>
        <div className="wr-flex wr-h-9 wr-w-9 wr-items-center wr-justify-center wr-rounded-[8px] wr-bg-red-600 wr-text-zinc-100">
          <span className="wr-text-base wr-font-semibold">{minesCount}</span>
        </div>
        <img
          src={`${CDN_URL}/mines/mine-count-image.png`}
          className="wr-absolute wr-bottom-0 wr-right-0 wr-z-10"
          alt="img_gem"
          width={62}
          height={62}
        />
        <img
          src={`${CDN_URL}/mines/mine-count-shade.png`}
          className="wr-absolute wr-bottom-0 wr-right-0 wr-z-0"
          alt="img_gem"
        />
      </div>
      <div className="wr-relative wr-flex wr-h-[100px] wr-flex-col wr-items-start wr-justify-between wr-rounded-lg wr-border wr-border-zinc-800 wr-p-3 wr-overflow-hidden">
        <p className="wr-text-lg wr-font-semibold wr-text-white wr-z-10">GEMS</p>
        <div className="wr-flex wr-h-9 wr-w-9 wr-items-center wr-justify-center wr-rounded-[8px] wr-bg-green-500 wr-text-zinc-100 wr-z-10">
          <span className="wr-text-base wr-font-semibold">{25 - minesCount}</span>
        </div>
        <img
          src={theme.gemImage}
          className="wr-absolute -wr-bottom-4 -wr-right-3 wr-z-10"
          alt="img_gem"
          width={72}
          height={72}
        />
        <img
          src={theme.gemImage}
          className="wr-absolute wr-bottom-0 wr-right-0 wr-z-0 wr-blur-2xl"
          alt="img_gem"
        />
      </div>
    </div>
  );
};

export default MinesCountDisplay;

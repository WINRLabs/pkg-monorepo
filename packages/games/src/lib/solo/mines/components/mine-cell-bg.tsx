import { SVGProps } from 'react';

import { cn } from '../../../utils/style';
import { useMinesTheme } from '../provider/theme';

export const MineCellBg = (
  props: SVGProps<SVGSVGElement> & {
    isLoading?: boolean;
  }
) => {
  const theme = useMinesTheme();

  return (
    <div
      className="wr-h-full wr-w-full wr-flex wr-justify-center wr-items-center"
      style={{
        background: "url('/custom/mines/cell-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {theme?.cellImage ? (
        <img
          src={theme.cellImage}
          alt="cell"
          width={40}
          height={40}
          className={cn({
            'wr-animate-mines-pulse': props.isLoading,
          })}
        />
      ) : (
        <svg
          width={120}
          height={120}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <g>
            <path
              fill="currentColor"
              className={cn('wr-origin-center', {
                'wr-animate-mines-pulse': props.isLoading,
              })}
              d="m40.175 53.876 15.656 7.221c1.073.492 1.748 1.483 1.748 2.566V77.77c0 1.59-1.432 2.88-3.199 2.88a3.487 3.487 0 0 1-1.508-.34l-8.47-4.076c-2.602-1.252-4.227-3.692-4.227-6.348v-5.822l3.036 1.58c.742.386 1.199 1.099 1.199 1.87v1.944c0 1.026.607 1.975 1.593 2.49l7.221 3.773V64.505l-10.401-4.732c-1.65-.724-2.621-2.16-2.621-3.81 0-.908-.027-2.087-.027-2.087Z"
            />
            <path
              fill="currentColor"
              className={cn('wr-origin-center', {
                'wr-animate-mines-pulse': props.isLoading,
              })}
              fillRule="evenodd"
              d="M76.41 64.686c1.471.258 2.48 1.528 2.532 3.345v2.79c0 2.087-1.456 4.01-3.48 5.028l-8.622 4.333c-1.542.775-3.491.278-4.353-1.11a2.658 2.658 0 0 1-.406-1.404V63.616c0-1.059.645-2.032 1.68-2.534l15.148-7.297s.086 1.458-.001 2.903c-.181 2.994-.603 5.444-2.498 7.998Zm-10.406 7.333v4.164l7.276-3.982c.955-.522 2.182-1.45 1.779-3.084-.223-.903-1.477-.906-2.07-.608l-6.986 3.51Zm0-4.01v-3.504l9.055-4.823s-.202 1.27-.475 2.13c-.43 1.352-1.35 2.742-2.73 3.404l-5.85 2.793Z"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              className={cn('wr-origin-center', {
                'wr-animate-mines-pulse': props.isLoading,
              })}
              fillRule="evenodd"
              d="m58.163 38.653-17.304 8.188a1.536 1.536 0 0 0-.674.607c-.413.707-.111 1.617.674 1.988l17.304 8.152a3.53 3.53 0 0 0 3.004-.006l17.092-8.185c.282-.135.513-.343.664-.597.416-.705.12-1.58-.664-1.955L61.167 38.66a3.53 3.53 0 0 0-3.004-.007Zm-8.082 8.974c0 .73-1.535 1.322-3.428 1.322s-3.427-.592-3.427-1.322c0-.73 1.534-1.322 3.427-1.322 1.894 0 3.428.592 3.428 1.322Zm9.475-4.847c1.893 0 3.428-.592 3.428-1.322 0-.73-1.535-1.322-3.428-1.322s-3.428.592-3.428 1.322c0 .73 1.535 1.322 3.428 1.322Zm3.428 4.847c0 .73-1.535 1.322-3.428 1.322s-3.428-.592-3.428-1.322c0-.73 1.535-1.322 3.428-1.322s3.428.592 3.428 1.322Zm-3.428 7.491c1.893 0 3.428-.592 3.428-1.322 0-.73-1.535-1.322-3.428-1.322s-3.428.592-3.428 1.322c0 .73 1.535 1.322 3.428 1.322Zm16.33-7.491c0 .73-1.534 1.322-3.427 1.322s-3.428-.592-3.428-1.322c0-.73 1.535-1.322 3.428-1.322s3.427.592 3.427 1.322Z"
              clipRule="evenodd"
            />
          </g>
        </svg>
      )}
    </div>
  );
};

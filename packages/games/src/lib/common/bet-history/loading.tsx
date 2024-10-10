import { Spinner } from '../../ui/spinner';

export default function Loading() {
  return (
    <section className="wr-flex wr-h-[50vh] wr-w-full wr-items-center wr-justify-center wr-rounded-lg wr-border wr-border-zinc-800">
      <Spinner />
    </section>
  );
}

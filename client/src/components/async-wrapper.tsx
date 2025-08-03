import { Suspense } from "react";

type AsyncWrapperProps<T> = {
  loader: () => Promise<T>;
  fallback: React.ReactNode;
  render: (data: T) => React.ReactNode;
};

export default function AsyncWrapper<T>({ loader, fallback, render }: AsyncWrapperProps<T>) {
  const Inner = async () => {
    const data = await loader();
    return <>{render(data)}</>;
  };

  return (
    <Suspense fallback={fallback}>
      <Inner />
    </Suspense>
  );
}

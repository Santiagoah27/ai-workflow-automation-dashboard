type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading workflow data...",
}: LoadingStateProps) {
  return <section className="loading-state">{message}</section>;
}

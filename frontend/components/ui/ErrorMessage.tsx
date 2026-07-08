type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <section className="error-message" role="alert">
      {message}
    </section>
  );
}

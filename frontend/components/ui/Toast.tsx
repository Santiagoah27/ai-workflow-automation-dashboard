export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastProps = {
  toast: ToastMessage;
};

export function Toast({ toast }: ToastProps) {
  const role = toast.type === "error" ? "alert" : "status";

  return (
    <div className={`toast ${toast.type}`} role={role}>
      <span className="toast-indicator" aria-hidden="true" />
      <p>{toast.message}</p>
    </div>
  );
}

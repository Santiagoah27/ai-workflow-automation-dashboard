export type IconName =
  | "archive"
  | "check"
  | "dashboard"
  | "documentPlus"
  | "edit"
  | "history"
  | "list"
  | "sparkles"
  | "warning";

type IconProps = {
  className?: string;
  name: IconName;
  size?: number;
};

export function Icon({ className = "", name, size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`.trim()}
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {renderIcon(name)}
    </svg>
  );
}

function renderIcon(name: IconName) {
  switch (name) {
    case "dashboard":
      return (
        <>
          <rect height="7" rx="1.2" width="7" x="3" y="3" />
          <rect height="7" rx="1.2" width="7" x="14" y="3" />
          <rect height="7" rx="1.2" width="7" x="3" y="14" />
          <rect height="7" rx="1.2" width="7" x="14" y="14" />
        </>
      );
    case "documentPlus":
      return (
        <>
          <path d="M6 2.75h7.5L18 7.25v14H6z" />
          <path d="M13.5 2.75v4.5H18" />
          <path d="M12 11v6M9 14h6" />
        </>
      );
    case "history":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.25 2" />
          <path d="M4.25 5.5H8v3.75" />
        </>
      );
    case "list":
      return (
        <>
          <rect height="18" rx="1.5" width="16" x="4" y="3" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>
      );
    case "edit":
      return (
        <>
          <path d="m14.75 5.25 4 4L8 20H4v-4z" />
          <path d="m13 7 4 4M4 20h16" />
        </>
      );
    case "sparkles":
      return (
        <>
          <path d="m12 3 1.25 3.75L17 8l-3.75 1.25L12 13l-1.25-3.75L7 8l3.75-1.25z" />
          <path d="m18.5 14 .75 2.25L21.5 17l-2.25.75L18.5 20l-.75-2.25L15.5 17l2.25-.75z" />
          <path d="M5 13v4M3 15h4" />
        </>
      );
    case "check":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16.5 9" />
        </>
      );
    case "warning":
      return (
        <>
          <path d="M12 3 2.75 20h18.5z" />
          <path d="M12 9v5M12 17.25v.25" />
        </>
      );
    case "archive":
      return (
        <>
          <path d="M4 7h16v14H4z" />
          <path d="M3 3h18v4H3zM9 11h6" />
        </>
      );
  }
}

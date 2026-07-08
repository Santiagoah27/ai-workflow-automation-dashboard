export function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatEnum(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

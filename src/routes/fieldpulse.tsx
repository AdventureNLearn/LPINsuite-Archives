import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/fieldpulse")({
  beforeLoad: () => {
    throw redirect({ to: "/jobsite" });
  },
});

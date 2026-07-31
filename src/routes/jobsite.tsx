import { createFileRoute } from "@tanstack/react-router";
import { FieldpulseApp } from "@/components/fieldpulse/FieldpulseApp";

export const Route = createFileRoute("/jobsite")({
  component: JobsitePage,
  head: () => ({
    meta: [
      {
        title: "Jobsite · LPIN Suite",
      },
      {
        name: "description",
        content:
          "LPIN Suite Jobsite — US field reports, building-department team lane, inspections, industry schedules, and materials. Open packs. Device-local.",
      },
    ],
  }),
});

function JobsitePage() {
  return <FieldpulseApp />;
}

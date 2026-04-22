import { inngest } from "@/lib/inngest/client";
import { SlotTime } from "@/lib/inngest/functions/Timer/route";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [SlotTime],
});
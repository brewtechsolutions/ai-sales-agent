import { router } from "../trpc/trpc";
import { userRouter } from "./users/router";
import { authRouter } from "./auth/router";
import { productRouter } from "./products/router";
import { companiesRouter } from "./companies/router";
import { integrationsRouter } from "./integrations/router";
import { conversationsRouter } from "./conversations/router";
import { templatesRouter } from "./templates/router";
import { aiModelsRouter } from "./ai-models/router";
import { aiRouter } from "./ai/router";
import { companySetupRouter } from "./company-setup/router";
import { analyticsRouter } from "./analytics/router";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  product: productRouter,
  companies: companiesRouter,
  integrations: integrationsRouter,
  conversations: conversationsRouter,
  templates: templatesRouter,
  aiModels: aiModelsRouter,
  ai: aiRouter,
  companySetup: companySetupRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

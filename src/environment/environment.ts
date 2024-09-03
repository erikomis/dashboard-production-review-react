// export const environment =
//   import.meta.env.MODE === "production" ? prodEnvironment : devEnvironment;

// interface Environment {
//   apiUrl: string;
//   production: boolean;
// }

// let environment: Environment;

// if (import.meta.env.MODE === "production") {
//   environment = await import("./environment.prod.ts");
// } else {
//   environment = await import("./environment.ts");
// }

// export { environment };

// import { environment as prodEnvironment } from "./environment.prod.ts";
// import { environment as devEnvironment } from "./environment.ts";

// export const environment =
//   import.meta.env.MODE === "production" ? prodEnvironment : devEnvironment;

import prodEnvironment from "./environment.prod.ts";
import devEnvironment from "./environment.dev.ts";

const environments = {
  production: prodEnvironment,
  development: devEnvironment,
  // Você pode adicionar mais ambientes aqui, se necessário
};
const mode = import.meta.env.MODE as keyof typeof environments;
export const environment = environments[mode] || devEnvironment;

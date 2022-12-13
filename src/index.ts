import { Plugin, Project } from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers";

const verifyEngines =
  (errorReporter: ErrorReporter, isValidate: boolean) =>
  (project: Project, env: Record<string, string>): void => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    }

    const confParent = project.getWorkspaceByCwd(project.cwd).manifest.raw;
    const confChild = project.getWorkspaceByCwd(project.configuration.startingCwd).manifest.raw;

    const engines = (isValidate ? confParent.engines : { ...confParent.engines, ...confChild.engines }) ?? {};
    const ignoreEngines = isValidate ? [] : confChild.ignoreEngines ?? [];
    if (!ignoreEngines.includes(env["npm_lifecycle_event"])) {
      const options: EngineCheckerOptions = { project, errorReporter };
      const engineCheckers: EngineChecker[] = [new NodeEngineChecker(options), new YarnEngineChecker(options)];
      engineCheckers.forEach((engineChecker) => engineChecker.verifyEngine(engines));
    }
  };

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(ErrorReporter.Yarn, true),
    setupScriptEnvironment: verifyEngines(ErrorReporter.Console, false),
  },
};

export default plugin;

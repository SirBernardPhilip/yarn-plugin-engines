import { Plugin, Project } from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers";

const verifyEngines =
  (errorReporter: ErrorReporter, useParent: boolean) =>
  (project: Project): void => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    }

    const { engines = {} } = project.getWorkspaceByCwd(useParent ? project.cwd : project.configuration.startingCwd)
      .manifest.raw;
    const options: EngineCheckerOptions = { project, errorReporter };
    const engineCheckers: EngineChecker[] = [new NodeEngineChecker(options), new YarnEngineChecker(options)];
    engineCheckers.forEach((engineChecker) => engineChecker.verifyEngine(engines));
  };

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(ErrorReporter.Yarn, false),
    setupScriptEnvironment: verifyEngines(ErrorReporter.Console, true),
  },
};

export default plugin;

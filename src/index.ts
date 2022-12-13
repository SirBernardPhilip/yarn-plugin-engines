import { Plugin, Project } from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers";

const verifyEngines =
  (errorReporter: ErrorReporter, onlyParent: boolean) =>
  (project: Project): void => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    }

    const confParent = project.getWorkspaceByCwd(project.cwd).manifest.raw;
    const confChild = project.getWorkspaceByCwd(project.configuration.startingCwd).manifest.raw;

    console.log("parent", confParent.engines);
    console.log("child", confChild.engines);
    console.log("onlyParent", onlyParent);

    const engines = (onlyParent ? confParent.engines : { ...confParent.engines, ...confChild.engines }) ?? {};

    console.log("engines", engines)

    const options: EngineCheckerOptions = { project, errorReporter };
    const engineCheckers: EngineChecker[] = [new NodeEngineChecker(options), new YarnEngineChecker(options)];
    engineCheckers.forEach((engineChecker) => engineChecker.verifyEngine(engines));
  };

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(ErrorReporter.Yarn, true),
    setupScriptEnvironment: verifyEngines(ErrorReporter.Console, false),
  },
};

export default plugin;

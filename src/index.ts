import { Locator, Plugin, Project } from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers";

const verifyEngines = (
  project: Project,
  errorReporter: ErrorReporter,
  isValidate: boolean,
  scriptName?: string
): void => {
  const confParent = project.getWorkspaceByCwd(project.cwd).manifest.raw;
  const confChild = project.getWorkspaceByCwd(project.configuration.startingCwd).manifest.raw;

  const engines = (isValidate ? confParent.engines : { ...confParent.engines, ...confChild.engines }) ?? {};
  const ignoreEngines = confChild.ignoreEngines ?? [];
  if (isValidate || !ignoreEngines.includes(scriptName)) {
    const options: EngineCheckerOptions = { project, errorReporter };
    const engineCheckers: EngineChecker[] = [new NodeEngineChecker(options), new YarnEngineChecker(options)];
    engineCheckers.forEach((engineChecker) =>
      engineChecker.verifyEngine(
        engines,
        isValidate ? "install" : scriptName,
        isValidate ? project.cwd : project.configuration.startingCwd
      )
    );
  }
};

const verifyEnginesValidate =
  (errorReporter: ErrorReporter) =>
  (project: Project): void => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    } else {
      verifyEngines(project, errorReporter, true);
    }
  };

const verifyEnginesWrap =
  (errorReporter: ErrorReporter) =>
  (
    executor: () => Promise<number>,
    project: Project,
    _locator: Locator,
    scriptName: string
  ): (() => Promise<number>) => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return executor;
    } else {
      return async () => {
        verifyEngines(project, errorReporter, false, scriptName);
        return executor();
      };
    }
  };

const verifyEnginesSetup =
  (errorReporter: ErrorReporter) =>
  (project: Project, env: Record<string, string>): void => {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    } else if (env["npm_lifecycle_event"] == null) {
      verifyEngines(project, errorReporter, false, "raw command");
    }
  };

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEnginesValidate(ErrorReporter.Yarn),
    wrapScriptExecution: verifyEnginesWrap(ErrorReporter.Console),
    setupScriptEnvironment: verifyEnginesSetup(ErrorReporter.Console),
  },
};

export default plugin;

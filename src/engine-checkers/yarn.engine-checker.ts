import { satisfies } from "semver";
import { YarnVersion } from "@yarnpkg/core";
import { EngineChecker } from "./engine-checker";

export class YarnEngineChecker extends EngineChecker {
  get engine(): string {
    return "Yarn";
  }

  verifyEngine(engines: Record<string, string>, command: string, packageOrigin: string): void {
    const yarnRequiredVersion = engines.yarn;
    if (yarnRequiredVersion == null) {
      return;
    }
    if (!satisfies(YarnVersion, yarnRequiredVersion, { includePrerelease: true })) {
      this.throwWrongEngineError(YarnVersion, yarnRequiredVersion, command, packageOrigin);
    }
  }
}

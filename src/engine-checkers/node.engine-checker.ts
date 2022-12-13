import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { satisfies, validRange } from "semver";
import { npath } from "@yarnpkg/fslib";
import { formatUtils } from "@yarnpkg/core";
import { EngineChecker } from "./engine-checker";

export class NodeEngineChecker extends EngineChecker {
  get engine(): string {
    return "Node";
  }

  verifyEngine(engines: Record<string, string>, command: string, packageOrigin: string): void {
    let nodeRequiredVersion = engines.node;
    if (nodeRequiredVersion == null) {
      return;
    }
    if (!satisfies(process.version, nodeRequiredVersion, { includePrerelease: true })) {
      this.throwWrongEngineError(
        process.version.replace(/^v/i, ""),
        nodeRequiredVersion.replace(/^v/i, ""),
        command,
        packageOrigin
      );
    }
  }
}

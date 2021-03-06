#!/usr/bin/env node

import { Builtins, Cli } from "clipanion";
import { DefaultCommand } from "../src/default.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const [_, __, ...args] = process.argv;

const cli = new Cli({
    binaryLabel: `add-federated-types`,
    binaryName: `@apollosolutions/add-federated-types`,
    binaryVersion: pkg.version,
});

cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
cli.register(DefaultCommand);
cli.runExit(args);

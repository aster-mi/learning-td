import { startVitest } from "vitest/node";

const args = process.argv.slice(2);
const command = args[0] === "run" ? "run" : "watch";
const filters = command === "run" ? args.slice(1) : args;

const ctx = await startVitest("test", filters, {
  config: false,
  environment: "node",
  pool: "threads",
  maxWorkers: 1,
  fileParallelism: false,
  reporters: ["default"],
  run: command === "run",
  watch: command !== "run",
});

if (!ctx) {
  process.exit(1);
}

if (command === "run") {
  const failed = ctx.state.getFiles().some((file) => file.result?.state === "fail");
  await ctx.close();
  process.exit(failed ? 1 : 0);
}

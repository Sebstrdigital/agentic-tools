#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_THRESHOLDS = {
  turns: Number(process.env.AGENTIC_TOOLS_STEWARD_TURNS || 6),
  tools: Number(process.env.AGENTIC_TOOLS_STEWARD_TOOLS || 20),
  elapsedMs: Number(process.env.AGENTIC_TOOLS_STEWARD_ELAPSED_MS || 30 * 60 * 1000),
};

const MODE = process.env.AGENTIC_TOOLS_STEWARD_MODE || "advisory";

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parseInput(raw) {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function eventName(input) {
  return input.hook_event_name || input.event || input.event_name || "unknown";
}

function cwd(input) {
  return input.cwd || process.cwd();
}

function sessionId(input) {
  return input.session_id || input.sessionId || "unknown-session";
}

function stewardshipDir(input) {
  return path.join(cwd(input), ".agentic-tools", "skill-stewardship");
}

function statePath(input) {
  return path.join(stewardshipDir(input), "state.json");
}

function suggestionsPath(input) {
  return path.join(stewardshipDir(input), "suggestions.md");
}

function loadState(input) {
  const file = statePath(input);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { sessions: {} };
  }
}

function saveState(input, state) {
  fs.mkdirSync(stewardshipDir(input), { recursive: true });
  fs.writeFileSync(statePath(input), `${JSON.stringify(state, null, 2)}\n`);
}

function currentSession(state, input) {
  const id = sessionId(input);
  const now = new Date().toISOString();
  if (!state.sessions[id]) {
    state.sessions[id] = {
      startedAt: now,
      updatedAt: now,
      turns: 0,
      toolEvents: 0,
      skillUsed: false,
      slashSkillUsed: false,
      suggestionWritten: false,
      events: {},
    };
  }
  return state.sessions[id];
}

function looksLikeSkillTool(input) {
  const toolName = String(input.tool_name || input.toolName || "").toLowerCase();
  if (toolName === "skill") return true;

  const toolInput = input.tool_input || input.toolInput || {};
  const values = JSON.stringify(toolInput).toLowerCase();
  return values.includes('"skill"') || values.includes("skill_name") || values.includes("skill-name");
}

function looksLikeSlashSkill(input) {
  const prompt = String(input.prompt || input.user_prompt || input.message || "");
  return /^\/[a-z0-9][a-z0-9-]*(\s|$)/i.test(prompt.trim());
}

function elapsedMs(session) {
  return Date.now() - new Date(session.startedAt).getTime();
}

function shouldSuggest(session) {
  if (session.skillUsed || session.slashSkillUsed || session.suggestionWritten) return false;
  return (
    session.turns >= DEFAULT_THRESHOLDS.turns ||
    session.toolEvents >= DEFAULT_THRESHOLDS.tools ||
    elapsedMs(session) >= DEFAULT_THRESHOLDS.elapsedMs
  );
}

function suggestionReason(session) {
  const reasons = [];
  if (session.turns >= DEFAULT_THRESHOLDS.turns) reasons.push(`${session.turns} user turns`);
  if (session.toolEvents >= DEFAULT_THRESHOLDS.tools) reasons.push(`${session.toolEvents} tool events`);
  if (elapsedMs(session) >= DEFAULT_THRESHOLDS.elapsedMs) reasons.push("long elapsed time");
  return reasons.join(", ");
}

function appendSuggestion(input, session) {
  fs.mkdirSync(stewardshipDir(input), { recursive: true });
  const stamp = new Date().toISOString();
  const body = [
    `## ${stamp}`,
    "",
    "This session may deserve a skill stewardship review.",
    "",
    `Reason: ${suggestionReason(session)} with no observed skill usage.`,
    "",
    "Suggested next step: review whether this was a one-off task, an existing skill mismatch, or a reusable workflow.",
    "",
    "Only create a draft when the workflow is repeatable, concrete, non-duplicative, and worth preserving. Drafts stay quarantined under `.agentic-tools/skill-stewardship/drafts/` until explicitly promoted.",
    "",
  ].join("\n");
  fs.appendFileSync(suggestionsPath(input), body);
}

function main() {
  const input = parseInput(readStdin());
  const name = eventName(input);
  const state = loadState(input);
  const session = currentSession(state, input);

  session.updatedAt = new Date().toISOString();
  session.events[name] = (session.events[name] || 0) + 1;

  if (name === "UserPromptSubmit") {
    session.turns += 1;
    if (looksLikeSlashSkill(input)) session.slashSkillUsed = true;
  }

  if (name === "UserPromptExpansion" && looksLikeSlashSkill(input)) {
    session.slashSkillUsed = true;
  }

  if (name === "PreToolUse" || name === "PostToolUse" || name === "PostToolBatch") {
    session.toolEvents += 1;
    if (looksLikeSkillTool(input)) session.skillUsed = true;
  }

  const needsStewardshipReview = shouldSuggest(session);

  if ((name === "Stop" || name === "SessionEnd") && needsStewardshipReview) {
    appendSuggestion(input, session);
    session.suggestionWritten = true;
  }

  saveState(input, state);

  if (MODE === "gate" && (name === "Stop" || name === "UserPromptSubmit") && needsStewardshipReview) {
    process.stdout.write(JSON.stringify({
      decision: "block",
      reason: "Skill Stewardship suggests reviewing whether this work deserves a reusable skill before continuing.",
    }));
    return;
  }

  process.stdout.write("{}");
}

main();

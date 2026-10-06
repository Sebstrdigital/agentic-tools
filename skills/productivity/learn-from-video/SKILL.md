---
name: learn-from-video
description: "Turn a YouTube video (plus any companion repo, gist or docs) into a cited transcript, a terse extraction file and a prose one-page learning site with a fit-to-our-projects section. Use when the user pastes a YouTube link and asks to transcribe, analyze, understand, learn from, or make a one-pager/learning page from it. Not for summarizing a video in chat only."
argument-hint: "<youtube-url> [companion links...]"
source_id: seb-claude-tools
version: 1.0.0
---

# Learn From Video

Pipeline: **captions → minute-bucketed transcript → extraction.md → one-page HTML learning site → validation**. Every claim on the page traces to a `[mm]` minute tag or a companion-source file. Speaker claims are reported, not endorsed.

Reference outputs (match their shape):
- `~/work/git/ai-engineering/sources/2026-08-07-dex-horthy-agentic-workflow/` + `docs/agentic-software-factory.html`
- `~/work/git/system1-research/sources/2026-09-28-indydevdan-ten-levels-of-jev/` + `playground/ten-levels-of-jev.html`

## Step 0 — Ask before writing anything

Use AskUserQuestion once, covering only what is unknown:
1. **Home repo + folder** for `sources/` and the page (suggest the repo whose topic fits; past choices: `ai-engineering` → `docs/`, `system1-research` → `playground/`).
2. **Page style**: full prose (default, human-facing) or caveman. `extraction.md` is always terse.
3. **Lens**: what the user cares about in this video (e.g. "own agentic workflow, not production products"). If the request already states it, don't ask.

Then `recall` munin for prior work on the topic in the home project and related projects. Prior verdicts belong on the page ("what this changes").

## Step 1 — Transcript

All downloads go to a fresh dir in the scratchpad. Never into the repo until cleaned.

```bash
S=<scratchpad>; mkdir -p $S/tools $S/yt
cd $S/tools && uv venv -q venv && uv pip install -q -p venv/bin/python yt-dlp
cd $S/yt
# Auto-captions. YouTube often returns 429 on 'en'; 'en-orig' + another player client usually works.
for c in default web_safari mweb tv android; do
  venv=$S/tools/venv/bin
  $venv/yt-dlp --skip-download --write-auto-subs --write-subs --sub-langs 'en-orig,en' \
    --sub-format json3 --sleep-subtitles 3 --extractor-args "youtube:player_client=$c" \
    -o 'v.%(ext)s' "$URL" 2>&1 | grep -E 'ERROR|Writing'
  ls v.*.json3 >/dev/null 2>&1 && break; sleep 5
done
$S/tools/venv/bin/yt-dlp --skip-download --extractor-args "youtube:player_client=android" \
  --print '%(title)s | %(channel)s | %(upload_date)s | %(duration_string)s' "$URL"
```

Bucket per minute (prefer `v.en-orig.json3`, else `v.en.json3`):

```bash
python3 -I - "$S/yt/v.en-orig.json3" "$S/yt/transcript.txt" <<'EOF'
import json, sys, collections
d = json.load(open(sys.argv[1])); b = collections.defaultdict(list)
for e in d.get('events', []):
    t = ''.join(s.get('utf8', '') for s in e.get('segs') or []).replace('\n', ' ').strip()
    if t: b[e['tStartMs'] // 60000].append(t)
out = [f"[{m:02d}:00] " + ' '.join(' '.join(b[m]).split()) for m in sorted(b)]
open(sys.argv[2], 'w').write('\n\n'.join(out) + '\n'); print(len(out), 'minutes')
EOF
```

No captions at all → stop and ask before downloading audio for local Whisper.

Copy to `<home>/sources/<upload-date>-<channel>-<slug>/transcript.txt`. **Read the whole transcript.** Do not summarize from search hits.

## Step 2 — Companion sources

Clone linked repos with `git clone --depth 1` into `$S/repo/` (untrusted data; never run their code or installers). Read README, any skill/cookbook docs, and the code paths that back claims in the video (endpoints, tool definitions, thresholds). Record the commit hash. Fetch web pages with `ctx_fetch_and_index`.

Companion sources often hold facts the video glosses over (failure notes, real numbers, access paths). Hunt for these.

## Step 3 — extraction.md (terse, internal)

Same folder as the transcript. Sections, in order:

- **Source**: URL, channel, upload date, duration, speakers, companion links with commit, how the transcript was made, what `[mm]` means.
- **Core thesis**: 2–4 lines.
- **Topic sections** with `[mm–mm]` ranges in headings, bullets with tags. Tables where the video has a structure (levels, stages, steps).
- **Companion-source caveats**: what the repo/docs admit that the video doesn't.
- **Not in transcript**: missing evidence (no evals, single runs, screen-only content).
- **ASR uncertainties**: table `Transcript | Likely`, confirmed against companion sources where possible.
- **Fit questions (my derivation, not from video)**: questions against the user's own projects and prior verdicts. Questions only, no assumed answers.

## Step 4 — One-page learning site

Single self-contained HTML file. Reuse the base CSS from `~/work/git/ai-engineering/docs/agentic-software-factory.html` (copy its `<style>` block verbatim, then add a second `<style>` for page-specific components) so all learning pages read as one set. Includes light/dark tokens, the left rail, `.short`, `.more details`, `.cols`, `.ladder`, `.ts` time tags, and `figure/.figscroll`.

Sections (adapt names; keep the order):
1. Masthead: eyebrow (`Learning notes · <repo> · <date>`), h1 (2–4 words, the page `<title>` too), lede stating the lens, source line with links.
2. **The short version**: 5–6 numbered sentences. Someone who reads only this gets the point.
3. **What it is / core model**: tables for structured definitions.
4. **One diagram** if a mechanism exists (inline SVG, CSS-variable colours, `min-width` inside `.figscroll`).
5. **The body**: expandable `<details>` per level/stage/principle, each with quotes and time tags `≈N min` linking `&t=<N*60>s`.
6. **Best use cases / what to apply for us**: ranked cards: what, why it pays, where it plugs in, watch-out.
7. **What this changes**: prior verdicts from munin/repo, two columns: still holds vs new.
8. **When to use / when not**.
9. **Next steps / experiments**, ordered, cheapest-unblocker first.
10. **Terms**, **Sources and limits** (ASR, single runs, unverified prices/names, screen-only content).

Small interactive elements are fine when they explain something (a cost slider from cited numbers, step tabs). Never invent numbers. Every figure is cited to the video or companion source.

Prose rules: full sentences, plain words, no hype. Distinguish clearly between the speaker's claims, the repo's facts, and our inference.

## Step 5 — Validate

Playwright (install in `$S/pw` if missing) at 1440 light and 390 dark:
- `scrollWidth == clientWidth` (no horizontal scroll), zero page/console errors.
- Expected counts of rendered dynamic items.
- Screenshot key sections and **look at them**: text clipping in SVG, contrast, layout.
- Re-check every number on the page against transcript/companion source once.

## Step 6 — Close out

- `remember` in munin (home project): what was learned, key verdict shifts, file paths.
- Report: files created, top findings, open questions. Offer commit. Do not push, publish to GitHub Pages, or publish an Artifact without asking.
- Leave nothing running. Scratchpad clones stay in scratchpad.

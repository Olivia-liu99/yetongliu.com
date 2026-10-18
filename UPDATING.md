# Updating your website

Everything on yetongliu.com comes from a few plain text files in this folder. You change a file, publish it, and the live site updates by itself in about two minutes.

## 1. How your site works

| What you want to change | File to edit |
|---|---|
| Bio, title, email, profile links, research interests, job market settings | `src/content/profile/index.md` |
| A paper | one file per paper in `src/content/papers/` |
| Your photo | `src/content/profile/photo.jpg` (use `npm run photo`, below) |
| Your CV | `public/cv.pdf` (use `npm run cv`, below) |
| The Teaching page | `src/content/teaching/index.md` |

Write text values in double quotes, like `title: "My Paper"`. Titles often contain colons, and quotes keep them safe.

## 2. Preview on your computer

**The first time on a computer:**
1. Install Node.js, the "LTS" version, from https://nodejs.org.
2. Open this folder in VS Code and open a terminal (Terminal → New Terminal).
3. Run `sh scripts/dropbox-ignore.sh`. This tells Dropbox not to sync the thousands of tool files the next step downloads.
4. Run `npm install`.

If you ever delete the `node_modules` folder, for example to fix an install problem, run `sh scripts/dropbox-ignore.sh` again before `npm install`.

**Every time:**
1. Run `npm run dev`.
2. Open http://localhost:4321. The page refreshes as you save files.
3. Press Ctrl+C in the terminal to stop.

## 3. Publish a change

**From VS Code:**
1. Click the Source Control icon in the left sidebar.
2. Type a short note, such as "Add new paper".
3. Click **Commit**, then **Sync Changes**.

**From the GitHub website (no software needed):**
1. Open your repository on github.com and go to the file.
2. Click the pencil icon and make your edit.
3. Click **Commit changes**.

Either way, the site is updated about two minutes later.

## 4. Add or edit a paper

1. In `src/content/papers/`, copy an existing paper file.
2. Name the copy with lowercase words joined by dashes, for example `ai-and-hiring.md`.
3. Edit the fields between the two `---` lines. Put the abstract below the second `---`. A paper with no abstract shows no "Abstract" link.

```yaml
---
title: "Your Paper Title: Evidence from an Example Setting"
group: "working"
status: "Revise and resubmit at *Strategic Management Journal*"
coauthors:
  - name: "Coauthor Name"
    url: "https://www.example.edu/coauthor"
note: "Winner, Best Conference PhD Paper Prize, SMS 2027"
order: 1
links:
  ssrn: "https://ssrn.com/abstract=1234567"
  slides: "/papers/your-paper-slides.pdf"
---
The abstract goes here, as ordinary paragraphs.
```

| Field | What it does | Required? |
|---|---|---|
| `title` | The paper's title | Yes |
| `group` | Which section it appears in: `"published"`, `"working"`, or `"in-progress"` | Yes |
| `coauthors` | Each coauthor's `name`, and optionally a `url` to their page | No |
| `status` | Journal or stage. Text between `*stars*` is shown in italics | No |
| `note` | One extra line for awards, grants, or press coverage | No |
| `order` | Position within its section. Smaller numbers come first | No |
| `home` | `false` hides the paper from the home page; `true` shows a published paper there | No |
| `summary` | Two or three sentences, shown when this is your job market paper | No |
| `links` | Any of `pdf`, `ssrn`, `doi`, `published`, `slides`, `data`, plus `other` for anything else | No |

To post a PDF on your own site, put the file in `public/papers/` and link it as `pdf: "/papers/the-file.pdf"`. For any other link, use the full address starting with `https://`. Extra links go under `other`:

```yaml
links:
  other:
    - label: "NBER Working Paper"
      url: "https://www.nber.org/papers/w12345"
```

## 5. Update your CV

1. Recompile your CV in LaTeX as usual. Check that it doesn't include anything you wouldn't want public, like your phone number.
2. Run `npm run cv`. It copies your master CV, `Dropbox/CV/Yetong_Liu_CV.pdf`, into the site.
3. Publish (step 3).

To use a different file just once, run `npm run cv -- "/path/to/other CV.pdf"`. Tip: type `npm run cv -- ` and then drag the PDF into the terminal. If your master CV moves, change the `DEFAULT_SOURCE` line near the top of `scripts/cv.mjs`.

## 6. Change your photo

1. Run `npm run photo -- "/path/to/photo.jpg"`. It crops the photo to a portrait shape around the center, resizes it, and removes camera and location details.
2. Open `src/content/profile/photo.jpg` and check the crop. If the center crop doesn't work for a photo, crop it yourself first, then run the command again.
3. Publish (step 3).

## 7. Change your bio, title, links, or interests

Edit `src/content/profile/index.md`. Your bio is the text below the second `---`. Profile links live under `links`. For example, adding this line makes the Google Scholar link appear:

```yaml
links:
  scholar: "https://scholar.google.com/citations?user=YOUR_ID"
```

Your research interests (`interests`) appear on one line, separated by commas, exactly as you type them, so type them the way you want them shown.

The available links are `scholar`, `linkedin`, `orcid`, and `ssrn`. A link you leave out simply doesn't appear. `description` is the one-sentence summary that search engines show. Keep it under 160 characters.

## 8. Job market mode

When you go on the market, change these settings in `src/content/profile/index.md`:

```yaml
title: "PhD Candidate in Strategic Management"
jobMarket:
  onMarket: true
  years: "2029–2030"
  paper: "your-job-market-paper"   # the paper's file name, without .md
  references:
    - name: "First Reference"
      title: "Professor of Strategic Management"
      school: "University of Toronto"
      url: "https://..."
showTeaching: true
```

Then:
1. Add a `summary:` (two or three sentences) to the job market paper's own file.
2. If you turned on `showTeaching`, list your courses in `src/content/teaching/index.md`.
3. Publish.

Your home page now shows the "on the market" line, the job market paper first, other research, and your references. The Teaching page appears in the menu. To switch any of this off later, set it back to `false` or remove the lines.

## 9. If publishing fails

If a file has a mistake, the site keeps showing the previous version and GitHub emails you. To see what went wrong:

1. Open the repository on github.com and click the **Actions** tab.
2. Open the failed run (marked with a red ✗), then the **build** step.
3. The error names the file and the field. For example, `papers → my-paper … title: Required` means `my-paper.md` is missing its title.
4. Fix it and publish again.

## 10. Your domain

yetongliu.com is registered at Porkbun. The first renewal date is 2027-10-18, and auto-renew is on. Keep the payment method on your Porkbun account current, because a lapsed domain would take the site offline.

### How the domain is connected

If the site ever stops loading at yetongliu.com, check these four places.

1. **GitHub verified domain.** On github.com: profile picture → **Settings** → **Pages**. `yetongliu.com` should be listed as verified. Verification uses a `TXT` record at Porkbun with host `_github-pages-challenge-Olivia-liu99`.
2. **Porkbun DNS records.** Domain Management → yetongliu.com → **DNS**:
   - Four `A` records with an empty host: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Four `AAAA` records with an empty host: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - One `CNAME` record with host `www` and answer `olivia-liu99.github.io`
3. **Repository Pages settings.** In the `yetongliu.com` repository: **Settings** → **Pages**. **Source** should be **GitHub Actions**, **Custom domain** should be `yetongliu.com`, and **Enforce HTTPS** should be ticked.
4. **The latest deploy.** The repository's **Actions** tab should show a green ✓ on the most recent run.

If you change your GitHub username, update the `www` record's answer and the `TXT` record's host to the new name, then re-verify the domain on GitHub.

---

**For whoever helps you with the code:** `npm test` runs the unit tests and builds the site twice, once with your real content and once with a fixture that has every job market feature switched on (`tests/fixtures/market`). Browser tests are in `tests/e2e` (Python, pytest-playwright).

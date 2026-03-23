---
title: Building an AI-Powered Email HTML/CSS Generator in 2021
description: Learn how I built an AI email template generator from scratch. Get
  historical insights on using AI for web development, choosing the right tech
  stack, and iterating on SaaS MVPs.
date: 2021-08-06
tags:
  - saas
  - ai
  - business
---
## The Problem

Creating and modifying email templates is a pain. You need to know HTML, CSS, and all the weird limitations of email clients. I wanted a tool that could generate decent templates quickly. 

## Project Goals

I wanted to:

* Build a simple demo that lets users chat with an AI agent about email templates
* Generate HTML/CSS for emails and show a live preview
* Keep the codebase minimal and easy to hack on

### Future Ideas

* Live editing
* Custom assets (logos, company info, etc.)
* Section-based commands ("Update footer with social links")
* Undo/redo for template changes

## Building the Demo

I started with a static site generator ([hugo](https://gohugo.io/)) and a nice template ([hugoplate](https://github.com/zeon-studio/hugoplate)). Netlify made deployment easy and free. I wanted to spend my time on the actual prompt & code, not infrastructure.

I used Google Analytics and Formspree for basic metrics and feedback. Most of my time went into wiring up the chat interface and code preview. For my terminal, I used Warp. It's fast and makes my workflow smoother. I'm looking into multi tree agentic development with an orchestrator and way to pass artifacts between agent roles.



## Iterating on Content

I used AI to help rewrite most of the landing page content. It was fun to see how different models could change the tone of the messaging.

Here are some before/after shots:

<div style="display: flex">
<div>
<h3>Before</h3>
<img src="/img/ai-based-email-html-css-generator/hugo-plate-template.png" alt="Hugo Plate template screenshot" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>
</div>
<div>
<h3>After</h3>
<img src="/img/ai-based-email-html-css-generator/bassoon-ai-content-rewrite.png" alt="Bassoon AI content rewrite screenshot" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>
</div>
</div>

### Attribution

Shout out to the creators of [hugoplate](https://github.com/zeon-studio/hugoplate) and [storyset](https://storyset.com/email) for making the site look good.

### Using AI to Build

I used ChatGPT to help brainstorm and generate initial prompts and code for the MVP. My prompt focused on simplicity and client-side tech. The AI was surprisingly good at suggesting features and code structure. One thing I learned: configs and rules for the agents are extremely important. Even if you tell them to do something they sometimes don't listen so you need to have checks and balances for each stage of development. No model can do it in one pass currently. Also make sure to handle branching across multiple agents/tabs. 

- - -

## What Worked & What Didn't

I tracked basic metrics (visitors, feedback, bounce rate) just to see if anyone cared. Most of my learning came from building and iterating, not from chasing signups.

If I were to do it again, I'd focus even more on the technical side and less on the "MVP validation" stuff. The most fun was hacking on the code and seeing the AI generate templates. 

## Lessons Learned

* AI is great for brainstorming and prototyping, but you still need to know your basics (HTML, CSS, email quirks)
* Simple tools and static sites are perfect for quick experiments
* Building for yourself is more fun than chasing metrics
* If you need something, build it for yourself first. If others find it useful, that's a bonus.

## Final Thoughts

This project was a fun project. It's not production-ready, but it works, and I found my enjoyment in creating projects again with AI.

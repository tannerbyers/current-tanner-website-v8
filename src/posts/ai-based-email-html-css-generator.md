---
title: "Building an AI-Powered Email HTML/CSS Generator: My Process & Lessons"
description: Learn how I built an AI email template generator from scratch. Get practical insights on using AI for web development, choosing the right tech stack, and iterating on SaaS MVPs.
date: 2021-08-06
tags: [SaaS, AI, Business]
layout: layouts/post.njk
---


# Why I Built This


I've always been fascinated by the intersection of automation and design. Email templates are notoriously tricky. Responsive layouts, client quirks, accessibility, and the endless battle with HTML/CSS. I wanted to see if I could use AI to make this easier for myself and others. Honestly, I just needed a better way to run my own email campaigns and couldn't find a good service, so I built my own.



## The Problem

Creating and modifying email templates is a pain. You need to know HTML, CSS, and all the weird limitations of email clients. I wanted a tool that could generate decent templates quickly, and maybe even teach me something along the way. Plus, I wanted something that fit my workflow and didn't cost a fortune.


## Project Goals


I wanted to:
- Build a simple demo that lets users chat with an AI agent about email templates
- Generate HTML/CSS for emails and show a live preview
- Keep the codebase minimal and easy to hack on

### Future Ideas
- Live editing
- Custom assets (logos, company info, etc.)
- Section-based commands ("Update footer with social links")
- Undo/redo for template changes


## Building the Demo


I started with a static site generator ([hugo](https://gohugo.io/)) and a nice template ([hugoplate](https://github.com/zeon-studio/hugoplate)). Netlify made deployment easy and free. I wanted to spend my time on the actual AI/code, not infrastructure.

I used Google Analytics and Formspree for basic metrics and feedback. Most of my time went into wiring up the chat interface and code preview. For my terminal, I used Warp. It's fast and makes my workflow smoother.

## Let's get configuring

Alright we've got our template, let's configure the base services. here's the ones I use:

- [Google analytics](https://analytics.google.com)
- [Formspree.io](https://www.formspree.io)


## Iterating on Content


I used AI to help rewrite some of the landing page content. It was fun to see how different prompts could change the tone and clarity. If you're trying something similar, try a few different AI tools and see which fits your workflow best.

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


I used ChatGPT to help brainstorm and generate code for the MVP. My prompt focused on simplicity and client-side tech. The AI was surprisingly good at suggesting features and code structure. One thing I learned: configs and rules for the agents are extremely important. If you don't handle branching and new feature requests properly, you risk breaking things or reverting work. Keep it simple, but plan for growth.

---


## What Worked & What Didn't


I tracked basic metrics (visitors, feedback, bounce rate) just to see if anyone cared. Most of my learning came from building and iterating, not from chasing signups.

If I were to do it again, I'd focus even more on the technical side and less on the "MVP validation" stuff. The most fun was hacking on the code and seeing the AI generate templates. Learn where AI works and where it doesn't. Find the balance between cost and usefulness.


## Lessons Learned


- AI is great for brainstorming and prototyping, but you still need to know your basics (HTML, CSS, email quirks)
- Simple tools and static sites are perfect for quick experiments
- Building for yourself is more fun than chasing metrics
- If you need something, build it for yourself first. If others find it useful, that's a bonus.

## Final Thoughts


This project was a blast. It's not production-ready, but it works, and I learned a ton. Looking for more insights on [building scalable web applications](/posts/building-modern-healthcare-web-app/) or need help with your [tech consulting site](/posts/building-consulting-site/)? Want to learn more about [AI in developer workflows](/speaking/)? Check out my other posts or reach out!

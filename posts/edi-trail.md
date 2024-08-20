---
title: EDI Trail - My Solution to Responsible Validation of EDI
description: I've seen how EDI transactions are processed and the current systems roll them out based on company code releases, not operational feedback.
date: 2024-08-19
tags: [startup, web devlopment, business, EDI]
layout: layouts/post.njk

---

I think EDI transaction validation should be handled with more care. Current systems roll them out based on company code releases, not operational feedback.

## Background

Imagine you are processing an EDI file (850 purchase order or 997 functional acknowledgement anyone?) and want to add an edit to check for certain conditions based on requirements a trading partner emailed you. For this example lets say you want to check that a specific memberid prefix is not used after a certain date. 

Now most companies would start building out an edit in their edit system of choice and would wait for a release date. The problem here is if there's a mistake in the logic of the edit, the only way said companies will know if there's an issue is if the transactions trigger some alarm (most likely set too high) or customers file complaints. 

Now both of these options above do work, but I think a more gradual roll out and handing validation based on dynamic factors like location or time.  

## EDI Trail
A/B Testing for EDI Systems
1. Gradual Rollouts
2. Advanced Targeting
3. Experiments


Requires SDK for sending A/B Data and validation requests from Node js system
Requires backend server running to receive
Requires UI (react) to configure A/B Testing and view results
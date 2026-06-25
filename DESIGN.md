---
version: alpha
name: Orun.AI
description: Visual identity for an operational AI workforce platform with premium institutional cues and dense, trustworthy product surfaces.
colors:
  primary: "#0C0F1C"
  secondary: "#3A4055"
  tertiary: "#C7A347"
  neutral: "#EEF1F6"
  text-primary: "#111827"
  text-inverse: "#F5F5F5"
  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
typography:
  h1:
    fontFamily: "Cormorant Garamond"
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.02em"
  h2:
    fontFamily: "Cormorant Garamond"
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.01em"
  body-md:
    fontFamily: "Inter"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: "Inter"
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: 6px
  md: 10px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  app-shell:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-primary}"
  sidebar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.sm}"
  button-accent:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  badge-highlight:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.text-primary}"
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.primary}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.text-primary}"
---

## Overview

Orun.AI combines a premium institutional identity with a practical operating console. The product should feel strategic, calm and precise, not mystical. The interface must communicate that agents are supervised systems with observable state, not magic black boxes.

The visual system has two modes that share one identity: a dark, brand-heavy institutional layer and a lighter product layer for daily operations. Institutional surfaces introduce the brand. Product surfaces prioritize scanability, workflow state and data density.

## Colors

The palette is anchored in dark ink, warm metallic gold and pale operational neutrals.

- **Primary (`#0C0F1C`)** is the anchor for sidebars, headers, hero surfaces and serious actions.
- **Secondary (`#3A4055`)** supports metadata, secondary text and structural chrome on dark surfaces.
- **Tertiary (`#C7A347`)** is the signature accent for highlights, premium states and selected calls to action.
- **Neutral (`#EEF1F6`)** is the primary application background and should keep dashboards bright and readable.
- **Text Primary (`#111827`)** is the default ink on light surfaces.
- **Text Inverse (`#F5F5F5`)** is reserved for dark branded surfaces.

Use status colors only for system meaning. Gold is a brand accent, not a generic success state.

## Typography

Typography should separate institution from operation.

- Headings use **Cormorant Garamond** to preserve the brand's sense of depth and authorship.
- Body text, controls, tables and logs use **Inter** for clarity at dashboard density.
- Uppercase labels should be sparse and used only for metadata, badges or micro-headings.

Avoid long serif paragraphs, oversized hero copy inside the app shell and decorative typography in dense operational contexts.

## Layout

Layouts should favor clear navigation, strong grouping and measurable whitespace rather than decorative emptiness.

- The dashboard should use structured grids, quick metrics and adjacent analytical views.
- Detail pages should prioritize status, next actions, execution history and important context near the top.
- Forms should be linear, practical and broken into meaningful sections when they become long.
- On mobile, preserve hierarchy before preserving density; stack cards and charts in a predictable order.

Spacing should feel deliberate and compact, with `md` and `lg` used as the default rhythm units.

## Elevation & Depth

Depth should be restrained. Cards, modals and floating controls may use subtle shadows or contrast shifts, but the product should not resemble a glossy marketing site.

Use elevation to separate layers of interaction:

- base canvas for the app shell
- card layer for content groups
- modal layer for focused decisions

Prefer border definition and contrast over heavy blur or exaggerated shadows.

## Shapes

Shapes should be clean and slightly softened, not bubbly.

- Default radius is `10px` for cards and containers.
- Buttons and small controls use tighter rounding.
- Avoid pill-heavy interfaces unless the component pattern already requires it.

The overall geometry should suggest precision and trust rather than playfulness.

## Components

Component styling should reinforce the product's operational tone.

- **Sidebar:** dark, stable and brand-forward, acting as the system spine.
- **Cards:** white or near-white surfaces with clear borders and concise padding.
- **Primary buttons:** deep ink background with light text for decisive actions.
- **Accent buttons or badges:** gold accents reserved for important, brand-relevant emphasis.
- **Charts:** simple and readable first; avoid noisy gradients, 3D effects or ornamental legends.

Tables, logs and execution histories should privilege readability over visual flourish.

## Do's and Don'ts

Do:

- build interfaces that look auditable and intentional
- balance premium brand cues with operational clarity
- make workflow state, lead state and execution state obvious
- preserve strong contrast on both light and dark surfaces

Don't:

- use mystical iconography, religious symbolism or prophecy language
- default to generic purple SaaS gradients
- overload dashboards with nested cards or decorative containers
- rely on color alone to communicate risk, failure or progress

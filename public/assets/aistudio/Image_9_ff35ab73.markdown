---
name: Aaranya Interiors
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#454843'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#757873'
  outline-variant: '#c5c7c1'
  surface-tint: '#5c5f5a'
  primary: '#101310'
  on-primary: '#ffffff'
  primary-container: '#252824'
  on-primary-container: '#8d8f8a'
  inverse-primary: '#c5c7c1'
  secondary: '#725b2f'
  on-secondary: '#ffffff'
  secondary-container: '#fcdba4'
  on-secondary-container: '#775f33'
  tertiary: '#0e1506'
  on-tertiary: '#ffffff'
  tertiary-container: '#222a18'
  on-tertiary-container: '#89927a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e3dd'
  primary-fixed-dim: '#c5c7c1'
  on-primary-fixed: '#191c19'
  on-primary-fixed-variant: '#454843'
  secondary-fixed: '#ffdea7'
  secondary-fixed-dim: '#e1c28d'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#58431a'
  tertiary-fixed: '#dde6cb'
  tertiary-fixed-dim: '#c1cab0'
  on-tertiary-fixed: '#161e0d'
  on-tertiary-fixed-variant: '#414a36'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 68px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 50px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-tablet: 2.5rem
  margin-mobile: 1.5rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2.5rem
  space-xl: 4.5rem
---

## Brand & Style

This design system reflects the identity of a bespoke, architectural interior design studio operating within Delhi NCR and Greater Noida West. It caters to discerning homeowners, real estate visionaries, and patrons seeking sophisticated residential spaces rooted in craftsmanship, spatial harmony, and refined materials.

The emotional signature is poised, quiet, and opulent—reminiscent of tactile natural stone, hand-brushed brass, and curated gallery living. The visual approach balances warm minimalism and high-end editorial curation:
- **Warm Minimalist Foundation:** Generous spatial margins, uncluttered compositions, and intentional negative space evoke expansive architectural volumes.
- **Editorial Nuance:** Refined typography pairings and precise alignment echo the poise of collectible design monographs and high-fashion spatial folios.
- **Architectural Tactility:** Subtle transitions between muted stone, aged brass, and botanical olive ground the interface, avoiding clinical sterile modernity in favor of layered residential warmth.

## Colors

The color architecture honors organic architectural materiality: lime wash, smoked charcoal, patinated bronze, and vegetative accents.

- **Primary (`#252824` - Charcoal):** A deep, warm carbon tone that replaces stark black. Anchors typography, high-contrast structural framing, and primary interactive elements.
- **Secondary (`#B69A68` - Muted Gold):** A balanced, brushed brass tone reserved for focal moments, refined active states, subtle borders, and delicate badge highlights. Never used for dense body text.
- **Tertiary (`#626B55` - Olive Green):** A grounded botanical hue connecting indoor luxury to outdoor landscape architecture. Utilized for contextual indicators, spatial tag filters, and secondary accents.
- **Neutral (`#F8F5EF` - Ivory):** The structural canvas background. A soft, warm off-white that mitigates digital glare and mimics premium textured paper or polished plaster.
- **Supporting Neutral (`#D8C8B4` - Warm Beige):** Deployed for subtle background layering, container panels, card backdrops, and muted separator rules.

## Typography

The typographic system pairs the classical editorial authority of **Playfair Display** with the neutral precision of **Inter**.

- **Editorial Headings:** Playfair Display introduces literary elegance. Headings must always maintain standard or loose leading to convey space, never clipped or crowded. Uppercase styling is reserved exclusively for small contextual labels, leaving main display titles in title or sentence case.
- **Architectural Body & Labels:** Inter provides functional clarity. Body copy utilizes light and regular weights (`300` and `400`) with generous line-heights to support effortless readability across case studies and material specifications.
- **Labels & Microcopy:** Rendered with tracked-out spacing (`letterSpacing: 0.08em - 0.12em`) and upper casing to mimic architectural scale drawings and premium interior placards.

## Layout & Spacing

The layout philosophy mirrors high-end architectural space planning: deliberate, proportional, and unhurried. 

- **Grid Architecture:** Employs a 12-column fluid grid system on desktop (max width: 1440px) with 32px (`2rem`) gutters and generous outer margins of 64px (`4rem`). 
- **Reflow & Breakpoints:**
  - **Desktop (1024px+):** 12 columns with asymmetrical portfolio splits (e.g., 7:5 and 8:4 column compositions).
  - **Tablet (768px – 1023px):** 8 columns, `margin-tablet` of 40px (`2.5rem`), transitioning layered project collages into orderly modular blocks.
  - **Mobile (< 768px):** 4 columns, `margin-mobile` of 24px (`1.5rem`), strictly stacking complex project spreads while preserving vertical white space (`space-lg` to `space-xl`) between editorial sections.
- **Spacing Principle:** Vertical distance should always feel generous. Use `space-xl` between thematic editorial blocks to permit imagery and project narratives room to breathe.

## Elevation & Depth

To reflect artisanal masonry and high-end residential interiors, this design system rejects heavy, artificial digital drop shadows in favor of **tonal layering** and **low-contrast architectural outlines**.

- **Surface Tiers:**
  - **Ground Floor (Base Canvas):** Ivory (`#F8F5EF`).
  - **Mezzanine (Containers & Cards):** Pure tint adjustments using Warm Beige (`#D8C8B4` at 20–35% opacity) or off-white scrims.
  - **Floating Overlays (Navigation, Drawers, Modals):** Translucent Ivory (`rgba(248, 245, 239, 0.92)`) paired with `backdrop-filter: blur(12px)`.
- **Architectural Outlines:** Boundaries are articulated with whisper-thin, 1px rules colored with Muted Gold (`#B69A68` at 30% opacity) or Charcoal (`#252824` at 10% opacity).
- **Ambient Depth:** When floating elements (such as material swatches or full-bleed project drawers) require separation, use an extra-diffused shadow tinted by charcoal:
  `box-shadow: 0 16px 40px -12px rgba(37, 40, 36, 0.08)`.

## Shapes

The shape vocabulary uses **Sharp (`0`)** architecture to reflect the structural discipline of interior walls, custom millwork, stone slabs, and metallic frames.

- **Primary Geometry:** Cards, interactive buttons, inputs, dialog containers, and imagery use strict `0px` corner radii. Crisp edges communicate deliberate craftsmanship and bespoke architectural detailing.
- **Selective Curvature:** Curves are strictly reserved for circular micro-elements, such as pagination dots, circular photo hotspots, or round material swatch previews.

## Components

### Buttons
- **Primary:** Background Charcoal (`#252824`), text Ivory (`#F8F5EF`), rectangular shape with no border radius. Padding: `14px 32px`. Text in `label-md` uppercase with `0.1em` letter spacing. On hover, background shifts seamlessly to Olive Green (`#626B55`).
- **Secondary (Editorial Outline):** Transparent background, 1px solid Charcoal (`#252824`), text Charcoal. On hover, background fills with Muted Gold (`#B69A68`) and border transitions to match.
- **Text Action:** Clean inline text with a thin, low-contrast 1px underline sitting 4px below baseline, animated on hover using a subtle horizontal sweep.

### Cards (Project & Spatial Showcase)
- Flat, non-elevated rectangular containers.
- Visual hierarchy prioritizes high-resolution architectural photography, framed with an optional 1px hairline border (`rgba(37, 40, 36, 0.1)`).
- Project details are positioned directly below or overlaid with a translucent warm beige gradient; metadata rendered in `label-sm` uppercase.

### Input Fields
- Underline-only or structural 1px bordered boxes using Warm Beige and Charcoal outlines.
- Background: completely transparent or light Ivory tint.
- Focus state: border activates to Muted Gold (`#B69A68`) without thick focus halos. Placeholder text is styled in `body-md` Charcoal at 40% opacity.

### Chips & Filter Tags
- Architectural material badges and room categorizations (e.g., "Living Sanctuary", "Bespoke Millwork").
- Border: 1px hairline in Charcoal at 20% opacity. Background: transparent.
- Active state: background filled with Olive Green (`#626B55`) or Muted Gold (`#B69A68`), text inverted to Ivory. Sharp 0px corners.

### Checkboxes & Radio Controls
- Square elements with 1px border in Charcoal. Checked state reveals an inner geometric Charcoal block or an understated Muted Gold checkmark without decorative animations.

### Lists & Specifications
- Divided by horizontal 1px hairline rules in Warm Beige (`#D8C8B4`). Generous padding (`space-md` top and bottom).
- Item headers in Playfair Display (`headline-sm`) accompanied by specifications and dimensions aligned in Inter (`body-sm`).

### Bespoke Domain Components
- **Material Moodboard Matrix:** A specialized responsive grid component displaying layered swatches of stones, woods, brass finishes, and fabrics with integrated tactile zoom capabilities.
- **Architectural Floor Plan Hotspot Viewer:** High-contrast cad-line presentation layer containing delicate circular indicator pins that open project detail sheets.
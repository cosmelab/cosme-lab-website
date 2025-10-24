# Lab Schedule - Future Ideas & Improvements

**Date:** October 23, 2025

## Future Feature: Monthly/Quarterly Lab Awards (Post Lab Log Portal)

Once the lab log portal is deployed and tracking task data:

### Badge Ideas:
- 🔬 **Lab Regular** - Consistent attendance
- 📊 **Data Wizard** - Lots of analysis work
- 🦟 **Mosquito Wrangler** - Colony maintenance hero
- 🧬 **DNA Detective** - Extractions and PCR
- 📸 **Documentation Star** - Best file uploads/notes
- 🧹 **Lab Custodian** - Maintenance tasks
- 🤝 **Team Player** - Helps multiple projects
- 🌟 **Rising Star** - Most improved
- 📚 **Knowledge Seeker** - Training sessions attended
- ⚡ **Speed Demon** - Efficient task completion

### Implementation:
- Analyze daily lab log data monthly or quarterly
- Award badges based on actual work patterns, not just hours
- Everyone can earn multiple badges
- Focus on different contributions (not competitive)
- Display on team page or dashboard
- Celebrate diverse contributions

**Status:** Future enhancement after lab log analytics are built

---

## Current Design Issues to Address

### Problem 1: Competitive Damage Meter Feel
**Current:** Ranked bars by hour count feels like competition
**User Concern:** "might make undergraduates feeling like they need to compete with others"

### Problem 2: Color Overload in Week View
**Current:** Pastel colors in dark theme don't look good when viewing entire week
**Possible Causes:**
- Too many bright colors fighting for attention
- Animation/shimmer effects too intense
- Contrast issues with dark background
- Visual noise from many colored pills

---

## Design Direction (Option 6 Hybrid)

### Keep These Features:
✅ Click to see detailed schedule
✅ Google Calendar invite download
✅ Highlight selected student's cells
✅ Fade others when one selected
✅ Color-coded students (rainbow randomize)
✅ Student name pills in schedule cells

### Remove/Change:
❌ Remove ranked ordering (alphabetical instead)
❌ Remove percentage bars entirely OR make all same length
❌ Remove hour/slot counts from display
❌ Remove "damage meter" aesthetic

### New Ideas to Explore:

#### Idea A: "Floating Bubbles"
- Remove bar section entirely
- Just show floating colored circles with names
- Like molecular structure or constellation
- Click bubble → calendar highlights → invite appears
- More whimsical, less competitive

#### Idea B: "Equal Bars, No Numbers"
- Keep bar structure
- All bars same length (100%)
- Alphabetical order
- Show name + color only
- No hours/slots displayed
- Click for details

#### Idea C: "Avatar Grid"
- Grid of colored circles (like Zoom gallery)
- Each person = circle with initials
- Hover = full name
- Click = schedule + invite
- Equal visual weight

---

## Visual Issues to Fix

### Issue: Colors Don't Look Good in Week View

**Possible Solutions:**

1. **Tone Down Saturation**
   - Reduce opacity of pill backgrounds
   - Make colors more muted/pastel
   - Less bright against dark theme

2. **Simplify Animations**
   - Remove shimmer effects
   - Reduce or remove hover glows
   - Simpler transitions

3. **Make Pills Thinner/Smaller**
   - Reduce padding inside pills
   - Smaller font size
   - More compact cells
   - Less visual weight

4. **Alternative Pill Styles**
   - Outlined pills instead of filled
   - Dots or indicators instead of full pills
   - Minimize color area

5. **Reduce Visual Noise**
   - Limit colors shown at once
   - Gray out when not hovered
   - Only show colors on hover
   - Simplify grid borders

---

## Next Steps (To Discuss)

1. **Choose stats panel design:**
   - Option A: Floating bubbles (fun, non-hierarchical)
   - Option B: Equal bars alphabetical (clean, simple)
   - Option C: Avatar grid (modern, equal)

2. **Fix color overload:**
   - Test: Reduce pill opacity/saturation
   - Test: Remove animations
   - Test: Outlined pills instead of filled
   - Test: Thinner, more compact pills

3. **Prototype ideas:**
   - Mock up floating bubbles
   - Try outlined pills in grid
   - Experiment with muted colors

---

## Technical Notes

**Files to modify:**
- `lab-schedule.html` - Structure changes
- `lab-schedule.css` - Visual styling
- `lab-schedule.js` - Stats panel logic

**Functions to update:**
- `buildStudentStats()` - Change from bars to bubbles/grid
- Keep `selectStudent()` - Click highlighting (works great)
- Keep `downloadCalendar()` - Google invite (keep this!)
- Possibly update pill styling in grid

---

**Status:** Brainstorming phase - awaiting design direction

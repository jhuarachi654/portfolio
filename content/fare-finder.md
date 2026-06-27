# Page: fare-finder

<!-- section: Logo -->

Johanna Huarachi


<!-- section: Highlight -->

Home

Works

About

Play

Draw

Contact


<!-- section: Social links -->

Multidisciplinary Designer & Builder bringing delight and a humanities perspective to every product.

Design Prev. @ PROS & DNC


<!-- section: Variant 5 -->

Resume


<!-- section: Title wrapper -->

# PROS Fare Finder Map

Designed and shipped a flight map tool for travelers to explore and to be informed in order to book their next trip.


<!-- section: Detail -->

Role

UX Design Intern

Duration

Jun – Sep 2025

TEAM


<!-- section: Tag wrapper -->

UX Strategist,

UX Researcher

PM


<!-- section: Detail -->

TOOLS


<!-- section: Tag wrapper -->

Figma

Claude

Figma Make


<!-- section: Title wrapper -->

- Introduction
### Fare Finder Map at PROS

This past summer, I interned at PROS, a B2B software company providing digital products for airlines and the travelers they serve. One of the projects I worked on was Fare Finder Map, an interactive flight map-based tool that showcases flight fares.

A Junior Designer and I co-led the redesign of the Fare Finder Map to better support free exploration and provide personalized recommendations for everyday travelers.

Precedent Fare Finder

### Friction in flight discovery = fewer bookings

Flight discovery is the first touchpoint travelers have when planning a trip. Across flight exploration platforms, personalized results and travel-related support have become standard.

When the direct booking experience on an airline's site falls short of that, travelers go elsewhere and airlines lose those direct bookings.

Booking solutions on the market


<!-- section: Default -->

challenge

### How might we redesign the Fare Finder Map to make flight exploration more supported and personalized?


<!-- section: Title wrapper -->

- Solution Preview
### A new way to discover your next flight destination

Fare Finder is an map-based exploration tool with an interface that is customizable, personalized, and intuitive.

- Research
### Who I Was Designing For

To start, I met with the PMs working directly with our airline partners and the User Researcher who knew our end users, the travelers. Those conversations revealed what made Fare Finder unique: it served two distinct users at once, enterprise and consumer, each with their own goals that I had to balance.

Product Ecosystem


<!-- section: Project summary -->

Enterprise User


<!-- section: Description -->

Jordan Taylor


<!-- section: Project summary -->

Dallas, Texas

Director of Digital Strategy

Goals:

Increase direct bookings

Present a delightful experience to travelers

Needs:

A reliable tool that reflects well on their brand

Seamless integration into existing website

Support travelers with smooth booking exp


<!-- section: Title wrapper -->

The airline that embeds Fare Finder on their site to serve their travelers.


<!-- section: Project summary -->

Consumer User


<!-- section: Description -->

Casey Smith


<!-- section: Project summary -->

Chicago, Illinois

Travels for work and leisure

Explore flights while feeling informed

Book seamlessly from the map without confusion

A clear, intuitive map interface

Information that helps them make decisions

A smooth path from exploration to booking


<!-- section: Title wrapper -->

The person using Fare Finder to explore and book flights.

### Synthesis + AI integration

Before I joined the project, usability testing had just concluded. I jumped into the analysis working 1-1 with the User Researcher, trying out FigJam's AI tools for part of the affinity mapping.

It was a good starting foundation but needed detailed review, which took additional time. Looking back, this has shown me to consider this trade-off for future potential uses.

FigJam AI use in Affinity Mapping

Affinity Mapping - Before (AI results) and After Sorting

### Friction Points in the Booking Experience

These main findings came from the affinity mapping exercise, pointing to where travelers were experiencing friction and what they wanted from the experience.


<!-- section: Default -->

## 40%


<!-- section: Detail -->

wanted smarter destination recommendations based on their preferences


<!-- section: Default -->

## 60%


<!-- section: Detail -->

had trouble navigating or orienting themselves on the map

requested country labels and borders to distinguish destinations


<!-- section: Title wrapper -->

This raised a few questions for the redesign: how do we balance navigation improvements with new feature requests? What is feasible and what takes priority? Why?


<!-- section: Default -->

challenge (Revised)

### How might we redesign the Fare Finder Map to make flight exploration more intuitive, personalized, and informative?


<!-- section: Title wrapper -->

### Booking Features Across the Market

To answer these questions, I looked at how competitors and adjacent platforms like hotels and vacation rentals were already solving this. Booking experiences with maps aren't new.

These features shared a common goal: helping travelers explore their options intuitively and book with as little effort as possible, all while keeping them informed.

Relevant features across the booking market

### The Potential of Fare Finder

I mapped what I found in a competitive analysis and 2x2 to understand where Fare Finder fit into the landscape and where the opportunity was.

PROS reaches more travelers than any platform here because it lives directly on the airline's site. Making it more personal and intuitive is a huge opportunity that could directly drive more bookings on airline sites.

Fare Finder has the opportunity to integrate these features into the direct booking experience

- Development
### Outlining User Flows

I created a user flow for Fare Finder from the perspective of somebody wanting to book a flight, choose a map view, and apply filters. The mapped out user flow revealed a key inconsistency: personalized destinations were only available in the minimized view.

Expanding to the full map meant losing them entirely, limiting personalization at the moment when travelers were most actively exploring.

User flow revealed a key inconsistency in the booking experience

### Global Audience = Global Constraints

Fare Finder would be featured on global airline sites, so standardizing the map across regions was essential.

Travelers requested border lines and country labels for orientation, so I brought a mockup to my PM and UX Engineer. Although feasible technically, standardizing borders for a global audience wasn't possible due to differing perceptions of regions and territories.

This pushed me to think: if border lines and labels weren't an option, how else could the design orient travelers without relying on them?

Scrapped mockup exploring border lines and country labels for user orientation.

Wireframe exploration

### Destinations

What if tailored destinations could be accessed at all times?

- Minimized Card Layout contains: Origin/Destination and Price
- Expanded Card Layout contains: Origin/Destination, Price, and Visual
### Entry Point

How might the entry point support users who don't yet have a destination in mind?

New Default Starting Screen

### Narrowing Layout w/ External Testing

After testing with airline partners, the Entry Point was validated. However, there were requests for more travel-centered visual options beyond the map background image.

The Destinations layout concepts were scrapped entirely. The final design chosen gives travelers control over what they see on the screen. Personalized destinations, flight card details, and filters are all elements they can customize throughout the booking experience.

Validated Entry Point and Destination Layout

AI & Design

### Flexible Dates

How might we help travelers who don't have a destination in mind yet open up their options by exploring flights with flexible availability?

- Flexible Dates Layouts
- Prompt for Flexible Dates on Claude
- Claude Generated Layouts
### Flight Fare Card

How might we give travelers the destination context they need to feel confident enough to book directly from the map?

- Flight Card Layout Iterations
- Prompt for Quick Facts on Figma Make
- Figma Make Generated Cards
- Solution
- Focused Entry
The entry point for Fare Finder was redefined. We wanted travelers to have a clear and focused starting point, so the destination is set to Anywhere by default to encourage exploration from the start.

- Customized Map Layout
Both the filter and personalized destinations can be collapsed, expanding the map and shifting focus to flight discovery.

- Flexible Dates
We wanted to remove another barrier to exploration. Flexible Dates lets travelers search by trip duration and travel month instead of committing to specific dates, reducing the pressure to have everything figured out before users start exploring.

Flexible Dates Component

- Filter Panel
The filter panel expands on the original filters by adding Travel Interests. Instead of starting with a destination, travelers can explore by what they want to experience.

The panel can also be shown or hidden, giving travelers control over what they see on the map.

Collapsable Filter Panel w/ Travel Interests embedded into Fare Finder

- Flight Fare Card + Quick Facts
For travelers who are still exploring, the right context at the right moment is what moves them from browsing to booking. The redesigned fare card and Quick Facts bring that directly into the map.

When a traveler selects a flight, the fare card shows destination photos, price, and trip type. Quick Facts fill in the supporting details like cheapest month to fly, average price, time zones, and nearby airports. All without leaving the map, right when it matters most.

Expanded flight card and quick facts panel

- Tailored Flight Recommendations
Personalized destination recommendations were missing from the original map view. Now they live in a collapsible panel at the bottom of the screen, giving travelers tailored suggestions based on their origin.

This keeps the map open and uninterrupted while still giving travelers a starting point to begin their search or a set of options to compare when they are ready.

Personalized Destinations dependent on Origin Input

### How Fare Finder changed the booking experience

By the time these features were defined and validated by airline partners, my internship ended before usability testing could be completed.

Looking back, if I had more time, the one thing I would have done differently was request and plan for more end consumer testing with the PM and User Researcher. Although our direct users were airline partners, Fare Finder ultimately reaches travelers and their input would have been valuable.

The new Fare Finder shipped in January 2026. The following is the impact it had and direct feedback from our airline partners:


<!-- section: Detail -->

after handoff, Fare Finder went live

decrease in map abandonment

increase in direct bookings

"This is a direction that gives travelers the necessary context and control of their own experience."


<!-- section: Default -->

Airline Partner (name withheld per NDA)


<!-- section: Detail -->

"This redefines the experience to be much more exploratory with fewer barriers for entry and support tools."


<!-- section: Title wrapper -->

- Reflection
### What I'd carry forward from a summer of designing for exploration

Interning at PROS put me in situations I hadn't navigated before. Designing inside a live product used by airlines, working within a B2B2C model for the first time, and learning to balance the distinct needs of airline partners and travelers. That discomfort pushed me to be a more holistic and adaptable designer.

I also got the chance to use tools like Figma Make and Claude to build out design layouts quickly prompting moments of discussion and revisions. Presenting those layouts to PMs, Engineers, and Designers also taught me to tailor my visuals and storytelling to the audience.

I'm so grateful to the PROS UX design team for their mentorship, the conversations that shaped my thinking, and for a memorable summer!

PROS UX Design team


<!-- section: Highlight -->

Email

LinkedIn


<!-- section: Copyright -->

Made with Iced Hojichas, genuine thought, and delight

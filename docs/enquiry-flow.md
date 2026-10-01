# Enquiry screen map

The active Figma flow maps to one state-driven route:

1. **Services** (`214:2`, `214:23`) — Brand identity, Website and Custom software are multi-select choices. Help me decide is mutually exclusive. A valid package query skips this chooser with its matching service selected.
2. **Project & Scope** — Brand (`215:2`), Website (`215:44`), Software (`219:23`), Help (`219:65`), combined (`219:107`), pair combinations (`287:*`) and all seven selected-service examples (`261:*`) share a common goal, budget and timing, plus only the relevant service questions.
3. **Contact & Review** — service-specific and combined summaries (`219:157`–`219:382`) show real answers and provide an Edit project details action. Name and email are required; company is optional.

Package selection (`289:19`, `289:51`) uses Starter Site, Business Pro, Custom Software or Combine services. Existing package records provide names, prices and scope.

Validation, sending and failure frames are `303:746`–`303:915`. Confirmation is `136:2`/`144:23`, and may appear only after a real successful backend response. Development preview states are available through `?preview=validation`, `sending`, `failure` or `confirmation` in development.

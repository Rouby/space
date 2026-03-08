# Component Inventory - Frontend

## Overview
Frontend components are primarily organized under `src/components` and `src/features`.

## Shared Components
- `components/DetailsDrawer/DetailsDrawer.tsx`
- `components/DetailsModal/DetailsModal.tsx`
- `components/LinkButton/LinkButton.tsx`

## Feature Components
- Auth/User: `SignIn`, `SignInForm`, `SignUpForm`, `UserButton`
- Gameplay core: `GalaxyView`, `StarSystemDetails`, `TaskForce`, `DilemmaChoice`, `DilemmasList`
- Session/game setup: `CreateGame`, `GameLobby`, `ShipDesigns`, `TurnReportsPanel`
- Marketing/dashboard: `Landing/*`, `Header/*`

## Routing and Views
- Route definitions under `src/routes` include authenticated game flows and dashboard pages.

## Notes
Generated in quick-scan mode using file and folder patterns. Deep scan is needed for props/API surface details and true reusability mapping.

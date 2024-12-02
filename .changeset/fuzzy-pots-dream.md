---
'@winrlabs/web3-games': patch
'@winrlabs/games': patch
'@winrlabs/ui': patch
'web': patch
---

(page.tsx): Add support for displaying a custom card back image in the Video Poker game page
(card.tsx, theme.tsx): Update theme configuration to include a custom card back image for the Video Poker game scene and provider
(page.tsx): Introduce new theme options for SingleBlackjackGame component to customize card appearance
(index.ts): Add export for SingleBlackjackThemeProvider from theme provider to allow theme customization in SingleBlackjackTemplate
(theme.tsx): Add a new theme provider for Single Blackjack game to manage theme settings
(constants.tsx): Update game labels and URLs for Single Blackjack and other games in the sidebar to match the new structure and naming conventions
(card.tsx): Fix syntax error in the class name of a div element
(card.tsx): Fix syntax error in the style attribute of a div element

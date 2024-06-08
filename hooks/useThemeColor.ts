export const LightTheme = {
  dark: false,
  colors: {
    text: '#1a3a4b',
    background: '#f3eff4',
    tint: '#1a3a4b',
    primary: '#57a9cb',
    secondary: '#dd6a4b',
    error: '#e95949',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
    card: 'rgb(255, 255, 255)',
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary99` used as background
      level1: 'rgb(247, 243, 249)', // palette.primary40, alpha 0.05
      level2: 'rgb(243, 237, 246)', // palette.primary40, alpha 0.08
      level3: 'rgb(238, 232, 244)', // palette.primary40, alpha 0.11
      level4: 'rgb(236, 230, 243)', // palette.primary40, alpha 0.12
      level5: 'rgb(233, 227, 241)', // palette.primary40, alpha 0.14
    },
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    text: '#fcfcfa',
    background: '#28292a', //black
    tint: '#fcfcfa', //white
    primary: '#57a9cb', //light blue
    secondary: '#dd6a4b', //orange
    error: '#e95949', //red
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
    card: 'rgb(18, 18, 18)',

    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary80` used as background
      level1: 'rgb(37, 35, 42)', // palette.primary80, alpha 0.05
      level2: 'rgb(44, 40, 49)', // palette.primary80, alpha 0.08
      level3: 'rgb(49, 44, 56)', // palette.primary80, alpha 0.11
      level4: 'rgb(51, 46, 58)', // palette.primary80, alpha 0.12
      level5: 'rgb(52, 49, 63)', // palette.primary80, alpha 0.14
    },
  },
};

export const Colors = {
  light: {
    text: '#1a3a4b',
    background: '#f3eff4',
    tint: '#1a3a4b',
    primary: '#57a9cb',
    secondary: '#dd6a4b',
    error: '#e95949',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
    card: 'rgb(255, 255, 255)',
  },
  dark: {
    text: '#fcfcfa',
    background: '#28292a', //black
    tint: '#fcfcfa', //white
    primary: '#57a9cb', //light blue
    secondary: '#dd6a4b', //orange
    error: '#e95949', //red
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
    card: 'rgb(18, 18, 18)',
  },
};

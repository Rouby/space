declare module 'webpack-format-messages' {
  function formatMessages(
    stats: webbpack.Stats,
  ): { errors: any[]; warnings: any[] };
  export = formatMessages;
}

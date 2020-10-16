import * as React from 'react';

export class GraphQLError extends Error {
  constructor(
    message: string,
    public errors: { message?: string; errcode?: string; detail?: string }[],
  ) {
    super(message);
  }

  get messageJSX() {
    return this.errors.map((err) => (
      <div key={err.detail ?? err.message}>
        {err.errcode
          ? `${err.errcode}: ${err.detail ?? err.message}`
          : err.message}
      </div>
    ));
  }
}

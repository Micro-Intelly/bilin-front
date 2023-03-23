// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'http://localhost:8000',
  apiEndpoints: {
    series: {
      index: '/api/series',
      show: '/api/series/{:id}'
    },
    posts: {
      index: '/api/posts',
      show: '/api/posts/{:id}'
    },
    tests: {
      index: '/api/tests',
      show: '/api/tests/{:id}'
    },
    files: {
      show: '/api/files/{:id}'
    },
    episodes: {
      stream: '/api/stream/{:id}'
    },
    comments: {
      index: '/api/comments/{:id}'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

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
      show: '/api/posts/{:id}',
      create: '/api/posts',
      update: '/api/posts/{:id}',
      delete: '/api/posts/{:id}'
    },
    tests: {
      index: '/api/tests',
      show: '/api/tests/{:id}',
      create: '/api/tests',
      update: '/api/tests/{:id}',
      updateQuestions: '/api/tests/{:id}/questions',
      postAnswer: '/api/tests/{:id}/answers',
      delete: '/api/tests/{:id}',
      showResultAverage: '/api/tests/{:id}/results'
    },
    questions: {
      index: '/api/tests/{:id}/questions'
    },
    files: {
      show: '/api/files/{:id}'
    },
    episodes: {
      stream: '/api/stream/{:id}'
    },
    comments: {
      index: '/api/comments/{:id}',
      delete: '/api/comments/{:id}',
      update: '/api/comments/{:id}',
      fileUpload: '/api/comment/image/upload',
      postComment: '/api/comments/comment',
      postNote: '/api/comments/note',
    },
    user: {
      update: '/api/user/{:id}',
      updateThumbnail: '/api/user/{:id}/thumbnail',
      delete: '/api/user/{:id}',
      seriesIndex: '/api/user/{:id}/series',
      orgIndex: '/api/user/{:id}/organizations',
      postsIndex: '/api/user/{:id}/posts',
      testsIndex: '/api/user/{:id}/tests',
      commentsIndex: '/api/user/{:id}/comments',
      getLimits: '/api/user/limits',
      history: {
        episodesIndex: '/api/user/{:id}/histories/episodes',
        postsIndex: '/api/user/{:id}/histories/posts',
        testsIndex: '/api/user/{:id}/histories/tests'
      }
    },

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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'http://localhost:8000',
  logo: '/storage/image/application/logo/8a21ac2044494159bd0db18c06482bfa.png',
  apiEndpoints: {
    series: {
      index: '/api/series',
      show: '/api/series/{:id}',
      create: '/api/series',
      update: '/api/series/{:id}',
      delete: '/api/series/{:id}',
      updateThumbnail: '/api/series/{:id}/thumbnail',
      file: {
        create: '/api/series/{:idSerie}/files',
        delete: '/api/series/{:idSerie}/files/{:idFile}',
        cancelUpload: '/api/file/cancel/{uniqueId}',
        deleteUpload: '/api/file/delete'
      },
      note: {
        create: '/api/series/{:idSerie}/notes',
        update: '/api/series/{:idSerie}/notes/{:idNote}',
        delete: '/api/series/{:idSerie}/notes/{:idNote}',
      },
      sections: {
        create: '/api/series/{:idSerie}/sections',
        update: '/api/series/{:idSerie}/sections/{:idSection}',
        delete: '/api/series/{:idSerie}/sections/{:idSection}',

        episodes: {
          create: '/api/series/{:idSerie}/sections/{:idSection}/episodes',
          update: '/api/series/{:idSerie}/sections/{:idSection}/episodes/{:idEpisode}',
          delete: '/api/series/{:idSerie}/sections/{:idSection}/episodes/{:idEpisode}',
        }
      }
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
      index: '/api/user',
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
    organization: {
      user: {
        index: '/api/organization/{:id}/users',
        create: '/api/organization/{:id}/users',
        delete: '/api/organization/{:id}/users/{:idU}'
      }
    },
    history: {
      create: '/api/histories'
    }
  },
  constants: {
    role: {
      organization: 'Organization',
      admin: 'Admin',
      manager: 'Manager',
      student: 'Student',
      teacher: 'Teacher'
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

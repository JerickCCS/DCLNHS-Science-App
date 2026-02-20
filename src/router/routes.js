const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: 'chapter-one', component: () => import('pages/chapter-1/Chapter-1.vue'), name: 'chapter-one' },
      { path: 'lesson-test', component: () => import('pages/LessonPage.vue'), name: 'lesson-test' },
      { path: 'login-page', component: () => import('pages/LoginPage.vue'), name: 'login-page' },
      { path: 'bookmark-page', component: () => import('pages/BookMark.vue'), name: 'bookmark-page' },
      { path: 'quiz-stats', component: () => import('pages/QuizStats.vue'), name: 'quiz-stats' },
      //Unit Chapters
      { path: 'unit-1', component: () => import('pages/list-of-units/UnitOne.vue'), name: 'unit-1' },
      { path: 'unit-2', component: () => import('pages/list-of-units/UnitTwo.vue'), name: 'unit-2' },
      { path: 'unit-3', component: () => import('pages/list-of-units/UnitThree.vue'), name: 'unit-3' },
      { path: 'unit-4', component: () => import('pages/list-of-units/UnitFour.vue'), name: 'unit-4' },

      //Chapter 1
      { path: 'unit-1-chapter-1-lesson-1', component: () => import('pages/chapter-1/LessonOne.vue'), name: 'unit-1-chapter-1-lesson-1' },
      //Tests
      { path: 'mini-test-1-1', component: () => import('pages/chapter-1/MiniTest1-1.vue'), name: 'mini-test-1-1' },
      { path: 'mini-test-1-2', component: () => import('pages/chapter-1/MiniTest1-2.vue'), name: 'mini-test-1-2' },
      { path: 'mini-lab-1-1', component: () => import('pages/chapter-1/MiniLab1-1.vue'), name: 'mini-lab-1-1' },
      { path: 'mini-test-1-3', component: () => import('pages/chapter-1/MiniTest1-3.vue'), name: 'mini-test-1-3' },
      { path: 'unit-1-chapter-1-lesson-2', component: () => import('pages/chapter-1/LessonTwo.vue'), name: 'unit-1-chapter-1-lesson-2' },
      { path: 'unit-1-chapter-1-lesson-3', component: () => import('pages/chapter-1/LessonThree.vue'), name: 'unit-1-chapter-1-lesson-3' },
      { path: 'unit-1-chapter-1-lesson-4', component: () => import('pages/chapter-1/LessonFour.vue'), name: 'unit-1-chapter-1-lesson-4' },
      { path: 'chapter-1', component: () => import('pages/chapter-1/Chapter-1.vue'), name: 'chapter-1' },
      { path: 'chapter-1-technology', component: () => import('pages/chapter-1/TechnologyFocus.vue'), name: 'chapter-1-technology' },
      { path: 'chapter-1-review', component: () => import('pages/chapter-1/ChapterReview.vue'), name: 'chapter-1-review' },
      { path: 'chapter-1-activity', component: () => import('pages/chapter-1/Activity-1.vue'), name: 'chapter-1-activity' },
      { path: 'chapter-1-test', component: () => import('pages/chapter-1/ChapterTest.vue'), name: 'chapter-1-test' },

      //Chapter 2
      { path: 'chapter-2', component: () => import('pages/chapter-2/Chapter-2.vue'), name: 'chapter-2' },
      { path: 'mini-lab-2-1', component: () => import('pages/chapter-2/MiniLab2-1.vue'), name: 'mini-lab-2-1' },
      { path: 'mini-lab-2-2', component: () => import('pages/chapter-2/MiniLab2-2.vue'), name: 'mini-lab-2-2' },
      { path: 'mini-test-2-3', component: () => import('pages/chapter-2/MiniTest2-3.vue'), name: 'mini-test-2-3' },
      { path: 'mini-test-2-4', component: () => import('pages/chapter-2/MiniTest2-4.vue'), name: 'mini-test-2-4' },
      { path: 'unit-1-chapter-2-lesson-1', component: () => import('pages/chapter-2/LessonOne.vue'), name: 'unit-1-chapter-2-lesson-1' },
      { path: 'unit-1-chapter-2-lesson-2', component: () => import('pages/chapter-2/LessonTwo.vue'), name: 'unit-1-chapter-2-lesson-2' },
      { path: 'chapter-2-technology', component: () => import('pages/chapter-2/TechnologyFocus.vue'), name: 'chapter-2-technology' },
      { path: 'chapter-2-review', component: () => import('pages/chapter-2/ChapterReview.vue'), name: 'chapter-2-review' },
      { path: 'chapter-2-activity', component: () => import('pages/chapter-2/Activity-2.vue'), name: 'chapter-2-activity' },
      { path: 'chapter-2-test', component: () => import('pages/chapter-2/ChapterTest.vue'), name: 'chapter-2-test' },
      { path: 'chapter-2-stem', component: () => import('pages/chapter-2/StemChallenge.vue'), name: 'chapter-2-stem' },

      //Chapter 3
      { path: 'chapter-3', component: () => import('pages/chapter-3/Chapter-3.vue'), name: 'chapter-3' },
      { path: 'mini-test-3-1', component: () => import('pages/chapter-3/MiniTest3-1.vue'), name: 'mini-test-3-1' },
      { path: 'mini-test-3-2', component: () => import('pages/chapter-3/MiniTest3-2.vue'), name: 'mini-test-3-2' },
      { path: 'mini-lab-3-1', component: () => import('pages/chapter-3/MiniLab3-1.vue'), name: 'mini-lab-3-1' },
      { path: 'mini-lab-3-2', component: () => import('pages/chapter-3/MiniLab3-2.vue'), name: 'mini-lab-3-2' },
      { path: 'mini-lab-3-3', component: () => import('pages/chapter-3/MiniLab3-3.vue'), name: 'mini-lab-3-3' },
      { path: 'unit-1-chapter-3-lesson-1', component: () => import('pages/chapter-3/LessonOne.vue'), name: 'unit-1-chapter-3-lesson-1' },
      { path: 'unit-1-chapter-3-lesson-2', component: () => import('pages/chapter-3/LessonTwo.vue'), name: 'unit-1-chapter-3-lesson-2' },
      { path: 'unit-1-chapter-3-lesson-3', component: () => import('pages/chapter-3/LessonThree.vue'), name: 'unit-1-chapter-3-lesson-3' },
      { path: 'unit-1-chapter-3-lesson-4', component: () => import('pages/chapter-3/LessonFour.vue'), name: 'unit-1-chapter-3-lesson-4' },
      { path: 'unit-1-chapter-3-lesson-5', component: () => import('pages/chapter-3/LessonFive.vue'), name: 'unit-1-chapter-3-lesson-5' },
      { path: 'chapter-3-technology', component: () => import('pages/chapter-3/TechnologyFocus.vue'), name: 'chapter-3-technology' },
      { path: 'chapter-3-review', component: () => import('pages/chapter-3/ChapterReview.vue'), name: 'chapter-3-review' },
      { path: 'chapter-3-activity-3', component: () => import('pages/chapter-3/Activity-3.vue'), name: 'chapter-3-activity-3' },
      { path: 'chapter-3-activity-4', component: () => import('pages/chapter-3/Activity-4.vue'), name: 'chapter-3-activity-4' },
      { path: 'chapter-3-activity-5', component: () => import('pages/chapter-3/Activity-5.vue'), name: 'chapter-3-activity-5' },
      { path: 'chapter-3-test', component: () => import('pages/chapter-3/ChapterTest.vue'), name: 'chapter-3-test' },
      { path: 'chapter-3-stem', component: () => import('pages/chapter-3/StemChallenge.vue'), name: 'chapter-3-stem' },

      //Unit 2

      //Chapter 4
      { path: 'chapter-4', component: () => import('pages/chapter-4/Chapter-4.vue'), name: 'chapter-4' },
      { path: 'mini-lab-4-1', component: () => import('pages/chapter-4/MiniLab4-1.vue'), name: 'mini-lab-4-1' },
      { path: 'mini-test-4-2', component: () => import('pages/chapter-4/MiniTest4-2.vue'), name: 'mini-test-4-2' },
      { path: 'unit-2-chapter-4-lesson-1', component: () => import('pages/chapter-4/LessonOne.vue'), name: 'unit-2-chapter-4-lesson-1' },
      { path: 'unit-2-chapter-4-lesson-2', component: () => import('pages/chapter-4/LessonTwo.vue'), name: 'unit-2-chapter-4-lesson-2' },
      { path: 'unit-2-chapter-4-technology', component: () => import('pages/chapter-4/TechnologyFocus.vue'), name: 'chapter-4-technology' },
      { path: 'unit-2-chapter-4-review', component: () => import('pages/chapter-4/ChapterReview.vue'), name: 'unit-2-chapter-4-review' },
      { path: 'unit-2-chapter-4-activity-6', component: () => import('pages/chapter-4/Activity-6.vue'), name: 'chapter-4-activity-6' },
      { path: 'unit-2-chapter-4-activity-7', component: () => import('pages/chapter-4/Activity-7.vue'), name: 'chapter-4-activity-7' },
      { path: 'unit-2-chapter-4-test', component: () => import('pages/chapter-4/ChapterTest.vue'), name: 'unit-2-chapter-4-test' },
      { path: 'unit-2-chapter-4-stem-challenge', component: () => import('pages/chapter-4/StemChallenge.vue'), name: 'unit-2-chapter-4-stem-challenge' },

      //Chapter 5
      { path: 'chapter-5', component: () => import('pages/chapter-5/Chapter-5.vue'), name: 'chapter-5' },
      { path: 'mini-test-5-1', component: () => import('pages/chapter-5/MiniTest5-1.vue'), name: 'mini-test-5-1' },
      { path: 'unit-2-chapter-5-lesson-1', component: () => import('pages/chapter-5/LessonOne.vue'), name: 'unit-2-chapter-5-lesson-1' },
      { path: 'unit-2-chapter-5-lesson-2', component: () => import('pages/chapter-5/LessonTwo.vue'), name: 'unit-2-chapter-5-lesson-2' },
      { path: 'chapter-5-technology', component: () => import('pages/chapter-5/TechnologyFocus.vue'), name: 'chapter-5-technology' },
      { path: 'chapter-5-review', component: () => import('pages/chapter-5/ChapterReview.vue'), name: 'chapter-5-review' },
      { path: 'chapter-5-activity-8', component: () => import('pages/chapter-5/Activity-8.vue'), name: 'chapter-5-activity-8' },
      { path: 'chapter-5-activity-9', component: () => import('pages/chapter-5/Activity-9.vue'), name: 'chapter-5-activity-9' },
      { path: 'chapter-5-test', component: () => import('pages/chapter-5/ChapterTest.vue'), name: 'chapter-5-test' },

      //Chapter 6
      { path: 'chapter-6', component: () => import('pages/chapter-6/Chapter-6.vue'), name: 'chapter-6' },
      { path: 'unit-2-chapter-6-lesson-1', component: () => import('pages/chapter-6/LessonOne.vue'), name: 'unit-2-chapter-6-lesson-1' },
      { path: 'unit-2-chapter-6-lesson-2', component: () => import('pages/chapter-6/LessonTwo.vue'), name: 'unit-2-chapter-6-lesson-2' },
      { path: 'chapter-6-technology', component: () => import('pages/chapter-6/TechnologyFocus.vue'), name: 'chapter-6-technology' },
      { path: 'chapter-6-review', component: () => import('pages/chapter-6/ChapterReview.vue'), name: 'chapter-6-review' },
      { path: 'chapter-6-activity-10', component: () => import('pages/chapter-6/Activity-10.vue'), name: 'chapter-6-activity-10' },
      { path: 'chapter-6-test', component: () => import('pages/chapter-6/ChapterTest.vue'), name: 'chapter-6-test' },
      { path: 'chapter-6-stem-challenge', component: () => import('pages/chapter-6/StemChallenge.vue'), name: 'chapter-6-stem-challenge' },

      //Unite 3

      //Chapter 7
      { path: 'chapter-7', component: () => import('pages/chapter-7/Chapter-7.vue'), name: 'chapter-7' },
      { path: 'unit-3-chapter-7-lesson-1', component: () => import('pages/chapter-7/LessonOne.vue'), name: 'unit-3-chapter-7-lesson-1' },
      { path: 'unit-3-chapter-7-lesson-2', component: () => import('pages/chapter-7/LessonTwo.vue'), name: 'unit-3-chapter-7-lesson-2' },
      { path: 'chapter-7-technology', component: () => import('pages/chapter-7/TechnologyFocus.vue'), name: 'chapter-7-technology' },
      { path: 'chapter-7-review', component: () => import('pages/chapter-7/ChapterReview.vue'), name: 'chapter-7-review' },
      { path: 'chapter-7-activity-11', component: () => import('pages/chapter-7/Activity-11.vue'), name: 'chapter-7-activity-11' },
      { path: 'chapter-7-test', component: () => import('pages/chapter-7/ChapterTest.vue'), name: 'chapter-7-test' },

      //Chapter 8
      { path: 'chapter-8', component: () => import('pages/chapter-8/Chapter-8.vue'), name: 'chapter-8' },
      { path: 'unit-3-chapter-8-lesson-1', component: () => import('pages/chapter-8/LessonOne.vue'), name: 'unit-3-chapter-8-lesson-1' },
      { path: 'unit-3-chapter-8-lesson-2', component: () => import('pages/chapter-8/LessonTwo.vue'), name: 'unit-3-chapter-8-lesson-2' },
      { path: 'chapter-8-technology', component: () => import('pages/chapter-8/TechnologyFocus.vue'), name: 'chapter-8-technology' },
      { path: 'chapter-8-review', component: () => import('pages/chapter-8/ChapterReview.vue'), name: 'chapter-8-review' },
      { path: 'chapter-8-activity-12', component: () => import('pages/chapter-8/Activity-12.vue'), name: 'chapter-8-activity-12' },
      { path: 'chapter-8-test', component: () => import('pages/chapter-8/ChapterTest.vue'), name: 'chapter-8-test' },
      { path: 'chapter-8-stem-challenge', component: () => import('pages/chapter-8/StemChallenge.vue'), name: 'chapter-8-stem-challenge' },

      //Chapter 9
      { path: 'chapter-9', component: () => import('pages/chapter-9/Chapter-9.vue'), name: 'chapter-9' },
      { path: 'unit-3-chapter-9-lesson-1', component: () => import('pages/chapter-9/LessonOne.vue'), name: 'unit-3-chapter-9-lesson-1' },
      { path: 'unit-3-chapter-9-lesson-2', component: () => import('pages/chapter-9/LessonTwo.vue'), name: 'unit-3-chapter-9-lesson-2' },

      //Unit 4
      { path: 'chapter-10', component: () => import('pages/chapter-10/Chapter-10.vue'), name: 'chapter-10' },


      //Chapter 10
      { path: 'unit-4-chapter-10-lesson-1', component: () => import('pages/chapter-10/LessonOne.vue'), name: 'unit-4-chapter-10-lesson-1' },
      { path: 'mini-lab-10-2', component: () => import('pages/chapter-10/MiniLab10-2.vue'), name: 'mini-lab-10-1' },
      { path: 'mini-lab-10-3', component: () => import('pages/chapter-10/MiniLab10-3.vue'), name: 'mini-lab-10-3' },
      { path: 'mini-test-10-2', component: () => import('pages/chapter-10/MiniTest10-2.vue'), name: 'mini-test-10-2' },
      { path: 'mini-test-10-3', component: () => import('pages/chapter-10/MiniTest10-3.vue'), name: 'mini-test-10-3' },
      { path: 'mini-test-10-4', component: () => import('pages/chapter-10/MiniTest10-4.vue'), name: 'mini-test-10-4' },
      { path: 'mini-test-10-5', component: () => import('pages/chapter-10/MiniTest10-5.vue'), name: 'mini-test-10-5' },
      { path: 'unit-4-chapter-10-lesson-2', component: () => import('pages/chapter-10/LessonTwo.vue'), name: 'unit-4-chapter-10-lesson-2' },
      { path: 'unit-4-chapter-10-lesson-3', component: () => import('pages/chapter-10/LessonThree.vue'), name: 'unit-4-chapter-10-lesson-3' },
      { path: 'chapter-10-technology', component: () => import('pages/chapter-10/TechnologyFocus.vue'), name: 'chapter-10-technology' },
      { path: 'chapter-10-review', component: () => import('pages/chapter-10/ChapterReview.vue'), name: 'chapter-10-review' },
      { path: 'chapter-10-activity', component: () => import('pages/chapter-10/Activity-14.vue'), name: 'chapter-10-activity' },
      { path: 'chapter-10-test', component: () => import('pages/chapter-10/ChapterTest.vue'), name: 'chapter-10-test' },
      { path: 'chapter-10-stem', component: () => import('pages/chapter-10/StemChallenge.vue'), name: 'chapter-10-stem' },

      //Chapter 11
      { path: 'chapter-11', component: () => import('pages/chapter-11/Chapter-11.vue'), name: 'chapter-11' },
      { path: 'mini-test-11-1', component: () => import('pages/chapter-11/MiniTest11-1.vue'), name: 'mini-test-11-1' },
      { path: 'mini-test-11-3', component: () => import('pages/chapter-11/MiniTest11-3.vue'), name: 'mini-test-11-3' },
      { path: 'mini-test-11-4', component: () => import('pages/chapter-11/MiniTest11-4.vue'), name: 'mini-test-11-4' },
      { path: 'unit-4-chapter-11-lesson-1', component: () => import('pages/chapter-11/LessonOne.vue'), name: 'unit-4-chapter-11-lesson-1' },
      { path: 'unit-4-chapter-11-lesson-2', component: () => import('pages/chapter-11/LessonTwo.vue'), name: 'unit-4-chapter-11-lesson-2' },
      { path: 'chapter-11-technology', component: () => import('pages/chapter-11/TechnologyFocus.vue'), name: 'chapter-11-technology' },
      { path: 'chapter-11-review', component: () => import('pages/chapter-11/ChapterReview.vue'), name: 'chapter-11-review' },
      { path: 'chapter-11-activity-15', component: () => import('pages/chapter-11/Activity-15.vue'), name: 'chapter-11-activity-15' },
      { path: 'chapter-11-activity-16', component: () => import('pages/chapter-11/Activity-16.vue'), name: 'chapter-11-activity-16' },
      { path: 'chapter-11-test', component: () => import('pages/chapter-11/ChapterTest.vue'), name: 'chapter-11-test' },
      { path: 'chapter-11-stem', component: () => import('pages/chapter-11/StemChallenge.vue'), name: 'chapter-11-stem' },

      //Chapter 12
      { path: 'chapter-12', component: () => import('pages/chapter-12/Chapter-12.vue'), name: 'chapter-12' },
      { path: 'mini-test-12-1', component: () => import('pages/chapter-12/MiniTest12-1.vue'), name: 'mini-test-12-1' },
      { path: 'mini-test-12-2', component: () => import('pages/chapter-12/MiniTest12-2.vue'), name: 'mini-test-12-2' },
      { path: 'unit-4-chapter-12-lesson-1', component: () => import('pages/chapter-12/LessonOne.vue'), name: 'unit-4-chapter-12-lesson-1' },
      { path: 'unit-4-chapter-12-lesson-2', component: () => import('pages/chapter-12/LessonTwo.vue'), name: 'unit-4-chapter-12-lesson-2' },
      { path: 'chapter-12-technology', component: () => import('pages/chapter-12/TechnologyFocus.vue'), name: 'chapter-12-technology' },
      { path: 'chapter-12-review', component: () => import('pages/chapter-12/ChapterReview.vue'), name: 'chapter-12-review' },
      { path: 'chapter-12-activity-17', component: () => import('pages/chapter-12/Activity-17.vue'), name: 'chapter-12-activity-17' },
      { path: 'chapter-12-test', component: () => import('pages/chapter-12/ChapterTest.vue'), name: 'chapter-12-test' },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const englishRouter = [
  {
    path: '/word',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/word/index'),
        name: 'Word',
        meta: { title: '单词学习', icon: 'el-icon-notebook-2', affix: true }
      }
    ]
  },
  {
    path: '/listen',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/listen/index'),
        name: 'Listen',
        meta: { title: '听力训练', icon: 'el-icon-headset', affix: true }
      }
    ]
  },
  {
    path: '/grammar',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/grammar/index'),
        name: 'Grammar',
        meta: { title: '语法学习', icon: 'component', noCache: true }
      }
    ]
  },
  {
    path: '/write',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/write/index'),
        name: 'Write',
        meta: { title: '范文示例', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/practice',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/practice/index'),
        name: 'Practice',
        meta: { title: '真题训练', icon: 'education', noCache: true }
      }
    ]
  }

  // {
  //   path: '/essay',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Essay',
  //       meta: { title: '范文示例', icon: 'user', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/bank', // 题库
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Bank',
  //       meta: { title: '题库', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/answer', // 答案解析
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Answer',
  //       meta: { title: '答案解析', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/individuation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Individuation',
  //       meta: { title: '个性化学习', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/discuss',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Discuss',
  //       meta: { title: '讨论区', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

export default englishRouter

// import MarkdownIt from 'markdown-it';
// const md = new MarkdownIt();
// export function renderMarkdown(content) {
//   return md.render(content);
// }

export const statusMap = {
  finish: 'success',
  noUnderstand: 'warning',
  noKnow: 'danger',
  noStart: 'info',
  start: ''
}

export const statusText = {
  finish: '掌握啦',
  noUnderstand: '不理解',
  noKnow: '不知道',
  noStart: '未开始学习',
  start: '开始学习'
}

export const nameMap = {
  '5种基本代词': 'a',
  'IT的用法': 'b',
  '被动语态': 'c',
  '并列连词': 'd',
  '不定代词': 'e',
  '不定冠词': 'f',
  '不定式（短语）作定语、状语、独立成分': 'g',
  '不定式（短语）作主语、表语、宾语、补足语': 'h',
  '不定式的时态、复合结构及省略': 'i',
  '倒装': 'j',
  '定冠词': 'k',
  '定语从句': 'l',
  '动词的过去时': 'm',
  '动词的将来时': 'n',
  '动词的现在时': 'o',
  '动名词的结构和形式': 'p',
  '动名词在句子中的成分': 'q',
  '非限制性定语从句': 'r',
  '副词的功用': 's',
  '过去分词的结构': 't',
  '过去分词在句子中的成分': 'u',
  '基数词和序数词': 'v',
  '介词的种类、短语及搭配': 'w',
  '零冠词': 'x',
  '名词的格': 'y',
  '名词的数': 'z',
  '名词的性': 'aa',
  '名词性从句': 'bb',
  '强调结构': 'cc',
  '情态动词can、may、must的用法': 'dd',
  '情态动词的其他形式': 'ee',
  '省略': 'ff',
  '时间、货币和编码': 'gg',
  '现在分词的结构和时态': 'hh',
  '现在分词在句子中的成分': 'ii',
  '小数、分数、百分数': 'jj',
  '形容词的功用': 'kk',
  '形容词和副词的比较级': 'll',
  '虚拟语气在从句中的用法': 'mm',
  '一致关系': 'nn',
  '疑问代词和关系代词': 'oo',
  '在非真实条件句中的用法': 'pp',
  '助动词': 'qq',
  '状语从句(1)': 'rr',
  '状语从句(2)': 'ss'
}

export const fileMap = [
// {
//   title: '5种基本代词',
//   importance: 1,
//   status: 'noStart',
// }, {
//   title: 'IT的用法',
//   importance: 1,
//   status: 'noStart',
// },
  {
    title: '被动语态',
    importance: 1,
    status: 'noStart'
  }, {
    title: '并列连词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '不定代词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '不定冠词',
    importance: 1,
    status: 'noStart'
  },
  //  {
  //   title: '不定式（短语）作定语、状语、独立成分',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '不定式（短语）作主语、表语、宾语、补足语',
    importance: 1,
    status: 'noStart'
  },
  // {
  //   title: '不定式的时态、复合结构及省略',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '倒装',
    importance: 1,
    status: 'noStart'
  }, {
    title: '定冠词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '定语从句',
    importance: 1,
    status: 'noStart'
  },
  {
    title: '动词的现在时',
    importance: 1,
    status: 'noStart'
  },
  {
    title: '动词的过去时',
    importance: 1,
    status: 'noStart'
  },
  {
    title: '动词的将来时',
    importance: 1,
    status: 'noStart'
  },
  // {
  //   title: '动名词的结构和形式',
  //   importance: 1,
  //   status: 'noStart',
  // },
  //  {
  //   title: '动名词在句子中的成分',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '非限制性定语从句',
    importance: 1,
    status: 'noStart'
  },
  //  {
  //   title: '副词的功用',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '过去分词的结构',
    importance: 1,
    status: 'noStart'
  },
  //  {
  //   title: '过去分词在句子中的成分',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '基数词和序数词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '介词的种类、短语及搭配',
    importance: 1,
    status: 'noStart'
  }, {
    title: '零冠词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '名词的格',
    importance: 1,
    status: 'noStart'
  }, {
    title: '名词的数',
    importance: 1,
    status: 'noStart'
  }, {
    title: '名词的性',
    importance: 1,
    status: 'noStart'
  }, {
    title: '名词性从句',
    importance: 1,
    status: 'noStart'
  }, {
    title: '强调结构',
    importance: 1,
    status: 'noStart'
  },
  // {
  //   title: '情态动词can、may、must的用法',
  //   importance: 1,
  //   status: 'noStart',
  // },
  {
    title: '情态动词的其他形式',
    importance: 1,
    status: 'noStart'
  }, {
    title: '省略',
    importance: 1,
    status: 'noStart'
  }, {
    title: '时间、货币和编码',
    importance: 1,
    status: 'noStart'
  }, {
    title: '现在分词的结构和时态',
    importance: 1,
    status: 'noStart'
  }, {
    title: '现在分词在句子中的成分',
    importance: 1,
    status: 'noStart'
  }, {
    title: '小数、分数、百分数',
    importance: 1,
    status: 'noStart'
  }, {
    title: '形容词的功用',
    importance: 1,
    status: 'noStart'
  }, {
    title: '形容词和副词的比较级',
    importance: 1,
    status: 'noStart'
  }, {
    title: '虚拟语气在从句中的用法',
    importance: 1,
    status: 'noStart'
  }, {
    title: '一致关系',
    importance: 1,
    status: 'noStart'
  }, {
    title: '疑问代词和关系代词',
    importance: 1,
    status: 'noStart'
  }, {
    title: '在非真实条件句中的用法',
    importance: 1,
    status: 'noStart'
  }, {
    title: '助动词',
    importance: 1,
    status: 'noStart'
  }, , {
    title: '状语从句(1)',
    importance: 1,
    status: 'noStart'
  }, {
    title: '状语从句(2)',
    importance: 1,
    status: 'noStart'
  }]

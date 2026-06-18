import React from 'react';
const Blogs = () => {
  const articles = [
    {
      title: 'The Benefits of a Daily Yoga Practice',
      text: 'Incorporating yoga into your daily routine can improve flexibility, strength, and balance, while reducing stress and increasing mindfulness.',
      image: 'https://cdn3.vectorstock.com/i/1000x1000/34/07/yoga-infographics-benefits-of-yoga-practice-vector-10693407.jpg',
      href: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    },
    {
      title: 'How to Improve Your Mental Health',
      text: 'Daily meditation and mindful movement foster discipline, positive habits, and personal growth for long-term wellbeing.',
      image: 'https://tse3.mm.bing.net/th?id=OIP.ZgvmvG7Z4H9vbaj-w3X4KAHaEK&pid=Api&P=0&h=180',
      href: 'https://www.youtube.com/watch?v=GLhRgaQ7t40',
    },
    {
      title: 'The Power of Daily Practice',
      text: 'Consistent practice helps stabilize emotions, boost resilience, and create a more balanced and fulfilling life.',
      image: 'https://www.yogaexam.in/wp-content/uploads/2020/12/pexels-alexy-almond-3758127.jpg',
      href: 'https://www.youtube.com/watch?v=ZcDLzppD4Jc',
    },
    {
      title: 'How to Overcome Depression Naturally',
      text: 'Regular activity and mindfulness can naturally improve mood, reduce sadness, and support overall emotional healing.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.13o4WerOeQQAPNzp24lkbQHaE8&pid=Api&P=0&h=180',
      href: 'https://www.youtube.com/watch?v=F7zuUIqEnuo',
    },
    {
      title: 'How to Reduce Anxiety with Mindfulness',
      text: 'Meditation and breathing exercises calm the mind, manage stress, and foster inner peace with regular practice.',
      image: 'https://www.lifeberrys.com/img/article/yoga-for-concentration-1-1585552925-lb.jpg',
      href: 'https://www.youtube.com/watch?v=5t5IkSZ2-3g',
    },
    {
      title: 'Improving Relationships Through Emotional Intelligence',
      text: 'Empathy and communication strengthen connections and build a supportive foundation for healthier relationships.',
      image: 'https://mkvyoga.com/wp-content/uploads/2018/07/depression-yoga.jpg',
      href: 'https://www.youtube.com/watch?v=2EqQ4es2Nps',
    },
  ];

  return (
    <aside aria-label="Related articles" className="py-8 lg:py-24 bg-gray-50 text-slate-900">
      <div className="px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-8 text-3xl font-bold">Blogs</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <a href="#">
                <img src={article.image} className="mb-5 w-full rounded-3xl object-cover" alt={article.title} />
              </a>
              <h2 className="mb-3 text-xl font-semibold leading-tight text-slate-900">
                <a href="#">{article.title}</a>
              </h2>
              <p className="mb-5 text-sm text-slate-600">{article.text}</p>
              <a href={article.href} target="_blank" rel="noreferrer" className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
                See This
              </a>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Blogs;



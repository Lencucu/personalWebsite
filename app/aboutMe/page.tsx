// AboutMe.jsx
// import { Mail, User } from 'lucide-react'; // 图标库
import { useMemo } from 'react';

export default function Page() {
  const birthday = new Date('2000-10-21'); // 🎂 修改你的生日
  const age = useMemo(() => {
    const now = new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > birthday.getMonth() ||
      (now.getMonth() === birthday.getMonth() && now.getDate() >= birthday.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
  }, [birthday]);

  return (
    <section className="border-1 border-black max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 flex flex-col items-center space-y-4">
      <img
        src="/images/aboutMe/lc.svg"
        alt="avatar"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="text-center">
        <h2 className="text-xl font-semibold">蓝库</h2>
        {/*<p className="text-gray-600 text-sm">前端爱好者 · React & 动效</p>*/}
      </div>
      <div className="flex items-center text-sm text-gray-700 space-x-2">
        {/*<User className="w-4 h-4" />*/}
        <span>{age}</span>
        <span>♂</span>
      </div>
      <div className="flex items-center text-sm text-blue-600">
        {/*<Mail className="w-4 h-4 mr-1" />*/}
        <a href="mailto:lencucu@aliyun.com">lencucu@aliyun.com</a>
      </div>
    </section>
  );
}

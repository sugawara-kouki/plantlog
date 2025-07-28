import { RiSunLine } from '@remixicon/react';

/**
 * ホーム画面のウェルカムセクション
 *
 * 時間帯に応じた挨拶と天気アイコンを表示
 */
export default function WelcomeSection() {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2 lg:text-2xl">
              おはようございます！
            </h2>
            <p className="text-white/90 text-sm lg:text-base">
              今日も植物たちの様子を確認しましょう
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center lg:w-20 lg:h-20">
            <RiSunLine className="w-8 h-8 text-white lg:w-10 lg:h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

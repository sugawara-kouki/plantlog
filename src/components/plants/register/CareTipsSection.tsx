import { RiInformationLine } from '@remixicon/react';

export default function CareTipsSection() {
  return (
    <div className="lg:col-span-2">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
            <RiInformationLine className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              植物のお世話のコツ
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 植物の成長記録を定期的に記録しましょう</li>
              <li>• 写真を撮って成長の変化を確認しましょう</li>
              <li>• 水やりのタイミングを守ることが大切です</li>
              <li>• 植物の状態を観察して必要に応じて調整しましょう</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

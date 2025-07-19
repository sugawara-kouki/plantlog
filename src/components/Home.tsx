import { HomeProps } from '@/types/Home.types';
import Header from './Header';
import WelcomeSection from './WelcomeSection';
import QuickActions from './QuickActions';
import TodaysTasks from './TodaysTasks';
import MyPlantsSection from './MyPlantsSection';
import StatisticsCard from './StatisticsCard';
import RecentActivity from './RecentActivity';
import BottomNavigation from './BottomNavigation';

/**
 * ホーム画面のメインコンポーネント
 *
 * 植物観察アプリのダッシュボード機能を提供
 * レスポンシブデザインで、モバイルとデスクトップに対応
 */
export default function Home({
  user = { name: '田中太郎', initial: '田' },
  todaysTasks = [],
  myPlants = [],
  statistics = { totalPlants: 3, monthlyRecords: 12, wateringDue: 1 },
  recentActivity = [],
  onRegisterPlant,
  onAddRecord,
  onManageWatering,
  onCompleteTask,
  onEditPlant,
  onWaterPlant,
}: HomeProps) {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <Header user={user} />

      {/* Main Content */}
      <main className="max-w-sm mx-auto px-4 py-6 lg:max-w-6xl lg:px-8 lg:py-8">
        <WelcomeSection />

        <QuickActions
          onRegisterPlant={onRegisterPlant}
          onAddRecord={onAddRecord}
          isMobile={true}
        />

        {/* Main Content Grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <TodaysTasks tasks={todaysTasks} onCompleteTask={onCompleteTask} />

            <MyPlantsSection
              plants={myPlants}
              onEditPlant={onEditPlant}
              onWaterPlant={onWaterPlant}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden lg:block">
            <QuickActions
              onRegisterPlant={onRegisterPlant}
              onAddRecord={onAddRecord}
              onManageWatering={onManageWatering}
              isMobile={false}
            />

            <StatisticsCard statistics={statistics} />

            <RecentActivity activities={recentActivity} />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

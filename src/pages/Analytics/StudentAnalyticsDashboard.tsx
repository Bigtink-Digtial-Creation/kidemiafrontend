import { useState, useEffect } from 'react';
import {
  Award,
  Star, Flame, LayoutDashboard, Map, Compass
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useDisclosure } from '@heroui/react'; // Added

import { ApiSDK } from '../../sdk';
import GamificationBadge from './components/GamificationBadge';
import TabButton from './components/TabButton';
import OverviewSection from './components/OverviewSection';
import TopicSection from './components/TopicSection';
import StudyPlanSection from './components/StudyPlanSection';
import { getApiErrorMessage } from "../../utils/errorParser";
import { AccessDeniedModal } from "../../components/AccessDeniedModal"; // Added

export default function StudentAnalyticsDashboard() {
  const { studentId } = useParams<{ studentId: string }>();
  const [activeView, setActiveView] = useState<'overview' | 'topics' | 'study-plan'>('overview');

  // --- Modal State ---
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalConfig, setModalConfig] = useState<{
    type: "subscription" | "token" | "general";
    message: string;
  }>({ type: "general", message: "" });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studentAnalytics', studentId],
    queryFn: () =>
      ApiSDK.AnalyticsService.getStudentDashboardApiV1AnalyticsReportStudentStudentIdGet(studentId!),
    retry: false,
    enabled: !!studentId,
  });

  // --- Handle Analytics Errors ---
  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      const is402 = err?.status === 402;
      // const detail = err?.body?.detail;

      const displayMessage = is402
        ? ("You need a subscription to view detailed analytics and Study Recommendation.")
        : (getApiErrorMessage(err) || "Failed to load analytics report.");

      setModalConfig({
        type: is402 ? "subscription" : "general",
        message: displayMessage,
      });
      onOpen();
    }
  }, [isError, error, onOpen]);

  // If loading, show pulse
  if (isLoading) return <LoadingState />;

  // If error, we show the loading state background while the Modal is open 
  // to prevent the "header" from crashing due to missing 'data'
  if (isError || !data) {
    return (
      <>
        <AccessDeniedModal
          isOpen={isOpen}
          onClose={onClose}
          type={modalConfig.type}
          message={modalConfig.message}
        />
        <LoadingState />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Access Control Modal */}
      <AccessDeniedModal
        isOpen={isOpen}
        onClose={onClose}
        type={modalConfig.type}
        message={modalConfig.message}
      />

      {/* 1. Brand Hero Header */}
      <header className="relative overflow-hidden rounded-2xl bg-kidemia-secondary/5 p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              Hello, Scholar!
            </h1>
            <p className="text-slate-900 text-base md:text-lg max-w-md">
              You've mastered <span className="text-kidemia-primary font-semibold">
                {data.topic_breakdown?.filter(t => t.mastery_level === 'MASTERED').length || 0} topics
              </span> this month. Keep up the momentum!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <GamificationBadge icon={<Award className="text-orange-500" />} label="Level" value={data.performance_summary?.gamification?.level || 1} />
            <GamificationBadge icon={<Flame className="text-orange-500" />} label="Streak" value={`${data.performance_summary?.gamification?.current_streak || 0}d`} />
            <GamificationBadge icon={<Star className="text-orange-500" />} label="Points" value={data.performance_summary?.gamification?.total_points || 0} />
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-kidemia-primary/10 blur-[100px]" />
      </header>

      {/* 2. Professional Navigation Tabs */}
      <nav className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
        <TabButton
          active={activeView === 'overview'}
          onClick={() => setActiveView('overview')}
          icon={<LayoutDashboard size={18} />}
          label="Overview"
        />
        <TabButton
          active={activeView === 'topics'}
          onClick={() => setActiveView('topics')}
          icon={<Map size={18} />}
          label="Topics"
        />
        <TabButton
          active={activeView === 'study-plan'}
          onClick={() => setActiveView('study-plan')}
          icon={<Compass size={18} />}
          label="Study Plan"
        />
      </nav>

      {/* 3. Main Content Area */}
      <main className="min-h-[600px]">
        {activeView === 'overview' && <OverviewSection data={data} />}
        {activeView === 'topics' && <TopicSection data={data} />}
        {activeView === 'study-plan' && <StudyPlanSection data={data} />}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-pulse">
      <div className="w-12 h-12 border-4 border-kidemia-primary/20 border-t-kidemia-primary rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-medium">Preparing your personalized Analytics and Study Recommendation...</p>
    </div>
  );
}
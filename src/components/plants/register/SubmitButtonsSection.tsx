'use client';

interface SubmitButtonsSectionProps {
  onRegister: () => void;
  isSubmitting: boolean;
}

export default function SubmitButtonsSection({
  onRegister,
  isSubmitting,
}: SubmitButtonsSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onRegister}
          disabled={isSubmitting}
          className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '登録中...' : '植物を登録'}
        </button>
      </div>
    </div>
  );
}

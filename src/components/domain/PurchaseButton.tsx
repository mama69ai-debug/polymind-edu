'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface PurchaseButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
}

export function PurchaseButton({ courseId, courseSlug, isEnrolled }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/auth/login?redirect=/courses/${courseSlug}`);
          return;
        }
        
        console.error('Checkout error:', data);
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error instanceof Error ? error.message : '購買失敗，請稍後再試';
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        variant="primary"
        onClick={() => router.push(`/courses/${courseSlug}/learn`)}
      >
        進入學習頁
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={handlePurchase}
      loading={isLoading}
      disabled={isLoading}
    >
      購買課程
    </Button>
  );
}
